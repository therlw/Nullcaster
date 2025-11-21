
import React from 'react';

interface VoidWorldProps {
    level: number; 
    isEventActive: boolean;
}

export const VoidWorld: React.FC<VoidWorldProps> = ({ isEventActive }) => {
  // User provided video: https://streamable.com/x4uz6b
  // Forced high quality and minimal UI
  const videoSrc = "https://streamable.com/e/x4uz6b?autoplay=1&muted=1&loop=1&controls=0&showinfo=0&modestbranding=1&quality=highest";

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black select-none pointer-events-none">
      {/* 
         ASPECT RATIO LOCK (16:9) & COVER STRATEGY
         Changed to absolute to fill the parent container (Gacha Tab) only.
      */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-[177.78vh] h-[56.25vw]">
        <iframe
          src={videoSrc}
          className="w-full h-full object-cover"
          frameBorder="0"
          allow="autoplay; encrypted-media; loop"
          style={{ pointerEvents: 'none' }} 
        />
      </div>

      {/* REMOVED NOISE TEXTURE FOR CLARITY */}

      {/* Atmosferik Overlay (Normal) - Reduced opacity for better visibility */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Event Overlay (Halloween vb.) */}
      <div className={`absolute inset-0 transition-colors duration-1000 mix-blend-overlay ${
        isEventActive
          ? 'bg-orange-900/30' 
          : 'bg-transparent'
      }`}></div>

      {/* Vignette - Sharper gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.9)_100%)]"></div>
    </div>
  );
};
