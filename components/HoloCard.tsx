import React, { useRef, useState, MouseEvent } from 'react';

interface HoloCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const HoloCard: React.FC<HoloCardProps> = ({ children, className = '', onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (Limits to +/- 12 degrees)
    const rotateX = ((y - centerY) / centerY) * -12; 
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({ 
        x: (x / rect.width) * 100, 
        y: (y / rect.height) * 100, 
        opacity: 1 
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div 
        className={`${className}`}
        style={{ perspective: '1000px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
    >
        <div 
            ref={cardRef}
            className="w-full h-full transition-transform duration-100 ease-out will-change-transform relative overflow-hidden rounded-xl bg-black"
            style={{
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
                transformStyle: 'preserve-3d',
            }}
        >
            {children}
            
            {/* 1. METALLIC SHEEN (Ghostly Silver) */}
            {/* Clean, premium metallic sweep reacting to movement */}
            <div 
                className="absolute inset-0 pointer-events-none mix-blend-overlay z-[55]"
                style={{
                    background: `
                        linear-gradient(
                            ${115 + rotate.y * 2}deg, 
                            transparent 20%, 
                            rgba(220, 230, 255, 0.1) 40%, 
                            rgba(255, 255, 255, 0.5) 50%, 
                            rgba(220, 230, 255, 0.1) 60%, 
                            transparent 80%
                        )
                    `,
                    opacity: glare.opacity,
                    transition: 'opacity 0.2s ease'
                }}
            />

            {/* 2. DYNAMIC LIGHT SOURCE (The Glare Spot) */}
            <div 
                className="absolute inset-0 pointer-events-none mix-blend-soft-light z-[60]"
                style={{
                    background: `
                        radial-gradient(
                            circle at ${glare.x}% ${glare.y}%, 
                            rgba(255,255,255,0.9) 0%, 
                            rgba(255,255,255,0.1) 40%, 
                            rgba(255,255,255,0) 70%
                        )
                    `,
                    opacity: glare.opacity,
                    transition: 'opacity 0.2s ease'
                }}
            />
            
            {/* 3. EDGE HIGHLIGHT (Rim Light) */}
            <div 
                className="absolute inset-0 rounded-xl pointer-events-none z-[65]"
                style={{
                    boxShadow: `inset 0 0 0 1px rgba(255,255,255,${glare.opacity * 0.4})`
                }}
            />
        </div>
    </div>
  );
};