
import React, { useState, useMemo } from 'react';
import { ITEMS_DB } from '../data/gameData';
import { Rarity, Item } from '../types';
import { RARITY_COLORS, RARITY_BG, ITEM_ICONS, RARITY_ORDER } from '../constants';
import { Sword, Box, Zap, Search, Book, Lock } from 'lucide-react';

interface CodexViewProps {
    discoveredItems: string[];
    onInspect: (item: Item) => void;
}

export const CodexView: React.FC<CodexViewProps> = ({ discoveredItems, onInspect }) => {
    const [filterRarity, setFilterRarity] = useState<Rarity | 'ALL'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    // Stats
    const totalItems = ITEMS_DB.length;
    const unlockedItems = discoveredItems.length;
    const progress = Math.floor((unlockedItems / totalItems) * 100);

    const filteredItems = useMemo(() => {
        let items = [...ITEMS_DB];
        
        if (filterRarity !== 'ALL') {
            items = items.filter(i => i.rarity === filterRarity);
        }

        if (searchTerm) {
            items = items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Sort by rarity then name
        return items.sort((a, b) => {
            const rA = RARITY_ORDER.indexOf(a.rarity);
            const rB = RARITY_ORDER.indexOf(b.rarity);
            if (rA !== rB) return rA - rB;
            return a.name.localeCompare(b.name);
        });
    }, [filterRarity, searchTerm]);

    return (
        <div className="h-full flex flex-col bg-slate-950">
            {/* Header & Progress */}
            <div className="p-6 border-b border-slate-800 bg-slate-950 sticky top-0 z-10 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-fantasy text-amber-500 flex items-center gap-3">
                            <Book size={32} /> The Codex
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Collection Progress: {unlockedItems} / {totalItems}</p>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full md:w-64">
                        <div className="flex justify-between text-xs mb-1 font-bold">
                            <span className="text-amber-500">{progress}% Complete</span>
                        </div>
                        <div className="w-full h-4 bg-black rounded-full border border-slate-700 overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-amber-700 to-yellow-500 transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Search artifacts..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                        />
                    </div>
                    <select 
                        value={filterRarity} 
                        onChange={(e) => setFilterRarity(e.target.value as Rarity | 'ALL')}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                    >
                        <option value="ALL">All Rarities</option>
                        {RARITY_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20">
                    {filteredItems.map(item => {
                        const isDiscovered = discoveredItems.includes(item.id);
                        const iconSource = ITEM_ICONS[item.id];
                        const FallbackIcon = Box;

                        return (
                            <div 
                                key={item.id}
                                className={`
                                    relative group p-3 rounded-xl border flex flex-col gap-3 transition-all duration-200 overflow-hidden
                                    ${isDiscovered 
                                        ? `bg-slate-900 ${RARITY_COLORS[item.rarity].replace('text-', 'border-')} hover:scale-[1.02] hover:shadow-lg cursor-pointer` 
                                        : 'bg-black border-slate-800 opacity-60 hover:opacity-80'
                                    }
                                `}
                                onClick={() => isDiscovered && onInspect(item)}
                            >
                                {/* Lock Overlay for Undiscovered */}
                                {!isDiscovered && (
                                    <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center backdrop-blur-[1px]">
                                        <Lock size={32} className="text-slate-600" />
                                    </div>
                                )}

                                <div className="flex justify-between items-start relative z-10">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shadow-inner overflow-hidden ${isDiscovered ? 'bg-black/40 border-white/10' : 'bg-slate-800 border-slate-700'}`}>
                                        {isDiscovered ? (
                                            typeof iconSource === 'string' ? (
                                                <img src={iconSource} alt={item.name} className="w-7 h-7 object-contain" />
                                            ) : (
                                                (() => {
                                                    const IconComp = iconSource || FallbackIcon;
                                                    return <IconComp size={20} className={RARITY_COLORS[item.rarity].split(' ')[0]} />;
                                                })()
                                            )
                                        ) : (
                                            <span className="text-slate-600 text-lg font-bold">?</span>
                                        )}
                                    </div>
                                    {isDiscovered && (
                                        <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${RARITY_BG[item.rarity].split(' ')[0].replace('/30','')}`}></div>
                                    )}
                                </div>

                                <div className="relative z-10">
                                    <h4 className={`font-bold text-sm truncate ${isDiscovered ? 'text-slate-200' : 'text-slate-600'}`}>
                                        {isDiscovered ? item.name : '??????'}
                                    </h4>
                                    <div className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${isDiscovered ? RARITY_COLORS[item.rarity].split(' ')[0] : 'text-slate-700'}`}>
                                        {item.rarity}
                                    </div>
                                </div>

                                {isDiscovered && (
                                    <div className="relative z-10 mt-auto pt-2 border-t border-white/5 flex justify-between text-[10px] text-slate-500 font-mono">
                                        <span>PWR: {item.power}</span>
                                        <span>{item.type}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
