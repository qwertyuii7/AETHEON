import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useProgress } from '@react-three/drei';

const quotes = [
  "The marble holds the form, the mind sets it free.",
  "Eternity captured in a fleeting glance.",
  "Time is the sculptor, we are the stone.",
  "Art is the signature of civilizations.",
];

export const Loader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const { progress } = useProgress();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  // Fake progress to ensure the loader stays on screen for a minimum time
  // even if the 3D model loads instantly from cache.
  const [fakeProgress, setFakeProgress] = useState(0);

  useEffect(() => {
    // Cycle quotes every 2.5 seconds
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
      
      // Animate quote change
      if (quoteRef.current) {
        gsap.fromTo(quoteRef.current, 
          { opacity: 0, y: 10, filter: 'blur(4px)' }, 
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.out' }
        );
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animate fake progress to 100% over 4 seconds
    const obj = { p: 0 };
    gsap.to(obj, {
      p: 100,
      duration: 4,
      ease: 'power1.inOut',
      onUpdate: () => {
        setFakeProgress(obj.p);
      }
    });
  }, []);

  // Determine actual display progress (minimum of real progress and fake progress)
  // This ensures we wait for BOTH the 3D model AND the minimum time to pass.
  const displayProgress = Math.min(progress, fakeProgress);

  useEffect(() => {
    if (displayProgress >= 99 && !isReady) {
      setIsReady(true);
      
      // Animate loader out
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 1.5,
          ease: 'power4.inOut',
          delay: 0.5, // short pause at 100%
          onComplete: () => {
            document.body.style.overflow = 'auto'; // Unlock scroll when done
          }
        });
      }
    }
  }, [displayProgress, isReady]);

  // Lock scroll on mount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[999] bg-ink flex flex-col items-center justify-center pointer-events-auto"
    >
      <div className="flex flex-col items-center justify-center max-w-[800px] px-8 text-center">
        {/* Brand Name */}
        <h1 className="font-serif text-3xl md:text-5xl tracking-[0.2em] text-ivory mb-16 opacity-80">
          AETHEON
        </h1>
        
        {/* Quote */}
        <div className="h-[80px] flex items-center justify-center">
          <p 
            ref={quoteRef}
            className="font-sans text-[clamp(0.9rem,1.2vw,1.1rem)] text-ivory/60 italic leading-relaxed m-0"
          >
            "{quotes[quoteIndex]}"
          </p>
        </div>

        {/* Progress Bar & Number */}
        <div className="mt-16 w-full max-w-[300px] flex flex-col items-center gap-4">
          <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gold"
              style={{ width: `${displayProgress}%`, transition: 'width 0.2s ease-out' }}
            />
          </div>
          <span className="font-serif text-gold text-xs tracking-[0.2em]">
            {Math.round(displayProgress)}%
          </span>
        </div>
      </div>
    </div>
  );
};
