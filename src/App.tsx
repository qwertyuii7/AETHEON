import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { Navbar } from './components/Navbar';
import { HeroScroll } from './components/HeroScroll';
import { ModelShowcase } from './components/ModelShowcase';
import { Products } from './components/Products';
import { Newsletter } from './components/Newsletter';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Loader } from './components/Loader';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {

  // Lenis smooth scroll
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Removed touchMultiplier to prevent mobile scroll glitching
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-ink min-h-screen text-ivory font-sans">
      <Loader />
      <Navbar />
      <HeroScroll />
      <ModelShowcase />
      <Products />
      <Newsletter />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
