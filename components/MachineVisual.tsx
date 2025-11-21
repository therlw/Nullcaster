import React from 'react';
import { InventoryItem, ItemType } from '../types';
import { RARITY_BG, RARITY_COLORS, ITEM_ICONS } from '../constants';
import { Sword, Zap, Box } from 'lucide-react';

interface MachineVisualProps {
    isRolling: boolean;
    lastItem: InventoryItem | null;
}

export const MachineVisual: React.FC<MachineVisualProps> = ({ isRolling, lastItem }) => {
    const renderIcon = () => {
        if (!lastItem) return null;
        const iconSource = ITEM_ICONS[lastItem.id];
        const FallbackIcon = lastItem.type === ItemType.WEAPON ? Sword : lastItem.type === ItemType.AURA ? Zap : Box;

        if (typeof iconSource === 'string') {
            return <img src={iconSource} alt={lastItem.name} className="w-32 h-32 object-contain drop-shadow-lg mb-2" />;
        }
        const IconComp = iconSource || FallbackIcon;
        return <div className="text-6xl mb-2 filter drop-shadow-lg"><IconComp size={80} /></div>;
    };

    return (
        <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center bg-slate-950/80 rounded-full border-4 border-slate-700 shadow-2xl overflow-hidden z-0">
            <div className={`absolute inset-0 opacity-20 transition-colors duration-500 ${lastItem ? RARITY_BG[lastItem.rarity].replace('bg-', 'bg-') : 'bg-blue-900'}`}></div>
            
            {isRolling ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
                    <div className="w-32 h-32 border-l-4 border-r-4 border-blue-500 rounded-full animate-spin-slow absolute"></div>
                </div>
            ) : lastItem ? (
                <div className={`text-center animate-pulse-fast z-10 p-4 ${RARITY_COLORS[lastItem.rarity]} flex flex-col items-center`}>
                    {renderIcon()}
                    <div className="font-fantasy text-xl font-bold tracking-widest drop-shadow-md leading-none">{lastItem.name}</div>
                    <div className="text-xs uppercase mt-1 tracking-[0.2em] opacity-80">{lastItem.rarity}</div>
                </div>
            ) : (
                <div className="text-slate-600 text-xs font-mono tracking-widest animate-pulse">AWAITING INPUT</div>
            )}
            
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none"></div>
        </div>
    );
};