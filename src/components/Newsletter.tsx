import React from 'react';

export const Newsletter: React.FC = () => {
  return (
    <section id="newsletter" style={{ 
      backgroundColor: '#EDE6D6', color: '#000000', 
      padding: 'clamp(60px, 8vw, 120px) clamp(16px, 4vw, 48px)',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ 
          fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: '#B5652D', marginBottom: '12px',
        }}>Private Access</p>
        <h2 style={{ 
          fontFamily: "'Ethereal Nymeria', serif", 
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          fontWeight: 400, margin: '0 0 16px', lineHeight: 1.2,
        }}>Join the Inner Sanctum</h2>
        <p style={{ 
          color: 'rgba(26,22,19,0.55)', 
          fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', 
          lineHeight: 1.8,
          marginBottom: '36px',
        }}>
          Receive exclusive access to new acquisitions, private viewings, and curatorial insights from our master artisans.
        </p>
        
        <form 
          onSubmit={e => e.preventDefault()}
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <input 
            type="email" placeholder="Enter your email" required
            style={{
              flex: '1 1 240px', padding: '14px 20px',
              border: 'none', borderBottom: '1px solid rgba(26,22,19,0.2)',
              backgroundColor: 'transparent', fontSize: '0.9rem',
              outline: 'none', color: '#000000',
              borderRadius: 0, // iOS fix
            }}
          />
          <button type="submit" style={{
            padding: '14px 32px', backgroundColor: '#B5652D', color: '#EDE6D6',
            border: 'none', fontSize: '0.65rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', cursor: 'pointer', transition: 'background-color 0.3s',
            whiteSpace: 'nowrap',
          }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#000000')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#B5652D')}
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};
