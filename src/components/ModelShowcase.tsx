import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage } from '@react-three/drei';

function StatueModel() {
  // Load the GLTF model from the local directory
  const { scene } = useGLTF('/models/greek-statue/source/Greek Statue.glb');
  
  // The scale and position might need tweaking based on the actual model dimensions.
  // Generally, scaling by 1 is safe, but we can center it and scale it to fit.
  return (
    <primitive 
      object={scene} 
      rotation={[0, -Math.PI / 4, 0]} 
    />
  );
}

export const ModelShowcase: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 2D Particle Animation Effect (Golden sprinkling aura)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number, y: number, r: number, vx: number, vy: number, alpha: number, life: number, maxLife: number }[] = [];
    let animationFrameId: number;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    window.addEventListener('resize', resize);
    resize();

    const createParticle = () => {
      // Spawn particles near the center bottom (the shadow area)
      const cx = canvas.width / 2;
      const cy = canvas.height * 0.85; 
      
      const spread = canvas.width * 0.15; 
      const x = cx + (Math.random() - 0.5) * spread;
      const y = cy + (Math.random() - 0.5) * 20;

      return {
        x,
        y,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 1.5 - 0.5,
        alpha: 0,
        life: 0,
        maxLife: Math.random() * 100 + 80
      };
    };

    for(let i = 0; i < 40; i++) particles.push(createParticle());

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.3 && particles.length < 150) {
        particles.push(createParticle());
        particles.push(createParticle());
      }

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.2) {
          p.alpha = lifeRatio * 5; 
        } else {
          p.alpha = 1 - ((lifeRatio - 0.2) / 0.8);
        }

        if (p.life >= p.maxLife) {
          particles[i] = createParticle();
          p = particles[i];
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 162, 39, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(201, 162, 39, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0; 
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full bg-ink flex flex-col items-center justify-center py-[100px] px-5 overflow-visible">
      
      {/* Background radial gradient to frame the section */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(201,162,39,0.05) 0%, rgba(0,0,0,0) 70%)' }}
      />

      <div className="text-center mb-[60px] z-10 max-w-[800px] px-4">
        <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4 font-sans">
          Featured Masterpiece
        </p>
        <h2 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] text-ivory m-0 mb-6 font-normal drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
          The Immortal Visage
        </h2>
        <p className="font-sans text-ivory/70 text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed m-0">
          Examine every fracture and curve. A testament to antiquity, captured in three dimensions.
        </p>
      </div>

      {/* The 3D Showcase Container */}
      <div className="relative w-full max-w-[1000px] h-[60vh] min-h-[400px] md:min-h-[500px] z-5 flex justify-center items-center" style={{ perspective: '1000px' }}>
        
        {/* Canvas for golden sprinkling aura (Behind the 3D model) */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        />

        {/* Golden glow behind the model to enhance the Stage */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[10%] w-[60%] h-[60%] z-[2] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,162,39,0.15) 0%, transparent 70%)' }}
        />

        {/* Native React Three Fiber WebGL Canvas */}
        <div className="relative w-full h-full z-10 rounded-xl overflow-visible bg-transparent">
          <Canvas shadows camera={{ position: [0, 0, 10], fov: 40 }}>
            <Suspense fallback={null}>
              <Stage 
                environment="city" 
                intensity={0.5} 
                adjustCamera={1.2} // 1.2 adds a nice margin so it's not strictly cropped
                shadows="contact" // beautiful contact shadows built-in
              >
                <StatueModel />
              </Stage>
            </Suspense>

            {/* Orbit controls for user interaction and slow auto-rotation */}
            <OrbitControls 
              autoRotate 
              autoRotateSpeed={0.8} 
              enableZoom={false} 
              enablePan={false}
              minPolarAngle={Math.PI / 2.5}
              maxPolarAngle={Math.PI / 2.1} // Keeps camera relatively level
            />
          </Canvas>
        </div>
      </div>
    </section>
  );
};
