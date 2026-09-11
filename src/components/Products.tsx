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
    <section id="collections" ref={sectionRef} style={sectionStyle}>
      <div style={containerStyle}>
        
        {/* Header */}
        <div style={headerStyle}>
          <p style={labelStyle}>Curated Masterworks</p>
          <h2 style={titleStyle}>The Elysian Collection</h2>
          <div style={dividerStyle} />
          <p style={subtitleStyle}>
            Each piece is hand-carved from solid Carrara marble by our master artisans, 
            preserving techniques passed down through millennia.
          </p>
        </div>

        {/* Product grid */}
        <div style={gridStyle}>
          {sculptures.map((item, i) => (
            <div 
              key={item.id} 
              ref={el => { cardsRef.current[i] = el; }}
              style={{ opacity: 0, cursor: 'pointer' }}
            >
              {/* Image container */}
              <div style={imageContainerStyle}>
                <img 
                  src={item.image} 
                  alt={item.name}
                  loading="lazy"
                  style={imageStyle}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'scale(1.06)';
                    const overlay = e.currentTarget.nextElementSibling as HTMLElement;
                    if (overlay) overlay.style.opacity = '1';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    const overlay = e.currentTarget.nextElementSibling as HTMLElement;
                    if (overlay) overlay.style.opacity = '0';
                  }}
                />
                {/* Hover overlay */}
                <div style={overlayStyle}>
                  <span style={ctaStyle}>View Details</span>
                </div>
              </div>

              {/* Product info */}
              <div style={infoStyle}>
                <div>
                  <h3 style={nameStyle}>{item.name}</h3>
                  <p style={catStyle}>{item.category}</p>
                </div>
                <p style={priceStyle}>{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <a href="#" style={viewAllStyle}>
            View Full Collection
          </a>
        </div>
      </div>
    </section>
  );
};

// — Styles —
const sectionStyle: React.CSSProperties = {
  backgroundColor: '#1A1613',
  color: '#EDE6D6',
  padding: 'clamp(60px, 10vw, 140px) clamp(16px, 4vw, 48px)',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: 'clamp(48px, 6vw, 100px)',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: '#C9A227',
  marginBottom: '14px',
};

const titleStyle: React.CSSProperties = {
  fontFamily: "'Ethereal Nymeria', serif",
  fontSize: 'clamp(2.2rem, 5vw, 4rem)',
  fontWeight: 400,
  margin: 0,
  lineHeight: 1.1,
};

const dividerStyle: React.CSSProperties = {
  width: '50px',
  height: '1px',
  backgroundColor: '#C9A227',
  margin: '28px auto',
};

const subtitleStyle: React.CSSProperties = {
  maxWidth: '500px',
  margin: '0 auto',
  fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
  lineHeight: 1.7,
  color: 'rgba(237,230,214,0.5)',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
  gap: 'clamp(24px, 3vw, 48px) clamp(16px, 2vw, 32px)',
};

const imageContainerStyle: React.CSSProperties = {
  aspectRatio: '3/4',
  overflow: 'hidden',
  backgroundColor: 'rgba(255,255,255,0.03)',
  marginBottom: '18px',
  position: 'relative',
  borderRadius: '2px',
};

const imageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  display: 'block',
};

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(26,22,19,0.3)',
  opacity: 0,
  transition: 'opacity 0.4s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
};

const ctaStyle: React.CSSProperties = {
  border: '1px solid rgba(237,230,214,0.5)',
  padding: '10px 28px',
  fontSize: '0.65rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  backdropFilter: 'blur(4px)',
  color: '#EDE6D6',
};

const infoStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  gap: '12px',
};

const nameStyle: React.CSSProperties = {
  fontFamily: "'Ethereal Nymeria', serif",
  fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)',
  margin: '0 0 4px',
  fontWeight: 400,
  lineHeight: 1.2,
};

const catStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(237,230,214,0.35)',
  margin: 0,
};

const priceStyle: React.CSSProperties = {
  color: '#C9A227',
  fontSize: '0.95rem',
  letterSpacing: '0.05em',
  margin: 0,
  fontFamily: "'Inter', sans-serif",
  whiteSpace: 'nowrap',
};

const viewAllStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '14px 48px',
  border: '1px solid rgba(237,230,214,0.2)',
  color: '#EDE6D6',
  textDecoration: 'none',
  fontSize: '0.7rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  transition: 'all 0.4s ease',
};
