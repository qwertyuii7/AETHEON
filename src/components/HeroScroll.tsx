import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scene } from './Scene';
import { WaterRipple } from './WaterRipple';
import storyData from '../data/story.json';

gsap.registerPlugin(ScrollTrigger);

const HERO_ID = 'hero-scroll-container';

export const HeroScroll: React.FC = () => {
  const [rippleVisible, setRippleVisible] = useState(true);

  // Paper-tear transitions at scene boundaries
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const container = document.getElementById(HERO_ID);
    if (!container) return;

    // Elegant opacity crossfade transitions between scenes
    
    // Scene 0 → Scene 1 fade
    const scene0 = document.getElementById('scene-layer-0');
    if (scene0) {
      gsap.fromTo(scene0,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.inOut',
          scrollTrigger: { trigger: container, start: '30% top', end: '36% top', scrub: true }
        }
      );
    }

    // Scene 1 → Scene 2 fade
    const scene1 = document.getElementById('scene-layer-1');
    if (scene1) {
      gsap.fromTo(scene1,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.inOut',
          scrollTrigger: { trigger: container, start: '63% top', end: '69% top', scrub: true }
        }
      );
    }

    // Fade out the ripple as user starts scrolling
    ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '5% top',
      onUpdate: (self) => {
        setRippleVisible(self.progress < 0.3);
      }
    });

    return () => { ScrollTrigger.getAll().forEach(st => st.kill()); };
  }, []);

  return (
    <div id={HERO_ID} style={{ position: 'relative', width: '100%', height: '900vh' }}>
      <div style={{
        position: 'sticky', top: 0, width: '100%', height: '100vh',
        overflow: 'hidden', backgroundColor: '#000000',
      }}>

        {storyData.scenes.map((scene: any, i: number) => {
          const starts = ['top top', '33.3% top', '66.6% top'];
          const ends = ['33.3% top', '66.6% top', 'bottom top'];

          return (
            <div 
              key={scene.id}
              id={`scene-layer-${i}`} 
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 10 - i }}
            >
              <Scene scene={scene} scrollContainerId={HERO_ID} scrollStart={starts[i]} scrollEnd={ends[i]} />
            </div>
          );
        })}

        {/* Water ripple overlay — only on first viewport, fades as you scroll */}
        <WaterRipple visible={rippleVisible} />

        {/* Scroll indicator at bottom of first viewport */}
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          opacity: rippleVisible ? 0.6 : 0, transition: 'opacity 0.5s',
          pointerEvents: 'none',
        }}>
          <span style={{
            fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#EDE6D6',
          }}>Scroll to explore</span>
          <div style={{
            width: '1px', height: '40px', background: 'linear-gradient(to bottom, #C9A227, transparent)',
          }} />
        </div>
        
      </div>
    </div>
  );
};
