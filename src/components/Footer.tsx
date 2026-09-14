import React from 'react';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-ivory/45 border-t border-white/5 px-[clamp(16px,4vw,48px)] pt-[clamp(48px,6vw,80px)] pb-[clamp(24px,3vw,40px)]">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-[clamp(24px,4vw,48px)] mb-[clamp(36px,4vw,60px)]">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-serif text-[1.6rem] tracking-[0.2em] text-ivory m-0 mb-3.5">
              AETHEON
            </h2>
            <p className="max-w-[300px] text-[0.82rem] leading-[1.7] m-0">
              Curators of monumental aesthetics. Bridging antiquity and the modern sanctuary through masterful marble craft.
            </p>
          </div>
          
          {/* Collections */}
          <div>
            <h3 className="text-ivory uppercase tracking-[0.15em] text-[0.65rem] font-semibold mb-4 font-sans">Collections</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {['Busts & Portraits', 'Monumental Figures', 'Architectural Fragments', 'Private Commissions'].map(t => (
                <li key={t}>
                  <a href="#" className="text-ivory/45 no-underline text-[0.82rem] transition-colors duration-300 hover:text-ivory">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-ivory uppercase tracking-[0.15em] text-[0.65rem] font-semibold mb-4 font-sans">Support</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {['Client Services', 'Shipping & Freight', 'Care Instructions', 'Contact Concierge'].map(t => (
                <li key={t}>
                  <a href="#" className="text-ivory/45 no-underline text-[0.82rem] transition-colors duration-300 hover:text-ivory">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-white/5 pt-5 flex justify-between items-center flex-wrap gap-3 text-[0.65rem] tracking-[0.08em]">
          <p className="m-0">&copy; {year} AETHEON Antiquities. All rights reserved.</p>
          <div className="flex gap-5">
            {['Terms', 'Privacy', 'Instagram'].map(t => (
              <a key={t} href="#" className="text-ivory/45 no-underline text-[0.82rem] transition-colors duration-300 hover:text-ivory">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
