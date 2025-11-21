import React from 'react';
import { InventoryItem, ItemType, Rarity } from '../types';
import { ITEM_CARD_BACKGROUNDS, ITEM_VISUALS, ITEM_ICONS, RARITY_COLORS, RARITY_BG, GENERIC_MYTHIC_BACKGROUND, GENERIC_LEGENDARY_BACKGROUND } from '../constants';
import { X, Sword, Coins, Tag, Fingerprint, Box } from 'lucide-react';
import { HoloCard } from './HoloCard';
import { FireShader } from './FireShader';

interface ItemDetailModalProps {
    item: InventoryItem | null;
    onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
    if (!item) return null;

    const fullArtUrl = ITEM_CARD_BACKGROUNDS[item.id];
    const visualClass = ITEM_VISUALS[item.id] || `${RARITY_COLORS[item.rarity].replace('text-', 'border-')} bg-slate-900`;
    const iconSource = ITEM_ICONS[item.id];
    const FallbackIcon = item.type === ItemType.WEAPON ? Sword : Box;
    
    const shouldBurn = item.id === 'headless_blade' && typeof iconSource === 'string';

    // --- STYLE 1: MYTHIC / FULL ART (TCG Style) ---
    if (item.rarity === Rarity.MYTHIC || item.rarity === Rarity.EXOTIC || item.rarity === Rarity.DIVINE || fullArtUrl) {
        const bgImage = fullArtUrl || GENERIC_MYTHIC_BACKGROUND;
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-fade-in" onClick={onClose}>
                <HoloCard 
                    className={`max-w-sm w-full aspect-[2/3]`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div 
                        className="w-full h-full rounded-xl border-[8px] shadow-[0_0_100px_rgba(220,38,38,0.5)] animate-slam ring-1 ring-white/10 overflow-hidden relative bg-black"
                        style={{ borderColor: '#1a0f0a' }} 
                    >
                        <div className="absolute inset-0 border-4 border-[#1a0f0a] pointer-events-none z-50 rounded-lg"></div>

                        <div 
                            className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-[20s] ease-linear group-hover:scale-105"
                            style={{ backgroundImage: `url(${bgImage})` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90"></div>
                        </div>

                        {shouldBurn && (
                            <div className="absolute inset-0 z-10 mix-blend-screen opacity-80 pointer-events-none">
                                <FireShader />
                            </div>
                        )}

                        <div className="absolute top-0 left-0 w-full h-[60%] flex items-center justify-center z-20 p-8 transform translate-z-10">
                            {typeof iconSource === 'string' ? (
                                <img 
                                    src={iconSource} 
                                    alt={item.name} 
                                    className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] filter brightness-110 hover:scale-105 transition-transform duration-1000" 
                                />
                            ) : (
                                (() => {
                                    const IconComp = iconSource || FallbackIcon;
                                    return <IconComp size={180} className={`drop-shadow-[0_0_20px_currentColor] ${RARITY_COLORS[item.rarity].split(' ')[0]}`} />;
                                })()
                            )}
                        </div>

                        <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white z-[70] bg-black/60 rounded-full p-2 border border-white/10 hover:bg-red-900/80 transition-colors">
                            <X size={20} />
                        </button>

                        <div className="absolute top-6 left-6 z-20 transform translate-z-20">
                            <div className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] border bg-black/90 shadow-lg ${RARITY_COLORS[item.rarity]}`}>
                                {item.rarity}
                            </div>
                        </div>

                        <div className="absolute bottom-0 w-full z-30 flex flex-col justify-end pb-4 transform translate-z-10">
                            <div className="text-center mb-5 px-4">
                                <h2 className="font-fantasy text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-100 via-red-500 to-red-900 drop-shadow-[0_4px_8px_rgba(0,0,0,1)] uppercase tracking-wide animate-cinematic-title">
                                    {item.name}
                                </h2>
                                {item.upgradeLevel > 0 && <div className="text-red-400 font-bold text-xs tracking-[0.2em] mt-1">ENHANCED +{item.upgradeLevel}</div>}
                            </div>

                            <div className="bg-black/90 border-t-2 border-red-900/40 mx-4 rounded shadow-2xl overflow-hidden ring-1 ring-white/5">
                                <div className="p-4 border-b border-white/5 text-center bg-gradient-to-r from-transparent via-red-900/10 to-transparent">
                                    <p className="text-stone-400 italic font-serif text-xs leading-relaxed tracking-wide">
                                        “{item.description || "A legendary artifact forged in the deepest void."}”
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 divide-x divide-white/10">
                                    <div className="p-3 flex flex-col items-center gap-1">
                                        <span className="text-[9px] text-stone-600 uppercase tracking-widest flex items-center gap-1"><Sword size={10}/> POWER</span>
                                        <span className="text-red-200 text-lg font-fantasy tracking-wider">{item.power}</span>
                                    </div>
                                    <div className="p-3 flex flex-col items-center gap-1">
                                        <span className="text-[9px] text-stone-600 uppercase tracking-widest flex items-center gap-1"><Coins size={10}/> VALUE</span>
                                        <span className="text-yellow-600 text-lg font-mono">{item.sellValue}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </HoloCard>
            </div>
        );
    }

    // --- STYLE 2: LEGENDARY ---
    if (item.rarity === Rarity.LEGENDARY) {
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in" onClick={onClose}>
                <div 
                    className="relative max-w-sm w-full rounded-2xl overflow-hidden border-4 border-yellow-600 shadow-[0_0_60px_rgba(234,179,8,0.4)] transform transition-all scale-100 animate-slam bg-stone-900" 
                    onClick={e => e.stopPropagation()}
                >
                    <div className="absolute inset-0 bg-cover opacity-20 mix-blend-overlay" style={{backgroundImage: `url(${GENERIC_LEGENDARY_BACKGROUND})`}}></div>
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-transparent rounded-full blur-xl animate-spin-slow"></div>

                    <div className="relative z-10 p-6 flex flex-col items-center">
                        <button onClick={onClose} className="absolute top-4 right-4 text-yellow-600 hover:text-yellow-300 bg-black/40 rounded-full p-1">
                            <X size={20} />
                        </button>

                        <div className="text-yellow-500 text-xs font-bold tracking-[0.4em] uppercase mb-6 border-b border-yellow-500/30 pb-2">
                            Legendary Artifact
                        </div>

                        <div className="relative mb-6">
                             <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 animate-pulse"></div>
                             {typeof iconSource === 'string' ? (
                                <img src={iconSource} alt={item.name} className="w-40 h-40 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative z-10" />
                            ) : (
                                (() => {
                                    const IconComp = iconSource || FallbackIcon;
                                    return <IconComp size={120} className="text-yellow-400 relative z-10 drop-shadow-lg" />;
                                })()
                            )}
                        </div>

                        <h2 className="text-3xl font-fantasy font-bold text-center text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 mb-2">
                            {item.name}
                        </h2>
                        
                        {item.upgradeLevel > 0 && <div className="text-yellow-400 font-bold text-sm mb-4">+ {item.upgradeLevel}</div>}

                        <div className="bg-black/40 p-4 rounded border border-yellow-500/20 text-center mb-6 w-full">
                            <p className="text-yellow-200/70 italic font-serif text-sm">
                                "{item.description}"
                            </p>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-3">
                             <div className="bg-yellow-950/30 border border-yellow-500/30 p-3 rounded text-center">
                                 <div className="text-xs text-yellow-600 uppercase tracking-widest mb-1">Power</div>
                                 <div className="text-xl font-bold text-yellow-100">{item.power}</div>
                             </div>
                             <div className="bg-yellow-950/30 border border-yellow-500/30 p-3 rounded text-center">
                                 <div className="text-xs text-yellow-600 uppercase tracking-widest mb-1">Value</div>
                                 <div className="text-xl font-bold text-yellow-100">{item.sellValue}</div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- STYLE 3: STANDARD ---
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
            <div 
                className={`relative max-w-sm w-full rounded-2xl overflow-hidden border-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] transform transition-all scale-100 animate-slam ${visualClass}`} 
                onClick={e => e.stopPropagation()}
            >
                <div className="bg-slate-950/90 p-6 flex flex-col items-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-20 bg-black/50 rounded-full p-1">
                        <X size={20} />
                    </button>

                    <div className={`px-4 py-1 mb-6 rounded-full text-xs font-bold uppercase tracking-[0.2em] border bg-black/50 ${RARITY_COLORS[item.rarity]}`}>
                        {item.rarity}
                    </div>

                    <div className="w-40 h-40 mb-6 flex items-center justify-center relative">
                        <div className={`absolute inset-0 ${RARITY_BG[item.rarity]} opacity-20 blur-xl rounded-full animate-pulse`}></div>
                        {typeof iconSource === 'string' ? (
                            <img src={iconSource} alt={item.name} className="w-32 h-32 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] relative z-10" />
                        ) : (
                            (() => {
                                const IconComp = iconSource || FallbackIcon;
                                return <IconComp size={100} className={`relative z-10 ${RARITY_COLORS[item.rarity].split(' ')[0]}`} />;
                            })()
                        )}
                    </div>

                    <h2 className={`text-3xl font-fantasy font-bold text-center mb-2 ${RARITY_COLORS[item.rarity].split(' ')[0]}`}>
                        {item.name}
                    </h2>
                    {item.upgradeLevel > 0 && (
                        <div className="text-yellow-400 font-bold text-sm mb-6">UPGRADE LEVEL +{item.upgradeLevel}</div>
                    )}

                    <div className="w-full bg-black/40 p-4 rounded-lg border border-white/5 mb-6 text-center">
                        <p className="text-slate-400 italic font-serif text-sm leading-relaxed">
                            "{item.description || "An artifact from the void, humming with unknown energy."}"
                        </p>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-3 text-xs font-mono">
                         <div className="bg-slate-900 p-2 rounded border border-slate-800 flex flex-col gap-1">
                             <span className="text-slate-500 flex items-center gap-1"><Sword size={12}/> POWER</span>
                             <span className="text-white text-lg">{item.power}</span>
                         </div>
                         <div className="bg-slate-900 p-2 rounded border border-slate-800 flex flex-col gap-1">
                             <span className="text-slate-500 flex items-center gap-1"><Tag size={12}/> TYPE</span>
                             <span className="text-white text-lg">{item.type}</span>
                         </div>
                         <div className="bg-slate-900 p-2 rounded border border-slate-800 flex flex-col gap-1">
                             <span className="text-slate-500 flex items-center gap-1"><Coins size={12}/> VALUE</span>
                             <span className="text-yellow-400 text-lg">{item.sellValue} G</span>
                         </div>
                         <div className="bg-slate-900 p-2 rounded border border-slate-800 flex flex-col gap-1 overflow-hidden">
                             <span className="text-slate-500 flex items-center gap-1"><Fingerprint size={12}/> ID</span>
                             <span className="text-slate-600 truncate" title={item.uuid}>#{item.uuid.substring(0,8)}</span>
                         </div>
                    </div>
                    
                    {item.specialEffect && (
                        <div className="w-full mt-4 text-center">
                            <span className="text-yellow-300 font-bold text-xs border border-yellow-500/30 bg-yellow-900/20 px-3 py-1 rounded-full animate-pulse">
                                ✨ {item.specialEffect}
                            </span>
                        </div>
                    )}

                    <div className="mt-6 text-[10px] text-slate-600">
                        DOUBLE CLICK CARD TO INSPECT
                    </div>
                </div>
            </div>
        </div>
    );
};