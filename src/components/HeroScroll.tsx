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
    <div id={HERO_ID} className="relative w-full h-[900vh]">
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-ink">

        {storyData.scenes.map((scene: any, i: number) => {
          const starts = ['top top', '33.3% top', '66.6% top'];
          const ends = ['33.3% top', '66.6% top', 'bottom top'];

          return (
            <div 
              key={scene.id}
              id={`scene-layer-${i}`} 
              className="absolute inset-0 w-full h-full"
              style={{ zIndex: 10 - i }}
            >
              <Scene scene={scene} scrollContainerId={HERO_ID} scrollStart={starts[i]} scrollEnd={ends[i]} />
            </div>
          );
        })}

        {/* Water ripple overlay — only on first viewport, fades as you scroll */}
        <WaterRipple visible={rippleVisible} />

        {/* Scroll indicator at bottom of first viewport */}
        <div 
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-500 ${rippleVisible ? 'opacity-60' : 'opacity-0'}`}
        >
          <span className="text-[0.6rem] tracking-[0.3em] uppercase text-ivory">
            Scroll to explore
          </span>
          <div className="w-[1px] h-[40px] bg-gradient-to-b from-gold to-transparent" />
        </div>
        
      </div>
    </div>
  );
};
