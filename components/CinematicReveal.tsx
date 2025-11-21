
import React, { useEffect, useState, useRef } from 'react';
import { InventoryItem, Rarity, ItemType } from '../types';
import { RARITY_COLORS, ITEM_VISUALS, RARITY_BG, ITEM_ICONS } from '../constants';
import { Sparkles, Zap, Skull, Star, Sword, Shield, Ghost, Crown, Key, Box } from 'lucide-react';

interface CinematicRevealProps {
  item: InventoryItem | null;
  onComplete: () => void;
}

// Icons used for the Marvel-style flipping sequence
const FLIP_ICONS = [Sword, Shield, Zap, Skull, Star, Ghost, Crown, Key];

export const CinematicReveal: React.FC<CinematicRevealProps> = ({ item, onComplete }) => {
  const [phase, setPhase] = useState<'idle' | 'warp' | 'singularity' | 'explosion' | 'reveal'>('idle');
  const [flipIndex, setFlipIndex] = useState(0);
  const [flipSpeed, setFlipSpeed] = useState(100); // Starting speed (ms)

  useEffect(() => {
    if (item) {
      setPhase('warp');
      setFlipSpeed(100); // Reset speed
      
      // Phase 1: Warp / Rapid Icon Flipping (Marvel Style)
      // Lasts 2 seconds. Speed increases exponentially.
      const warpDuration = 2000; 
      
      // Transition to Singularity
      const t1 = setTimeout(() => {
          setPhase('singularity');
      }, warpDuration);

      // Transition to Explosion
      const t2 = setTimeout(() => {
          setPhase('explosion');
      }, warpDuration + 500); // 0.5s Singularity

      // Transition to Reveal
      const t3 = setTimeout(() => {
          setPhase('reveal');
      }, warpDuration + 500 + 300); // 0.3s Explosion

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setPhase('idle');
    }
  }, [item]);

  // Handle the rapid icon flipping logic
  useEffect(() => {
      if (phase === 'warp') {
          const interval = setInterval(() => {
              setFlipIndex(prev => (prev + 1) % FLIP_ICONS.length);
              // Speed up the flip to create tension
              setFlipSpeed(prev => Math.max(20, prev * 0.9));
          }, flipSpeed);
          return () => clearInterval(interval);
      }
  }, [phase, flipSpeed]);

  if (!item || phase === 'idle') return null;

  const isHighTier = [Rarity.LEGENDARY, Rarity.MYTHIC, Rarity.DIVINE, Rarity.EXOTIC, Rarity.IMPOSSIBLE].includes(item.rarity);
  const CurrentIcon = FLIP_ICONS[flipIndex];
  const rarityColorHex = getRarityHex(item.rarity);
  
  // Use specific visual theme if available
  const visualClass = ITEM_VISUALS[item.id] || `${RARITY_COLORS[item.rarity].replace('text-', 'border-')} bg-slate-900`;

  // Helper to render the specific icon
  const renderRevealIcon = () => {
      const iconSource = ITEM_ICONS[item.id];
      const FallbackIcon = item.type === ItemType.WEAPON ? Sword : item.type === ItemType.KEY ? Key : item.type === ItemType.AURA ? Zap : Box;

      if (typeof iconSource === 'string') {
          return <img src={iconSource} alt={item.name} className="w-32 h-32 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />;
      }
      
      const IconComp = iconSource || FallbackIcon;
      return <IconComp size={120} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />;
  };

  return (
    <div 
        className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={phase === 'reveal' ? onComplete : undefined}
    >
      {/* Background Overlay */}
      <div className={`absolute inset-0 bg-black transition-opacity duration-200 ${phase === 'reveal' ? 'opacity-95' : 'opacity-100'}`}></div>

      {/* PHASE 1: WARP / MARVEL FLIP */}
      {phase === 'warp' && (
          <div className="relative z-10 flex flex-col items-center justify-center">
              {/* Warp Tunnel Effect */}
              <div className="absolute inset-0 opacity-20 animate-pulse bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-black to-black"></div>
              
              {/* Rapidly Changing Icon */}
              <div className="text-9xl text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] animate-warp-speed transition-all">
                  <CurrentIcon size={180} strokeWidth={1} />
              </div>
              
              <div className="mt-12 font-mono text-xs tracking-[0.5em] text-slate-500 animate-pulse">
                  DECODING REALITY...
              </div>
          </div>
      )}

      {/* PHASE 2: SINGULARITY */}
      {phase === 'singularity' && (
          <div className="relative z-20 flex items-center justify-center animate-implode">
              <div className="text-9xl text-white animate-chromatic">
                  <CurrentIcon size={180} strokeWidth={1} />
              </div>
              {/* Implosion Ring */}
              <div className="absolute w-[500px] h-[500px] rounded-full border-4 border-white/50 animate-implode"></div>
          </div>
      )}

      {/* PHASE 3: EXPLOSION */}
      {phase === 'explosion' && (
          <div 
            className="absolute inset-0 z-30 animate-supernova mix-blend-screen pointer-events-none"
            style={{ backgroundColor: rarityColorHex }}
          ></div>
      )}

      {/* PHASE 4: REVEAL */}
      {phase === 'reveal' && (
        <>
          {/* God Rays Background */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
              <div 
                className="w-[150vw] h-[150vw] bg-gradient-to-r from-transparent via-white to-transparent animate-god-rays" 
                style={{ color: rarityColorHex, background: `conic-gradient(from 0deg, transparent 0deg, ${rarityColorHex} 20deg, transparent 40deg, ${rarityColorHex} 60deg, transparent 80deg, ${rarityColorHex} 100deg, transparent 120deg)` }}
              ></div>
          </div>
          
          <div className="relative z-20 flex flex-col items-center animate-slam">
             
             {/* The Item Card Container */}
             <div className={`
                relative border-4
                p-1 md:p-2 rounded-xl shadow-[0_0_100px_currentColor] 
                w-80 md:w-96 text-center transform transition-transform hover:scale-105
                ${visualClass}
             `}>
                {/* Inner Content */}
                <div className="bg-black/60 backdrop-blur-md p-6 rounded-lg flex flex-col items-center gap-4 border border-white/5 h-full">
                    
                    {/* Rarity Badge */}
                    <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${RARITY_COLORS[item.rarity]}`}>
                        {item.rarity}
                    </div>

                    {/* Icon / Visual */}
                    <div className="my-4 flex items-center justify-center animate-float-slow">
                         {renderRevealIcon()}
                    </div>

                    {/* Name */}
                    <h2 className={`text-3xl font-fantasy font-bold ${RARITY_COLORS[item.rarity].split(' ')[0]} drop-shadow-md`}>
                        {item.name}
                    </h2>

                    {/* Stats */}
                    <div className="w-full grid grid-cols-2 gap-2 text-sm font-mono text-slate-400 mt-2 border-t border-white/10 pt-4">
                        <div className="flex flex-col items-center bg-black/30 p-2 rounded">
                            <span className="text-[10px] uppercase">Power</span>
                            <span className="text-white text-lg font-bold">{item.power}</span>
                        </div>
                        <div className="flex flex-col items-center bg-black/30 p-2 rounded">
                             <span className="text-[10px] uppercase">Type</span>
                            <span className="text-white text-lg font-bold">{item.type}</span>
                        </div>
                    </div>

                    {item.specialEffect && (
                        <div className="w-full bg-yellow-900/20 border border-yellow-500/30 p-2 rounded text-yellow-200 text-xs mt-2 italic">
                            {item.specialEffect}
                        </div>
                    )}
                </div>
             </div>

             <div className="mt-12 text-white/50 text-sm font-mono animate-pulse">
                 [ TAP TO CLAIM ]
             </div>
          </div>
        </>
      )}
    </div>
  );
};

function getRarityHex(rarity: Rarity): string {
    if (rarity === Rarity.LEGENDARY) return '#eab308';
    if (rarity === Rarity.MYTHIC) return '#dc2626';
    if (rarity === Rarity.DIVINE) return '#06b6d4';
    if (rarity === Rarity.EXOTIC) return '#ec4899';
    if (rarity === Rarity.IMPOSSIBLE) return '#ffffff';
    if (rarity === Rarity.EPIC) return '#a855f7';
    if (rarity === Rarity.RARE) return '#3b82f6';
    return '#ffffff';
}
