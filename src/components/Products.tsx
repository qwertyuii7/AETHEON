import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sculptures = [
  { id: 1, name: "Angel Cybersigilism", price: "$2,400", category: "Monumental Figure", image: "/images/sculptures/angel cybersigilism.jpg" },
  { id: 2, name: "Classic Bust", price: "$1,850", category: "Portrait Bust", image: "/images/sculptures/Classic Sculptures.jpg" },
  { id: 3, name: "Elegant Marble", price: "$3,100", category: "Aesthetic Fragment", image: "/images/sculptures/Elegant Marble Sculpture Aesthetic.jpg" },
  { id: 4, name: "Greek Discus", price: "$4,200", category: "Athletic Figure", image: "/images/sculptures/Greek Discus.jpg" },
  { id: 5, name: "Medusa Gorgona", price: "$5,500", category: "Mythological", image: "/images/sculptures/medusa-gorgon.jpg" },
  { id: 6, name: "Goddess Fortuna", price: "$3,800", category: "Divine Figure", image: "/images/sculptures/Statue of Goddess Fortuna.jpg" },
  { id: 7, name: "Vaco Marble", price: "$1,200", category: "Decorative Piece", image: "/images/sculptures/vaco.jpg" },
  { id: 8, name: "Antiquity Fragment", price: "$950", category: "Architectural", image: "/images/sculptures/1829656093234277.jpg" },
];

export const Products: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Staggered reveal on scroll
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay: (i % 4) * 0.1,
        }
      );
    });
  }, []);

  return (
    <section id="collections" ref={sectionRef} className="bg-ink text-ivory py-[clamp(60px,10vw,140px)] px-[clamp(16px,4vw,48px)]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-[clamp(48px,6vw,100px)]">
          <p className="text-[0.7rem] tracking-[0.3em] uppercase text-gold mb-3.5">Curated Masterworks</p>
          <h2 className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-normal m-0 leading-tight">The Elysian Collection</h2>
          <div className="w-[50px] h-[1px] bg-gold mx-auto my-7" />
          <p className="max-w-[500px] mx-auto text-[clamp(0.85rem,1.2vw,1rem)] leading-relaxed text-ivory/50">
            Each piece is hand-carved from solid Carrara marble by our master artisans, 
            preserving techniques passed down through millennia.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-[clamp(24px,3vw,48px)] gap-x-[clamp(16px,2vw,32px)]">
          {sculptures.map((item, i) => (
            <div 
              key={item.id} 
              ref={el => { cardsRef.current[i] = el; }}
              className="opacity-0 cursor-pointer group"
            >
              {/* Image container */}
              <div className="aspect-[3/4] overflow-hidden bg-white/5 mb-4 relative rounded-sm">
                <img 
                  src={item.image} 
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] block group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#1A1613]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center pointer-events-none">
                  <span className="border border-ivory/50 px-7 py-2.5 text-[0.65rem] tracking-[0.2em] uppercase backdrop-blur-sm text-ivory">View Details</span>
                </div>
              </div>

              {/* Product info */}
              <div className="flex justify-between items-end gap-3">
                <div>
                  <h3 className="font-serif text-[clamp(1.1rem,1.5vw,1.4rem)] m-0 mb-1 font-normal leading-snug">{item.name}</h3>
                  <p className="text-[0.65rem] tracking-[0.12em] uppercase text-ivory/35 m-0">{item.category}</p>
                </div>
                <p className="text-gold text-[0.95rem] tracking-[0.05em] m-0 font-sans whitespace-nowrap">{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-20">
          <a href="#" className="inline-block px-12 py-3.5 border border-ivory/20 text-ivory no-underline text-[0.7rem] tracking-[0.2em] uppercase transition-all duration-400 hover:bg-ivory hover:text-ink">
            View Full Collection
          </a>
        </div>
      </div>
    </section>
  );
};
