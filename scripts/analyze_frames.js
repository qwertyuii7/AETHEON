import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const SCENES = [
  { id: 'scene-1', name: 'Courtyard' },
  { id: 'scene-2', name: 'Temple Interior' },
  { id: 'scene-3', name: 'Sky/Gods' }
];

const BEATS_PER_SCENE = 3;
const WINDOW_SIZE = 25; // minimum ~15-20 frames per beat, let's use 25
const DOWNSAMPLE_SIZE = 64;

async function analyzeScene(sceneId) {
  const framesDir = path.join(process.cwd(), 'public', 'frames', sceneId);
  const files = await fs.readdir(framesDir);
  const webpFiles = files.filter(f => f.endsWith('.webp')).sort();
  
  const frameStats = [];
  let prevRawBuffer = null;

  console.log(`Analyzing ${sceneId} (${webpFiles.length} frames)...`);

  for (let i = 0; i < webpFiles.length; i++) {
    const file = webpFiles[i];
    const filePath = path.join(framesDir, file);
    
    // Read stats for intra-frame detail
    const image = sharp(filePath);
    const stats = await image.stats();
    // Use the maximum stdDev across channels as the detail metric
    const stdDev = Math.max(...stats.channels.map(c => c.stdev));

    // Calculate inter-frame difference
    // Downsample to 64x64 grayscale for fast comparison
    const rawBuffer = await sharp(filePath)
      .resize(DOWNSAMPLE_SIZE, DOWNSAMPLE_SIZE)
      .grayscale()
      .raw()
      .toBuffer();

    let diffScore = 0;
    if (prevRawBuffer) {
      let sumDiff = 0;
      for (let j = 0; j < rawBuffer.length; j++) {
        sumDiff += Math.abs(rawBuffer[j] - prevRawBuffer[j]);
      }
      diffScore = sumDiff / rawBuffer.length; // Average pixel diff
    }
    prevRawBuffer = rawBuffer;

    frameStats.push({
      frameIndex: i,
      stdDev,
      diffScore
    });
  }

  // Normalize stats to 0-1 range to combine them
  const maxStdDev = Math.max(...frameStats.map(f => f.stdDev));
  const maxDiff = Math.max(...frameStats.map(f => f.diffScore));

  frameStats.forEach(f => {
    const normStdDev = f.stdDev / (maxStdDev || 1);
    const normDiff = f.diffScore / (maxDiff || 1);
    // Weight them: motion (inter-frame diff) is very disruptive, so weight it highly.
    f.busyness = (normStdDev * 0.3) + (normDiff * 0.7);
  });

  // Find calm windows
  const windows = [];
  for (let i = 0; i <= frameStats.length - WINDOW_SIZE; i++) {
    let sumBusyness = 0;
    for (let j = i; j < i + WINDOW_SIZE; j++) {
      sumBusyness += frameStats[j].busyness;
    }
    windows.push({
      start: i,
      end: i + WINDOW_SIZE - 1,
      avgBusyness: sumBusyness / WINDOW_SIZE
    });
  }

  // Sort windows by calmness (lowest busyness)
  // To prevent overlapping windows, we aggressively filter
  windows.sort((a, b) => a.avgBusyness - b.avgBusyness);
  
  const selectedWindows = [];
  for (const win of windows) {
    if (selectedWindows.length >= BEATS_PER_SCENE) break;
    // Check for overlap
    const overlap = selectedWindows.some(w => 
      (win.start >= w.start && win.start <= w.end) || 
      (win.end >= w.start && win.end <= w.end) ||
      Math.abs(win.start - w.start) < 40 // keep them somewhat separated (at least 40 frames apart)
    );
    if (!overlap) {
      selectedWindows.push(win);
    }
  }

  // Sort chronologically
  selectedWindows.sort((a, b) => a.start - b.start);

  return {
    sceneId,
    frameCount: webpFiles.length,
    calmWindows: selectedWindows
  };
}

const PLACEHOLDER_TEXT = [
  "In the hour before the gods wake,",
  "the marble remembers every footstep.",
  "This is where the story begins.",
  "Shadows lengthen in the sacred halls,",
  "where prayers turn to stone,",
  "and silence is an offering.",
  "Above the mortal realm they watch,",
  "woven into the fabric of the sky,",
  "eternal and unchanging."
];
const ALIGNS = ["left", "center", "right"];

async function run() {
  const results = [];
  for (const scene of SCENES) {
    const res = await analyzeScene(scene.id);
    results.push(res);
  }

  // Generate story.json
  const story = {
    scenes: results.map((res, i) => {
      return {
        id: SCENES[i].name,
        frameCount: res.frameCount,
        framePath: `/frames/${res.sceneId}/frame_%04d.webp`,
        beats: res.calmWindows.map((win, j) => {
          const textIdx = i * 3 + j;
          return {
            frameStart: win.start,
            frameEnd: win.end,
            text: PLACEHOLDER_TEXT[textIdx] || "Placeholder text.",
            align: ALIGNS[j % ALIGNS.length]
          };
        })
      };
    })
  };

  const dataDir = path.join(process.cwd(), 'src', 'data');
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, 'story.json'), JSON.stringify(story, null, 2));

  // Generate FRAME_ANALYSIS.md
  let md = "# Frame Analysis Report\n\n";
  md += "This report details the 'calm' windows identified through programmatic analysis of both intra-frame detail (stdDev) and inter-frame motion (pixel differencing).\n\n";

  for (const res of results) {
    md += `## ${SCENES.find(s => s.id === res.sceneId).name} (${res.sceneId})\n`;
    md += `- **Total Frames:** ${res.frameCount}\n`;
    md += `- **Calm Windows Found:**\n`;
    res.calmWindows.forEach((win, idx) => {
      md += `  - **Beat ${idx + 1}:** Frames ${win.start} to ${win.end} (Avg Busyness Score: ${win.avgBusyness.toFixed(4)})\n`;
    });
    md += "\n";
  }

  await fs.writeFile(path.join(process.cwd(), 'FRAME_ANALYSIS.md'), md);
  console.log("Analysis complete. Generated story.json and FRAME_ANALYSIS.md");
}

run().catch(console.error);
