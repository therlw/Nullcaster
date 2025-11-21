import React from 'react';
import { InventoryItem, ItemType } from '../types';
import { ITEM_VISUALS, RARITY_COLORS, RARITY_BG, ITEM_ICONS } from '../constants';
import { Sword, CheckCircle, Trash2, Zap, Gift, Box } from 'lucide-react';

interface ItemCardProps {
  item: InventoryItem;
  isEquipped: boolean;
  onSell: (id: string) => void;
  onEquip: (id: string) => void;
  onSelect?: (id: string) => void;
  onInspect?: (item: InventoryItem) => void;
  isSelected?: boolean;
  showActions?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, isEquipped, onSell, onEquip, onSelect, onInspect, isSelected, showActions = true }) => {
  const visualClass = ITEM_VISUALS[item.id] || `${RARITY_COLORS[item.rarity]} ${RARITY_BG[item.rarity]}`;
  const containerClass = ITEM_VISUALS[item.id] ? `border text-slate-200 ${visualClass}` : visualClass;

  const iconSource = ITEM_ICONS[item.id];
  const FallbackIcon = item.type === ItemType.WEAPON ? Sword : item.type === ItemType.AURA ? Zap : item.type === ItemType.KEY ? Gift : Box;

  return (
    <div 
        onClick={() => onSelect && onSelect(item.uuid)}
        onDoubleClick={() => onInspect && onInspect(item)}
        className={`relative group p-3 rounded-lg border flex flex-col gap-2 transition-all hover:scale-[1.02] hover:shadow-xl hover:border-slate-400 overflow-hidden cursor-pointer ${containerClass} ${isEquipped ? 'ring-2 ring-yellow-400' : ''} ${isSelected ? 'ring-2 ring-red-500 scale-105 z-10' : ''}`}
    >
        {/* STACK BADGE */}
        {item.count > 1 && (
            <div className="absolute top-2 right-2 z-20 bg-slate-950 border border-slate-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                x{item.count}
            </div>
        )}

        <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center border border-white/10 shadow-inner overflow-hidden`}>
                     {typeof iconSource === 'string' ? (
                        <img src={iconSource} alt={item.name} className="w-6 h-6 object-contain drop-shadow-sm" />
                     ) : (
                        (() => {
                            const IconComp = iconSource || FallbackIcon;
                            return <IconComp size={18} className={RARITY_COLORS[item.rarity].split(' ')[0]} />;
                        })()
                     )}
                </div>
                <h4 className="font-bold text-sm truncate w-24 drop-shadow-md leading-tight">
                    {item.name} 
                    {item.upgradeLevel > 0 && <div className="text-yellow-300 text-[10px]">+{item.upgradeLevel}</div>}
                </h4>
            </div>
            <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${RARITY_BG[item.rarity] ? RARITY_BG[item.rarity].split(' ')[0].replace('/30','') : 'bg-white'}`}></div>
        </div>
        <div className="relative z-10 text-xs text-gray-300/90 flex flex-col gap-0.5 mt-1 font-mono">
        <span className="flex justify-between"><span>PWR:</span> <span className="text-white font-bold">{item.power}</span></span>
        <span className="flex justify-between"><span>Type:</span> <span className="opacity-80">{item.type}</span></span>
        {item.specialEffect && <span className="text-yellow-200 text-[10px] mt-1 italic">{item.specialEffect}</span>}
        </div>
        
        {showActions && (
            <div className="relative z-10 mt-auto flex gap-1" onClick={e => e.stopPropagation()}>
                {item.type === ItemType.WEAPON && (
                    <button 
                        onClick={() => onEquip(item.uuid)}
                        disabled={isEquipped}
                        className={`flex-1 py-1.5 text-xs rounded flex items-center justify-center gap-1 transition-colors ${isEquipped ? 'bg-yellow-600/80 text-yellow-100 cursor-default' : 'bg-blue-950 hover:bg-blue-900 text-blue-200 border border-blue-500/30'}`}
                    >
                    {isEquipped ? <CheckCircle size={12} /> : <Sword size={12} />} 
                    {isEquipped ? 'EQP' : 'USE'}
                    </button>
                )}
                <button 
                    onClick={() => onSell(item.uuid)}
                    disabled={isEquipped && item.count <= 1}
                    className={`flex-1 py-1.5 text-xs rounded flex items-center justify-center gap-1 transition-colors ${isEquipped && item.count <= 1 ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-red-950 hover:bg-red-900 text-red-200 border border-red-500/30'}`}
                >
                    <Trash2 size={12} /> {item.sellValue}
                </button>
            </div>
        )}
    </div>
  );
};