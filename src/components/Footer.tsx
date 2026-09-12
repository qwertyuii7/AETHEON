import React from 'react';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{ 
      backgroundColor: '#000000', color: 'rgba(237,230,214,0.45)', 
      padding: 'clamp(48px, 6vw, 80px) clamp(16px, 4vw, 48px) clamp(24px, 3vw, 40px)', 
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 'clamp(24px, 4vw, 48px)',
          marginBottom: 'clamp(36px, 4vw, 60px)',
        }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <h2 style={{
              fontFamily: "'Ethereal Nymeria', serif", fontSize: '1.6rem',
              letterSpacing: '0.2em', color: '#EDE6D6', margin: '0 0 14px',
            }}>AETHEON</h2>
            <p style={{ maxWidth: '300px', fontSize: '0.82rem', lineHeight: 1.7, margin: 0 }}>
              Curators of monumental aesthetics. Bridging antiquity and the modern sanctuary through masterful marble craft.
            </p>
          </div>
          
          {/* Collections */}
          <div>
            <h3 style={headingStyle}>Collections</h3>
            <ul style={listStyle}>
              {['Busts & Portraits', 'Monumental Figures', 'Architectural Fragments', 'Private Commissions'].map(t => (
                <li key={t}><a href="#" style={linkStyle}>{t}</a></li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 style={headingStyle}>Support</h3>
            <ul style={listStyle}>
              {['Client Services', 'Shipping & Freight', 'Care Instructions', 'Contact Concierge'].map(t => (
                <li key={t}><a href="#" style={linkStyle}>{t}</a></li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px', fontSize: '0.65rem', letterSpacing: '0.08em',
        }}>
          <p style={{ margin: 0 }}>&copy; {year} AETHEON Antiquities. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Terms', 'Privacy', 'Instagram'].map(t => (
              <a key={t} href="#" style={linkStyle}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const headingStyle: React.CSSProperties = {
  color: '#EDE6D6', textTransform: 'uppercase', letterSpacing: '0.15em',
  fontSize: '0.65rem', fontWeight: 600, marginBottom: '16px',
  fontFamily: "'Inter', sans-serif",
};
const listStyle: React.CSSProperties = { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' };
const linkStyle: React.CSSProperties = { color: 'rgba(237,230,214,0.45)', textDecoration: 'none', fontSize: '0.82rem', transition: 'color 0.3s' };
