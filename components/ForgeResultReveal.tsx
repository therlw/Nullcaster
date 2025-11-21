
import React from 'react';
import { InventoryItem, ItemType } from '../types';
import { RARITY_COLORS, ITEM_VISUALS } from '../constants';
import { Hammer, ArrowUpCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ForgeResultRevealProps {
  item: { item: InventoryItem, status: 'success' | 'broken' } | null;
  onComplete: () => void;
}

export const ForgeResultReveal: React.FC<ForgeResultRevealProps> = ({ item: result, onComplete }) => {
  
  if (!result) return null;
  
  const { item, status } = result;
  const isBroken = status === 'broken';

  // Use specific visual theme if available
  const visualClass = ITEM_VISUALS[item.id] || `bg-slate-900/80 border-orange-800 border-4`;

  return (
    <div 
        className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer bg-black/80 backdrop-blur-sm"
        onClick={onComplete}
    >
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-[length:200%_200%] opacity-95 ${isBroken ? 'bg-red-950' : 'bg-gradient-to-br from-red-950 via-orange-950 to-black animate-magma-flow'}`}></div>
      
      {!isBroken && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute bg-white/10 rounded-full blur-xl animate-steam-rise"
                    style={{
                        left: `${Math.random() * 100}%`,
                        bottom: '-10%',
                        width: `${50 + Math.random() * 100}px`,
                        height: `${50 + Math.random() * 100}px`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  ></div>
              ))}
          </div>
      )}

      <div className="relative z-20 flex flex-col items-center animate-slam">
         
         <div className={`text-5xl font-fantasy font-bold text-transparent bg-clip-text tracking-[0.2em] drop-shadow-[0_2px_10px_rgba(234,88,12,0.5)] mb-8 animate-pulse ${isBroken ? 'bg-red-600' : 'bg-gradient-to-b from-yellow-300 to-orange-600'}`}>
             {isBroken ? 'SHATTERED' : 'REFORGED'}
         </div>

         {/* The Item Card */}
         <div className={`
            relative
            p-8 rounded-2xl shadow-[0_0_100px_rgba(249,115,22,0.5)] 
            w-96 text-center transform overflow-hidden
            ${visualClass}
            ${isBroken ? 'grayscale brightness-50 rotate-12 border-red-900' : ''}
         `}>
            {isBroken && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                    <XCircle size={150} className="text-red-600 opacity-80" />
                </div>
            )}

            {/* Cooling Animation Wrapper */}
            <div className={!isBroken ? "animate-cooling" : ""}>
                <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border mb-4 ${RARITY_COLORS[item.rarity]}`}>
                    {item.rarity}
                </div>

                <div className="my-6 text-8xl filter drop-shadow-lg relative">
                     {item.type === ItemType.WEAPON ? '⚔️' : '📦'}
                     {isBroken && <div className="absolute inset-0 text-red-600 animate-ping opacity-50">💥</div>}
                </div>

                <h2 className={`text-3xl font-fantasy font-bold text-white drop-shadow-md mb-2 ${isBroken ? 'line-through decoration-red-600' : ''}`}>
                    {item.name} {(!isBroken && item.upgradeLevel > 0) ? `+${item.upgradeLevel}` : ''}
                </h2>
            </div>

            {/* Stats (Static) */}
            <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-white/10 bg-black/20 rounded p-2">
                 <div className="bg-black/40 p-2 rounded flex flex-col">
                     <span className="text-[10px] text-orange-300 uppercase">{isBroken ? 'Lost Power' : 'New Power'}</span>
                     <span className={`text-xl font-bold flex items-center justify-center gap-1 ${isBroken ? 'text-gray-500' : 'text-white'}`}>
                        {item.power}
                     </span>
                 </div>
                 <div className="bg-black/40 p-2 rounded flex flex-col">
                     <span className="text-[10px] text-orange-300 uppercase">Status</span>
                     <span className={`text-xl font-bold ${isBroken ? 'text-red-500' : 'text-green-400'}`}>
                         {isBroken ? 'DESTROYED' : 'SUCCESS'}
                     </span>
                 </div>
            </div>
            
            {!isBroken && <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/5 to-transparent opacity-50"></div>}
         </div>

         <div className="mt-12 text-orange-300/50 text-sm font-mono animate-pulse flex items-center gap-2">
             {isBroken ? <AlertTriangle size={14} /> : <Hammer size={14} />} 
             {isBroken ? '[ ITEM LOST ]' : '[ TAP TO COOL ]'}
         </div>
      </div>
    </div>
  );
};
