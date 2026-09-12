import React, { useEffect, useState } from 'react';

export const Navbar: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
      transition: 'background-color 0.5s, backdrop-filter 0.5s',
      backgroundColor: 'transparent',
      backdropFilter: 'none',
      borderBottom: '1px solid transparent',
    }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto',
        padding: isMobile ? '0 16px' : '0 32px',
        height: isMobile ? '60px' : '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Left nav — hidden on mobile */}
        {!isMobile && (
          <nav style={{ display: 'flex', gap: '28px' }}>
            <a href="#collections" style={navLinkStyle}>Collections</a>
            <a href="#story" style={navLinkStyle}>Our Story</a>
          </nav>
        )}

        {/* Brand */}
        <a href="#" style={{
          fontFamily: "'Ethereal Nymeria', serif",
          fontSize: isMobile ? '1.5rem' : '2.0rem',
          letterSpacing: '0.15em', color: '#EDE6D6', textDecoration: 'none',
          fontWeight: 900, 
          textShadow: '0 2px 20px rgba(0,0,0,1)', // Ensuring clarity over scenes
          position: isMobile ? 'static' : 'absolute',
          left: isMobile ? undefined : '50%',
          transform: isMobile ? undefined : 'translateX(-50%)',
        }}>AETHEON</a>

        {/* Right nav */}
        {!isMobile ? (
          <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
            <a href="#faq" style={navLinkStyle}>Services</a>
            <a href="#newsletter" style={navLinkStyle}>Contact</a>
          </nav>
        ) : (
          /* Mobile menu button */
          <button style={{
            background: 'none', border: 'none', color: '#EDE6D6', cursor: 'pointer',
            padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px',
          }}>
            <span style={{ display: 'block', width: '20px', height: '1px', backgroundColor: '#EDE6D6' }} />
            <span style={{ display: 'block', width: '20px', height: '1px', backgroundColor: '#EDE6D6' }} />
          </button>
        )}
      </div>
    </header>
  );
};

const navLinkStyle: React.CSSProperties = {
  color: 'rgba(237,230,214,0.65)', textDecoration: 'none',
  fontSize: '0.7rem', textTransform: 'uppercase',
  letterSpacing: '0.15em', transition: 'color 0.3s',
};
