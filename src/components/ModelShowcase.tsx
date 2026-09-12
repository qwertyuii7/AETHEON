import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Stage } from '@react-three/drei';

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
    <section ref={containerRef} style={{
      position: 'relative',
      width: '100%',
      backgroundColor: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 20px',
      overflow: 'visible'
    }}>
      
      {/* Background radial gradient to frame the section */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '80%',
        background: 'radial-gradient(circle, rgba(201,162,39,0.05) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        textAlign: 'center',
        marginBottom: '60px',
        zIndex: 10,
        maxWidth: '800px'
      }}>
        <p style={{
          fontSize: '0.7rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: '#C9A227',
          marginBottom: '16px',
          fontFamily: "'Inter', sans-serif"
        }}>
          Featured Masterpiece
        </p>
        <h2 style={{
          fontFamily: "'Ethereal Nymeria', serif",
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          color: '#EDE6D6',
          margin: '0 0 24px 0',
          fontWeight: 400,
          textShadow: '0 4px 30px rgba(0,0,0,0.8)'
        }}>
          The Immortal Visage
        </h2>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          color: 'rgba(237, 230, 214, 0.7)',
          fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
          lineHeight: 1.6,
          margin: 0
        }}>
          Examine every fracture and curve. A testament to antiquity, captured in three dimensions.
        </p>
      </div>

      {/* The 3D Showcase Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1000px',
        height: '60vh',
        minHeight: '500px',
        zIndex: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        perspective: '1000px'
      }}>
        
        {/* Canvas for golden sprinkling aura (Behind the 3D model) */}
        <canvas 
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Golden glow behind the model to enhance the Stage */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -10%)',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(201,162,39,0.15) 0%, transparent 70%)',
          zIndex: 2,
          pointerEvents: 'none'
        }} />

        {/* Native React Three Fiber WebGL Canvas */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          zIndex: 10,
          borderRadius: '12px',
          overflow: 'visible',
          background: 'transparent'
        }}>
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
