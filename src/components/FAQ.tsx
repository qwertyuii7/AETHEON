import React, { useState } from 'react';

const faqs = [
  { question: "Are these authentic antiquities or replicas?", answer: "AETHEON provides master-crafted replicas hewn from solid marble, using techniques passed down since antiquity. We occasionally offer authenticated ancient fragments in our private viewing rooms." },
  { question: "Do you ship internationally?", answer: "Yes. We arrange bespoke crating and white-glove international freight for all monumental pieces, ensuring they arrive in pristine condition anywhere in the world." },
  { question: "Can I commission a custom sculpture?", answer: "Our master artisans accept a limited number of private commissions per year. Please contact our concierge to discuss your vision and timeline." },
  { question: "How do I care for my marble sculpture?", answer: "Marble is porous. Dust regularly with a soft, dry cloth. Avoid acidic cleaners. For outdoor placement, we recommend a specialized sealant application every two years." },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-ink text-ivory py-[clamp(60px,8vw,120px)] px-[clamp(16px,4vw,48px)]">
      <div className="max-w-[700px] mx-auto">
        <div className="text-center mb-[clamp(40px,5vw,72px)]">
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-3">Support</p>
          <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-normal m-0">Client Services</h2>
        </div>

        <div>
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-white/5">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left py-[clamp(16px,2vw,24px)] flex justify-between items-center bg-transparent border-none text-ivory cursor-pointer font-serif text-[clamp(1rem,1.8vw,1.3rem)] gap-4"
              >
                <span>{faq.question}</span>
                <span className={`text-gold text-[1.3rem] font-light shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-45' : 'rotate-0'}`}>
                  +
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-400 ease-in-out ${openIndex === i ? 'max-h-[300px] opacity-100 pb-5' : 'max-h-0 opacity-0 pb-0'}`}
              >
                <p className="text-ivory/50 leading-[1.8] m-0 text-[clamp(0.8rem,1.1vw,0.95rem)] pr-8">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
