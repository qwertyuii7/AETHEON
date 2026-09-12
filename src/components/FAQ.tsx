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
    <section id="faq" style={{ 
      backgroundColor: '#000000', color: '#EDE6D6', 
      padding: 'clamp(60px, 8vw, 120px) clamp(16px, 4vw, 48px)' 
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 5vw, 72px)' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A227', marginBottom: '12px' }}>Support</p>
          <h2 style={{ fontFamily: "'Ethereal Nymeria', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 400, margin: 0 }}>Client Services</h2>
        </div>

        <div>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left', padding: 'clamp(16px, 2vw, 24px) 0',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'none', border: 'none', color: '#EDE6D6', cursor: 'pointer',
                  fontFamily: "'Ethereal Nymeria', serif", fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
                  gap: '16px',
                }}
              >
                <span>{faq.question}</span>
                <span style={{ 
                  color: '#C9A227', fontSize: '1.3rem', fontWeight: 300,
                  transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0)',
                  transition: 'transform 0.3s', flexShrink: 0,
                }}>+</span>
              </button>
              <div style={{
                maxHeight: openIndex === i ? '300px' : '0',
                opacity: openIndex === i ? 1 : 0,
                overflow: 'hidden', transition: 'all 0.4s ease-in-out',
                paddingBottom: openIndex === i ? '20px' : '0',
              }}>
                <p style={{ 
                  color: 'rgba(237,230,214,0.5)', lineHeight: 1.8, margin: 0,
                  fontSize: 'clamp(0.8rem, 1.1vw, 0.95rem)', paddingRight: '32px',
                }}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
