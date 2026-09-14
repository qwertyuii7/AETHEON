import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface Beat {
  frameStart: number;
  frameEnd: number;
  text: string;
  align: 'left' | 'center' | 'right';
  image?: string;
}

export interface SceneData {
  id: string;
  frameCount: number;
  framePath: string;
  beats: Beat[];
}

interface SceneProps {
  scene: SceneData;
  scrollContainerId: string;
  scrollStart: string;
  scrollEnd: string;
}

export const Scene: React.FC<SceneProps> = ({ scene, scrollContainerId, scrollStart, scrollEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const pendingFrameRef = useRef<number | null>(null);

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[frameIndex];

    if (ctx && img && img.complete && img.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const cw = canvas.width;
      const ch = canvas.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;

      let dw = cw, dh = ch, ox = 0, oy = 0;
      if (imgRatio > canvasRatio) {
        dw = ch * imgRatio;
        ox = (cw - dw) / 2;
      } else {
        dh = cw / imgRatio;
        oy = (ch - dh) / 2;
      }

      ctx.drawImage(img, ox, oy, dw, dh);
      currentFrameRef.current = frameIndex;
    }
  }, []);

  // Throttled draw — only draw once per rAF to prevent lag
  const requestDraw = useCallback((frameIndex: number) => {
    pendingFrameRef.current = frameIndex;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (pendingFrameRef.current !== null) {
        drawFrame(pendingFrameRef.current);
        pendingFrameRef.current = null;
      }
      rafRef.current = 0;
    });
  }, [drawFrame]);

  // Preload — load every 3rd frame first for instant perceived loading, 
  // then fill in the gaps
  useEffect(() => {
    imagesRef.current = new Array(scene.frameCount);
    let loaded = 0;

    const loadFrame = (i: number) => {
      const img = new Image();
      const frameIndex = String(i + 1).padStart(4, '0');
      img.src = scene.framePath.replace('%04d', frameIndex);
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (i === 0) drawFrame(0);
      };
      imagesRef.current[i] = img;
    };

    // Priority pass: every 3rd frame for instant scrubbing
    for (let i = 0; i < scene.frameCount; i += 3) loadFrame(i);
    // Fill pass: remaining frames
    requestAnimationFrame(() => {
      for (let i = 0; i < scene.frameCount; i++) {
        if (i % 3 !== 0) loadFrame(i);
      }
    });
  }, [scene.framePath, scene.frameCount, drawFrame]);

  // Resize canvas — debounced, set dimensions once
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      drawFrame(currentFrameRef.current);
    };

    let timer: ReturnType<typeof setTimeout>;
    const debounced = () => { clearTimeout(timer); timer = setTimeout(resize, 150); };
    resize();
    window.addEventListener('resize', debounced);
    return () => { window.removeEventListener('resize', debounced); clearTimeout(timer); };
  }, [drawFrame]);

  // GSAP ScrollTrigger
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const trigger = document.getElementById(scrollContainerId);
    if (!trigger) return;

    const frameObj = { frame: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: scrollStart,
        end: scrollEnd,
        scrub: 0.15, // tighter scrub for less lag
      }
    });

    tl.to(frameObj, {
      frame: scene.frameCount - 1,
      snap: 'frame',
      ease: 'none',
      duration: scene.frameCount,
      onUpdate: () => {
        const f = Math.round(frameObj.frame);
        // If we skipped loading intermediate frames, find nearest loaded
        const img = imagesRef.current[f];
        if (img && img.complete) {
          requestDraw(f);
        } else {
          // Find nearest loaded frame
          for (let d = 1; d < 4; d++) {
            const lo = imagesRef.current[f - d];
            if (lo && lo.complete) { requestDraw(f - d); break; }
            const hi = imagesRef.current[f + d];
            if (hi && hi.complete) { requestDraw(f + d); break; }
          }
        }
      }
    }, 0);

    // Text beat animations
    scene.beats.forEach((beat, i) => {
      const el = textRefs.current[i];
      if (!el) return;

      tl.fromTo(el,
        { opacity: 0, y: 30, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 20, ease: 'power2.out' },
        beat.frameStart
      );

      tl.to(el,
        { opacity: 0, y: -25, filter: 'blur(4px)', duration: 12, ease: 'power2.in' },
        beat.frameEnd - 12
      );
    });

    return () => { tl.kill(); };
  }, [scene, scrollContainerId, scrollStart, scrollEnd, drawFrame, requestDraw]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* Loading */}
      {loadedCount < scene.frameCount && (
        <div className="absolute bottom-4 right-4 text-[0.65rem] tracking-[0.2em] text-gold opacity-50 z-50 pointer-events-none">
          {Math.round((loadedCount / scene.frameCount) * 100)}%
        </div>
      )}

      {/* Text overlays */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {scene.beats.map((beat, i) => {
          let alignClass = "items-center text-center px-[8%]";
          if (beat.align === 'left') {
            alignClass = "items-start text-left pl-[10%] pr-[30%]";
          } else if (beat.align === 'right') {
            alignClass = "items-end text-right pr-[10%] pl-[30%]";
          }

          return (
            <div key={i} className={`absolute inset-0 flex flex-col justify-center ${alignClass}`}>
              <div
                ref={el => { textRefs.current[i] = el; }}
                className={`font-serif text-[clamp(1.6rem,3.5vw,3.2rem)] tracking-[0.04em] font-normal leading-snug text-white max-w-[900px] opacity-0 flex ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center justify-center gap-[clamp(32px,6vw,80px)] px-[clamp(20px,5vw,60px)] py-4`}
                style={{
                  textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.8), 0 10px 40px rgba(0,0,0,0.9)',
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 65%)',
                  textAlign: beat.align,
                }}
              >
                {beat.image && (
                  <img
                    src={beat.image}
                    alt="Sculpture"
                    className="w-[clamp(100px,14vw,160px)] aspect-[3/4] object-cover rounded shadow-[0_20px_60px_rgba(0,0,0,0.8)] shrink-0"
                  />
                )}
                <span>{beat.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
