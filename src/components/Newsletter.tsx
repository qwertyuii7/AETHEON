import React from 'react';

export const Newsletter: React.FC = () => {
  return (
    <section id="newsletter" className="bg-ivory text-ink py-[clamp(60px,8vw,120px)] px-[clamp(16px,4vw,48px)]">
      <div className="max-w-[600px] mx-auto text-center">
        <p className="text-[0.65rem] tracking-[0.3em] uppercase text-terracotta mb-3">
          Private Access
        </p>
        <h2 className="font-serif text-[clamp(1.8rem,4vw,3rem)] font-normal m-0 mb-4 leading-tight">
          Join the Inner Sanctum
        </h2>
        <p className="text-[#1A1613]/55 text-[clamp(0.85rem,1.2vw,1rem)] leading-[1.8] mb-9">
          Receive exclusive access to new acquisitions, private viewings, and curatorial insights from our master artisans.
        </p>
        
        <form 
          onSubmit={e => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <input 
            type="email" 
            placeholder="Enter your email" 
            required
            className="flex-1 min-w-[240px] px-5 py-3.5 border-none border-b border-[#1A1613]/20 bg-transparent text-[0.9rem] outline-none text-ink rounded-none placeholder:text-ink/40 focus:border-terracotta transition-colors"
          />
          <button 
            type="submit" 
            className="px-8 py-3.5 bg-terracotta text-ivory border-none text-[0.65rem] tracking-[0.2em] uppercase cursor-pointer transition-colors duration-300 hover:bg-ink whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};
