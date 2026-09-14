import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X, CheckCircle, Package, Truck, Home } from 'lucide-react';

export interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const RazorpayButton: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formRef.current) return;
    
    // Clear any existing children to prevent duplicates if re-mounted
    formRef.current.innerHTML = '';
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', 'pl_TbuLksqraY4qJd');
    script.async = true;
    
    formRef.current.appendChild(script);
  }, []);

  return <form ref={formRef} className="min-h-[50px] flex items-center justify-center"></form>;
};

const simulationSteps = [
  { text: "Processing Payment...", icon: null },
  { text: "Payment Successful", icon: <CheckCircle className="w-8 h-8 text-gold mb-4" /> },
  { text: "Master Artisans are preparing your piece...", icon: <Package className="w-8 h-8 text-gold mb-4" /> },
  { text: "Handed over to White-Glove Freight...", icon: <Truck className="w-8 h-8 text-gold mb-4" /> },
  { text: "Delivered. Welcome to the Inner Sanctum.", icon: <Home className="w-8 h-8 text-gold mb-4" /> }
];

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<HTMLDivElement>(null);
  const stepTextRef = useRef<HTMLDivElement>(null);
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Initial mount animation
  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    
    gsap.fromTo(overlayRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.4, ease: 'power2.out' }
    );
    
    gsap.fromTo(modalRef.current, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.1 }
    );

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: onClose
    });
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setCurrentStep(0);
    
    // Fade in simulation overlay
    setTimeout(() => {
      gsap.fromTo(simulationRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.5 }
      );

      const tl = gsap.timeline();
      
      simulationSteps.forEach((step, index) => {
        tl.call(() => setCurrentStep(index))
          .fromTo(stepTextRef.current, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.5 }
          )
          .to(stepTextRef.current, {
            opacity: 0, y: -20, duration: 0.5, delay: index === simulationSteps.length - 1 ? 3 : 1.5
          });
      });

      tl.call(() => {
        // Fade out simulation overlay and close modal
        gsap.to(simulationRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            setIsSimulating(false);
            handleClose();
          }
        });
      });
    }, 100);
  };

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 backdrop-blur-sm p-4 md:p-8"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#1A1613] rounded-sm overflow-y-auto overflow-x-hidden flex flex-col md:flex-row shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/5 custom-scrollbar"
      >
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-[60] p-2 bg-ink/50 backdrop-blur-md rounded-full text-ivory/70 hover:text-ivory transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[600px] shrink-0">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details & Actions */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          <p className="text-[0.65rem] tracking-[0.2em] uppercase text-gold mb-3">{product.category}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ivory mb-4 leading-tight">{product.name}</h2>
          <p className="font-sans text-xl text-ivory/80 mb-8">{product.price}</p>
          
          <div className="w-12 h-[1px] bg-white/10 mb-8" />
          
          <p className="text-ivory/60 text-sm leading-relaxed mb-10">
            A testament to antiquity, captured in pristine Carrara marble. This piece requires specialized white-glove delivery, included in the final acquisition.
          </p>

          <div className="flex flex-col gap-6">
            {/* Razorpay Native Button */}
            <div className="w-full border border-white/10 p-6 rounded-sm bg-white/5 flex flex-col items-center justify-center">
              <p className="text-[0.65rem] tracking-[0.1em] text-ivory/50 uppercase mb-4">Official Payment Gateway</p>
              <RazorpayButton />
            </div>

            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-white/5" />
              <span className="text-[0.65rem] tracking-[0.2em] text-ivory/30 uppercase">OR</span>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>

            {/* Simulation Trigger */}
            <button 
              onClick={runSimulation}
              className="w-full py-4 border border-gold/50 text-gold text-[0.7rem] tracking-[0.2em] uppercase hover:bg-gold hover:text-ink transition-colors duration-300"
            >
              Simulate Purchase & Delivery Flow
            </button>
          </div>
        </div>

        {/* Simulation Overlay */}
        {isSimulating && (
          <div 
            ref={simulationRef}
            className="absolute inset-0 z-50 bg-[#1A1613] flex items-center justify-center p-8 opacity-0"
          >
            <div ref={stepTextRef} className="flex flex-col items-center text-center">
              {simulationSteps[currentStep].icon}
              <p className="font-serif text-2xl md:text-3xl text-ivory">
                {simulationSteps[currentStep].text}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
