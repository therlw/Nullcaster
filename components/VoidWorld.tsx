
import React from 'react';

interface VoidWorldProps {
    level: number; 
    isEventActive: boolean;
}

export const VoidWorld: React.FC<VoidWorldProps> = ({ isEventActive }) => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black select-none pointer-events-none">
      
      {/* 1. DEEP SPACE BASE */}
      <div className={`absolute inset-0 transition-colors duration-[3000ms] ease-in-out bg-gradient-to-b ${isEventActive ? 'from-[#1a0500] via-[#0f0505] to-black' : 'from-[#05001a] via-[#050210] to-black'}`}></div>

      {/* 2. DYNAMIC NEBULA LAYERS (CSS Keyframes) */}
      <div className="absolute inset-0 opacity-60 mix-blend-screen">
          {/* Primary Swirl */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vmax] h-[150vmax] animate-spin-slow opacity-40 blur-[100px] transition-all duration-[3000ms]
              ${isEventActive 
                  ? 'bg-[conic-gradient(from_0deg,transparent_0deg,#ea580c_90deg,transparent_180deg,#7f1d1d_270deg,transparent_360deg)]' 
                  : 'bg-[conic-gradient(from_0deg,transparent_0deg,#4f46e5_90deg,transparent_180deg,#2e1065_270deg,transparent_360deg)]'
              }
          `}></div>

          {/* Secondary Float Blobs */}
          <div className={`absolute top-1/4 left-1/4 w-[80vw] h-[80vw] rounded-full blur-[120px] animate-pulse-fast opacity-30 transition-colors duration-[3000ms]
              ${isEventActive ? 'bg-orange-600' : 'bg-cyan-700'}
          `}></div>
          
          <div className={`absolute bottom-1/4 right-1/4 w-[60vw] h-[60vw] rounded-full blur-[100px] animate-float-slow opacity-20 transition-colors duration-[3000ms]
              ${isEventActive ? 'bg-red-700' : 'bg-purple-700'}
          `}></div>
      </div>

      {/* 3. STARFIELD TEXTURE */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/twinkle-twinkle.png')] opacity-20 mix-blend-overlay"></div>

      {/* 4. ATMOSPHERIC OVERLAYS */}
      {/* Scanlines for retro feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 bg-[length:100%_4px,6px_100%] pointer-events-none"></div>

      {/* Heavy Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.95)_100%)] z-20"></div>
      
      {/* Dust Particles (Simulated via CSS) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-10 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute bg-white rounded-full opacity-0 animate-float-slow"
                style={{
                    width: Math.random() * 3 + 'px',
                    height: Math.random() * 3 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    animationDuration: 10 + Math.random() * 20 + 's',
                    animationDelay: Math.random() * 5 + 's'
                }}
              />
          ))}
      </div>
    </div>
  );
};
