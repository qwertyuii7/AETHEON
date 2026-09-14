import React, { useEffect, useState } from 'react';
import { X, Menu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMenuOpen(false); // Close menu if resized to desktop
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  const navLinks = [
    { name: 'Collections', href: '#collections' },
    { name: 'Our Story', href: '#story' },
    { name: 'Services', href: '#faq' },
    { name: 'Contact', href: '#newsletter' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[100] transition-colors duration-500 bg-transparent border-b border-transparent">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-[60px] md:h-[72px] flex items-center justify-between">
          
          {/* Left nav — hidden on mobile */}
          {!isMobile && (
            <nav className="flex gap-7">
              {navLinks.slice(0, 2).map((link) => (
                <a key={link.name} href={link.href} className="text-ivory/65 no-underline text-[0.7rem] uppercase tracking-[0.15em] transition-colors duration-300 hover:text-ivory">
                  {link.name}
                </a>
              ))}
            </nav>
          )}

          {/* Brand */}
          <a href="#" className="font-serif text-2xl md:text-[2.0rem] tracking-[0.15em] text-ivory no-underline font-black drop-shadow-[0_2px_20px_rgba(0,0,0,1)] static md:absolute md:left-1/2 md:-translate-x-1/2 z-[101]">
            AETHEON
          </a>

          {/* Right nav */}
          {!isMobile ? (
            <nav className="flex gap-7 items-center">
              {navLinks.slice(2, 4).map((link) => (
                <a key={link.name} href={link.href} className="text-ivory/65 no-underline text-[0.7rem] uppercase tracking-[0.15em] transition-colors duration-300 hover:text-ivory">
                  {link.name}
                </a>
              ))}
            </nav>
          ) : (
            /* Mobile menu button */
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-transparent border-none text-ivory cursor-pointer p-2 flex flex-col gap-[5px] z-[101] relative"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-ink z-[90] flex flex-col justify-center items-center transition-all duration-500 ease-in-out ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <nav className="flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={() => setMenuOpen(false)}
              className="text-ivory text-2xl font-serif tracking-widest no-underline opacity-80 hover:opacity-100 hover:text-gold transition-colors duration-300 transform transition-transform"
              style={{
                transitionDelay: menuOpen ? `${i * 100}ms` : '0ms',
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: menuOpen ? 1 : 0,
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};
