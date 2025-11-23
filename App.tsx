
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { Rarity, InventoryItem, ItemType, Item } from './types';
import { RARITY_COLORS, RARITY_BG, ITEM_VISUALS, ITEM_ICONS, PITY_THRESHOLDS, ROLL_COST, UPGRADES, RARITY_ORDER, QUESTS_DB, UPGRADE_RATES, UPGRADE_COSTS } from './constants';
import { ITEMS_DB } from './data/gameData';
import { Star, Zap, Trash2, ShoppingBag, Skull, Sword, TrendingUp, Coins, Diamond, Ghost, Hammer, MessageSquare, Send, Scroll, ShieldAlert, Info, ArrowUpCircle, ArrowLeft, Gift, Box, X, AlignLeft, Tag, Fingerprint, ArrowDownWideNarrow, ArrowUpNarrowWide, Clock, Hash, Layers, Sun, Book } from 'lucide-react';
import { VoidWorld } from './components/VoidWorld';
import { CinematicReveal } from './components/CinematicReveal';
import { ForgeOverlay } from './components/ForgeOverlay';
import { ForgeResultReveal } from './components/ForgeResultReveal';
import { ItemCard } from './components/ItemCard';
import { ItemDetailModal } from './components/ItemDetailModal';
import { MachineVisual } from './components/MachineVisual';
import { WitchCauldron } from './components/WitchCauldron';
import { CodexView } from './components/CodexView';

const ProgressBar = ({ current, max, color = "bg-blue-500" }: { current: number, max: number, color?: string }) => (
  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
    <div className={`${color} h-2.5 rounded-full transition-all duration-300 ease-out`} style={{ width: `${Math.min(100, (current / max) * 100)}%` }}></div>
  </div>
);

type SortOption = 'rarity' | 'power' | 'value' | 'count' | 'newest' | 'type';

export default function App() {
  const { 
      gameState, isRolling, isForging, cinematicItem, forgedItemResult, resolveCinematic, resolveForge, lastItemObtained, messages, shakeScreen, derivedStats, activeEvent, chatHistory,
      performRoll, sellItem, sellAllItems, equipItem, claimQuest, sendChatMessage, manualCharge, attackBoss, buyUpgrade, unlockSecret, toggleEvent,
      selectForgeItem, attemptUpgrade, selectedForgeId, enterHauntedRealm, exitHauntedRealm, performTrickOrTreat, toggleItemLock
  } = useGameEngine();
  
  const [activeTab, setActiveTab] = useState<'gacha' | 'inventory' | 'codex' | 'boss' | 'shop' | 'forge'>('gacha');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isQuestOpen, setIsQuestOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [inspectItem, setInspectItem] = useState<InventoryItem | null>(null); 
  
  const [sortBy, setSortBy] = useState<SortOption>('rarity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
  }, [chatHistory]);

  const handleChatSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (chatInput.trim()) {
          sendChatMessage(chatInput);
          setChatInput("");
      }
  };
  
  const handleLootInspect = (item: Item) => {
        const previewItem: InventoryItem = {
            ...item,
            uuid: 'preview',
            upgradeLevel: 0,
            obtainedAt: Date.now(),
            count: 1
        };
        setInspectItem(previewItem);
  };

  const sortedInventory = useMemo(() => {
      const items = [...gameState.inventory];
      return items.sort((a, b) => {
          let comparison = 0;
          switch (sortBy) {
              case 'rarity':
                  comparison = RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
                  break;
              case 'power':
                  comparison = a.power - b.power;
                  break;
              case 'value':
                  comparison = a.sellValue - b.sellValue;
                  break;
              case 'count':
                  comparison = a.count - b.count;
                  break;
              case 'newest':
                  comparison = a.obtainedAt - b.obtainedAt;
                  break;
              case 'type':
                  comparison = a.type.localeCompare(b.type);
                  break;
              default:
                  comparison = 0;
          }
          return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [gameState.inventory, sortBy, sortOrder]);

  if (gameState.activeZone === 'haunted') {
      return (
          <div className={`flex flex-col h-screen bg-[#0d0616] text-orange-100 font-sans overflow-hidden relative ${shakeScreen ? 'animate-shake' : ''}`}>
                <CinematicReveal item={cinematicItem} onComplete={resolveCinematic} />
                
                <ItemDetailModal item={inspectItem} onClose={() => setInspectItem(null)} />
                
                {/* Background Atmosphere */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a0b2e_0%,#050308_100%)] pointer-events-none z-0"></div>
                <div className="absolute inset-0 opacity-20 pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
                
                {/* Animated Fog Layer */}
                <div className="absolute bottom-0 left-0 w-full h-96 opacity-40 pointer-events-none z-0 mix-blend-screen">
                    <div className="fog-layer animate-fog-scroll"></div>
                </div>

                {/* Bats */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute animate-bat-fly text-black opacity-60" style={{top: '15%', left: '-10%'}}>🦇</div>
                    <div className="absolute animate-bat-fly text-black opacity-40" style={{top: '45%', left: '-20%', animationDelay: '2s', animationDuration: '12s'}}>🦇</div>
                </div>

                <header className="h-20 bg-black/40 border-b border-purple-900/30 flex items-center justify-between px-6 shadow-2xl z-20 relative backdrop-blur-sm shrink-0">
                    <div className="flex flex-col">
                        <h1 className="font-fantasy text-4xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500 drop-shadow-lg animate-pulse flex items-center gap-3">
                            <Ghost size={32} className="text-purple-400" /> HAUNTED REALM
                        </h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="bg-[#1a1225] border-2 border-[#3d2b52] px-6 py-2 rounded-lg flex items-center gap-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] relative group">
                             <div className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-bold px-2 rounded-full animate-bounce">EVENT</div>
                             <span className="text-3xl drop-shadow-md group-hover:scale-110 transition-transform">🍬</span>
                             <div className="flex flex-col leading-none">
                                 <span className="font-bold font-mono text-2xl text-orange-100 drop-shadow-md">{gameState.wallet.candy || 0}</span>
                                 <span className="text-[10px] text-orange-400 uppercase tracking-widest opacity-80">Candy Corn</span>
                             </div>
                        </div>
                        <button onClick={exitHauntedRealm} className="group flex items-center gap-2 bg-red-950/80 hover:bg-red-900 text-red-200 px-6 py-3 rounded-lg text-sm font-bold transition-all border border-red-800 hover:border-red-500 shadow-lg uppercase tracking-wider">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Escape
                        </button>
                    </div>
                </header>

                <main className="flex-1 flex flex-col lg:flex-row p-6 gap-8 relative z-10 items-center justify-center overflow-hidden">
                    
                    {/* --- THE GRAVEYARD (BOSS STAGE) --- */}
                    <div 
                        className="relative w-[500px] h-[500px] group cursor-crosshair select-none active:scale-[0.99] transition-transform"
                        onClick={attackBoss}
                    >
                        {/* 1. STONE FRAME (Outer Shell) */}
                        <div className="absolute inset-0 z-20 pointer-events-none">
                            {/* Top Bar */}
                            <div className="absolute top-0 left-0 right-0 h-12 bg-[#2a2a2a] border-b-4 border-[#1a1a1a] rounded-t-2xl flex items-center justify-center shadow-lg">
                                <div className="text-orange-500 font-fantasy text-2xl tracking-[0.2em] drop-shadow-[0_0_10px_rgba(234,88,12,0.8)]">THE GRAVEYARD</div>
                            </div>
                            {/* Left Pillar */}
                            <div className="absolute top-12 bottom-0 left-0 w-8 bg-[#1f1f1f] border-r-2 border-[#0a0a0a] bg-[url('https://www.transparenttextures.com/patterns/dark-stone.png')]"></div>
                            {/* Right Pillar */}
                            <div className="absolute top-12 bottom-0 right-0 w-8 bg-[#1f1f1f] border-l-2 border-[#0a0a0a] bg-[url('https://www.transparenttextures.com/patterns/dark-stone.png')]"></div>
                            {/* Bottom Base */}
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#1a1a1a] border-t-4 border-[#0a0a0a] rounded-b-2xl bg-[url('https://www.transparenttextures.com/patterns/dark-stone.png')]"></div>
                            
                            {/* Corner Accents */}
                            <div className="absolute -top-2 -left-2 w-16 h-16 bg-[#333] rounded-full border-4 border-[#111] z-30"></div>
                            <div className="absolute -top-2 -right-2 w-16 h-16 bg-[#333] rounded-full border-4 border-[#111] z-30"></div>
                            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-[#222] rounded-full border-4 border-[#111] z-30"></div>
                            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[#222] rounded-full border-4 border-[#111] z-30"></div>
                        </div>

                        {/* 2. SCENE BACKGROUND (Inner Content) */}
                        <div className="absolute inset-[20px] bg-black overflow-hidden rounded-lg border-4 border-[#0f0f0f] shadow-inner z-10">
                            {/* Sky */}
                            <div className="absolute inset-0 bg-gradient-to-b from-[#0f0518] to-[#1f100a]"></div>
                            
                            {/* Moon */}
                            <div className="absolute top-8 right-12 w-24 h-24 rounded-full bg-orange-100 opacity-80 shadow-[0_0_50px_rgba(255,165,0,0.5)] blur-sm"></div>
                            
                            {/* Silhouette Trees */}
                            <div className="absolute bottom-0 left-0 w-full h-48 bg-[url('https://www.transparenttextures.com/patterns/black-twill.png')] opacity-80" 
                                 style={{ clipPath: 'polygon(0% 100%, 10% 60%, 20% 90%, 30% 50%, 40% 100%, 60% 100%, 70% 40%, 80% 80%, 90% 30%, 100% 100%)', backgroundColor: '#050505' }}>
                            </div>

                            {/* Ground/Lava Cracks */}
                            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-[#331005] to-transparent"></div>
                            <div className="absolute bottom-[-10px] w-full h-10 bg-orange-600 blur-md animate-pulse opacity-40"></div>

                            {/* Floating Souls */}
                            <div className="absolute top-1/3 left-1/4 text-orange-500/30 animate-float-slow text-2xl">👻</div>
                            <div className="absolute top-1/2 right-1/4 text-orange-500/20 animate-float-slow text-xl" style={{animationDelay: '1.5s'}}>👻</div>
                        </div>

                        {/* 3. BOSS ENTITY */}
                        <div className="absolute inset-0 z-10 flex items-center justify-center mt-8">
                             {/* Boss Glow */}
                             <div className="absolute w-64 h-64 bg-orange-600/20 rounded-full blur-[60px] animate-pulse"></div>
                             
                             {/* Boss Image / Icon */}
                             <div className="relative group-active:scale-95 transition-transform duration-75">
                                {gameState.activeEnemy.id.includes('pumpkin') ? (
                                    // Custom Pumpkin King Visual
                                    <div className="relative w-56 h-56">
                                        <div className="absolute inset-x-0 bottom-0 h-4 bg-black/50 blur-md rounded-[100%] scale-x-150"></div>
                                        <img src="https://cdn-icons-png.flaticon.com/512/2060/2060162.png" alt="Pumpkin King" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] animate-float-slow filter brightness-110 contrast-125" />
                                        <div className="absolute top-[35%] left-[25%] w-4 h-4 bg-yellow-200 rounded-full blur-sm animate-pulse"></div>
                                        <div className="absolute top-[35%] right-[25%] w-4 h-4 bg-yellow-200 rounded-full blur-sm animate-pulse"></div>
                                    </div>
                                ) : (
                                    <div className="text-9xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] animate-float-slow">👻</div>
                                )}
                             </div>
                        </div>

                        {/* 4. UI OVERLAYS (Health & Name) */}
                        <div className="absolute top-20 right-8 z-30 w-48">
                            <div className="bg-[#2a2a2a] border-2 border-[#4a3b2a] p-2 rounded shadow-xl transform rotate-1 hover:rotate-0 transition-transform">
                                <div className="flex items-center gap-2 mb-1 border-b border-white/10 pb-1">
                                    <Skull size={14} className="text-stone-400" />
                                    <span className="text-xs font-bold text-stone-200 truncate">{gameState.activeEnemy.name}</span>
                                </div>
                                <div className="relative h-3 bg-black rounded-full overflow-hidden border border-white/10">
                                    <div 
                                        className="h-full bg-gradient-to-r from-red-900 to-red-600 transition-all duration-100" 
                                        style={{ width: `${(gameState.activeEnemy.hp / gameState.activeEnemy.maxHp) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="text-[9px] text-right text-stone-500 font-mono mt-0.5">
                                    {gameState.activeEnemy.hp} / {gameState.activeEnemy.maxHp}
                                </div>
                            </div>
                        </div>

                        {/* 5. DROP INFO BOX */}
                        <div className="absolute bottom-16 right-8 z-30">
                             <div className="bg-[#1a120b] border border-orange-900/50 px-3 py-1.5 rounded text-xs text-orange-300 font-bold shadow-lg flex items-center gap-2 transform -rotate-1">
                                 <span>Drops:</span>
                                 <div className="flex items-center gap-1">
                                     <span>🍬</span>
                                     <span>3-5 Candy</span>
                                 </div>
                             </div>
                        </div>

                        {/* 6. INTERACTION HINT */}
                        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <span className="text-red-500 font-fantasy text-xl drop-shadow-[0_2px_0_#000] tracking-widest animate-pulse">CLICK TO ATTACK</span>
                        </div>
                    </div>

                    {/* NEW: WITCH CAULDRON */}
                    <div className="flex-1 flex flex-col items-center justify-center relative min-w-[300px]">
                        <WitchCauldron 
                            onClick={performTrickOrTreat}
                            disabled={isRolling || (gameState.wallet.candy || 0) < 50}
                        />
                    </div>

                    <div className="w-80 h-[500px] bg-[#110a1f] border-2 border-purple-900/50 rounded-2xl p-0 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden">
                        <div className="bg-[#1a0e2e] p-4 border-b border-purple-900/30 flex items-center justify-center gap-2 shadow-md z-10">
                            <Gift size={18} className="text-orange-400" />
                            <h3 className="font-fantasy text-lg text-orange-100 tracking-wide">MUHTEMEL ÖDÜLLER</h3>
                        </div>
                        
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5 pointer-events-none"></div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-black/20 relative z-0">
                            {ITEMS_DB.filter(i => i.isEventItem).sort((a, b) => a.baseChance - b.baseChance).map(item => {
                                const iconSource = ITEM_ICONS[item.id];
                                const FallbackIcon = Box;
                                return (
                                    <div 
                                        key={item.id} 
                                        className="flex items-center gap-3 p-2.5 rounded-lg bg-black/20 border border-white/5 hover:bg-purple-900/20 hover:border-purple-500/30 transition-all cursor-help group relative overflow-hidden"
                                        onDoubleClick={() => handleLootInspect(item)}
                                        title="Double click to inspect"
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${RARITY_BG[item.rarity].replace('bg-', 'bg-')}`}></div>
                                        
                                        <div className={`w-10 h-10 rounded border border-white/10 shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden bg-[#0a0a0a]`}>
                                            {typeof iconSource === 'string' ? (
                                                <img src={iconSource} alt={item.name} className="w-7 h-7 object-contain group-hover:scale-110 transition-transform" />
                                            ) : (
                                                (() => {
                                                    const IconComp = iconSource || FallbackIcon;
                                                    return <IconComp size={20} className={RARITY_COLORS[item.rarity].split(' ')[0]} />;
                                                })()
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`font-bold text-xs truncate ${RARITY_COLORS[item.rarity].split(' ')[0]}`}>{item.name}</div>
                                            <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">{item.rarity}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono text-xs font-bold text-white bg-white/5 px-1.5 py-0.5 rounded">{item.baseChance}%</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </main>
                
                <div className="h-12 bg-[#08040f] border-t border-purple-900/20 px-4 flex items-center z-20 font-mono text-[10px] text-purple-300/40 shrink-0">
                     {messages.length > 0 && (
                        <div className="truncate w-full">
                            <span className="text-purple-500 mr-2">>></span>{messages[0]}
                        </div>
                     )}
                </div>
          </div>
      );
  }

  // --- NORMAL VIEW ---
  const themeColor = activeEvent ? 'text-orange-500' : 'text-purple-400';
  const buttonGradient = activeEvent ? 'from-orange-600 to-red-600' : 'from-purple-600 to-indigo-600';

  return (
    <div className={`flex flex-col h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden relative ${shakeScreen ? 'animate-shake' : ''}`}>
        
        <CinematicReveal item={cinematicItem} onComplete={resolveCinematic} />
        <ForgeOverlay isForging={isForging} />
        <ForgeResultReveal item={forgedItemResult} onComplete={resolveForge} />
        
        <ItemDetailModal item={inspectItem} onClose={() => setInspectItem(null)} />

        {isQuestOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setIsQuestOpen(false)}>
                <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                        <h2 className="font-fantasy text-xl text-yellow-500 flex items-center gap-2"><Scroll size={20} /> Quests</h2>
                        <button onClick={() => setIsQuestOpen(false)} className="text-slate-500 hover:text-white">✕</button>
                    </div>
                    <div className="overflow-y-auto p-4 gap-4 flex flex-col">
                        {QUESTS_DB.map(quest => {
                            const progress = gameState.questProgress[quest.id] || 0;
                            const isCompleted = progress >= quest.target;
                            const isClaimed = gameState.claimedQuests.includes(quest.id);
                            return (
                                <div key={quest.id} className={`p-4 rounded-lg border ${isClaimed ? 'border-green-900 bg-green-950/30 opacity-60' : isCompleted ? 'border-yellow-500 bg-yellow-950/30' : 'border-slate-700 bg-slate-900'}`}>
                                    <div className="flex justify-between mb-2">
                                        <h3 className="font-bold text-sm">{quest.description}</h3>
                                        <div className="text-xs text-slate-400">{progress} / {quest.target}</div>
                                    </div>
                                    <ProgressBar current={progress} max={quest.target} color={isCompleted ? "bg-yellow-500" : "bg-blue-500"} />
                                    <div className="flex justify-between items-end mt-3">
                                        <div className="text-xs flex gap-2">
                                            <span className="flex items-center gap-1 text-yellow-200"><Coins size={10} /> {quest.reward.coins}</span>
                                            <span className="flex items-center gap-1 text-emerald-200"><Diamond size={10} /> {quest.reward.gems}</span>
                                        </div>
                                        <button onClick={() => claimQuest(quest.id)} disabled={!isCompleted || isClaimed} className={`text-xs px-3 py-1 rounded font-bold ${isClaimed ? 'bg-transparent text-green-500' : isCompleted ? 'bg-yellow-600 text-white hover:bg-yellow-500 animate-pulse' : 'bg-slate-700 text-slate-500'}`}>{isClaimed ? 'CLAIMED' : isCompleted ? 'CLAIM' : 'LOCKED'}</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )}
        
        {activeEvent && (
            <div className="bg-orange-900 text-orange-100 text-xs font-bold text-center py-1 border-b border-orange-700 z-50 animate-pulse shadow-md">
                🎃 {activeEvent.name.toUpperCase()} ACTIVE! {activeEvent.description}
            </div>
        )}

        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 shadow-lg z-20 relative">
            <div className="flex items-center gap-3 select-none cursor-pointer" onDoubleClick={() => toggleEvent('HALLOWEEN')}>
                <div className={`w-9 h-9 bg-gradient-to-br ${activeEvent ? 'from-orange-700 to-red-700' : 'from-purple-700 to-indigo-700'} rounded-lg flex items-center justify-center font-bold shadow-inner border border-white/10 text-white`}>
                    {activeEvent ? '🎃' : 'V'}
                </div>
                <div className="flex flex-col leading-tight">
                     <span className={`font-fantasy text-lg text-transparent bg-clip-text bg-gradient-to-r ${activeEvent ? 'from-orange-300 to-red-300' : 'from-purple-300 to-blue-300'}`}>Void Chamber</span>
                     <span className="text-[10px] text-slate-500 tracking-wider">RNG SIMULATION v4.1</span>
                </div>
            </div>
            
            <div className="flex gap-2 md:gap-4 text-xs md:text-sm font-mono">
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-full">
                    <Coins size={14} className="text-yellow-400" />
                    <span className="text-yellow-100">{gameState.wallet.coins.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-full">
                    <Diamond size={14} className="text-emerald-400" />
                    <span className="text-emerald-100">{gameState.wallet.gems}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-800 transition active:scale-95 select-none" onClick={manualCharge}>
                    <div className="flex items-center gap-1">
                        <Zap size={14} className="text-blue-400" />
                        <span className="text-blue-100">{Math.floor(gameState.stats.energy)}</span>
                    </div>
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 transition-all" style={{width: `${(gameState.stats.energy / gameState.stats.maxEnergy) * 100}%`}}></div>
                    </div>
                </div>
            </div>
        </header>

        <main className="flex-1 overflow-hidden flex relative z-10">
            
            <nav className="w-16 md:w-20 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-6 gap-4 z-10 shadow-xl">
                {[
                    { id: 'gacha', icon: Star, color: activeEvent ? 'orange' : 'purple', label: 'Fate' },
                    { id: 'inventory', icon: ShoppingBag, color: 'blue', label: 'Items', badge: gameState.inventory.length },
                    { id: 'codex', icon: Book, color: 'amber', label: 'Codex' }, // NEW TAB
                    { id: 'shop', icon: TrendingUp, color: 'emerald', label: 'Upgrade' },
                    { id: 'forge', icon: Hammer, color: 'red', label: 'Forge' },
                    { id: 'boss', icon: Skull, color: 'red', label: 'Boss' },
                ].map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`
                            relative group p-3.5 rounded-2xl transition-all duration-300 overflow-visible
                            ${activeTab === tab.id ? `bg-${tab.color}-600 text-white shadow-lg shadow-${tab.color}-900/20 scale-105` : 'text-gray-500 hover:bg-slate-800 hover:text-gray-300'}
                        `}
                    >
                        <div className="relative z-10">
                            <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                        </div>
                        {tab.id === 'forge' && (
                             <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-2xl">
                                 <div className="absolute inset-0 bg-black/20"></div>
                                 <img src="https://media.tenor.com/P-W7yXlkxV4AAAAC/fire-flame.gif" alt="Forge Fire" className="w-full h-full object-cover opacity-90 mix-blend-screen scale-125 translate-y-2 filter contrast-125 saturate-150" />
                             </div>
                        )}
                        {tab.badge && tab.badge > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-slate-900 z-20">
                                {tab.badge}
                            </span>
                        )}
                        
                        {/* TOOLTIP */}
                        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-slate-600">
                            {tab.label}
                        </div>
                    </button>
                ))}
                <div className="mt-auto mb-4">
                    <button 
                        onClick={() => setIsQuestOpen(true)}
                        className="p-3.5 rounded-2xl text-yellow-500 hover:bg-yellow-900/20 animate-pulse-fast relative group"
                    >
                        <Scroll size={22} />
                        {Object.keys(gameState.questProgress).length > gameState.claimedQuests.length && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-slate-600">
                            Quests
                        </div>
                    </button>
                </div>
            </nav>

            <div className="flex-1 overflow-y-auto relative scrollbar-hide">
                {activeTab === 'gacha' ? (
                    // ... (Gacha View Code - same as before)
                    <div className="relative w-full h-full overflow-hidden">
                        <VoidWorld level={gameState.bossLevel} isEventActive={!!activeEvent} />
                        <div className="relative z-10 flex flex-col items-center justify-center h-full max-h-[80vh] p-4 md:p-8">
                            <MachineVisual isRolling={isRolling || !!cinematicItem} lastItem={lastItemObtained} />
                            <div className="flex flex-col gap-4 w-full max-w-sm z-10">
                                <button 
                                    onClick={performRoll}
                                    disabled={isRolling || !!cinematicItem || gameState.stats.energy < ROLL_COST}
                                    className={`group relative w-full py-5 rounded-2xl font-bold text-xl tracking-[0.2em] transition-all transform active:scale-95 overflow-hidden border border-white/10 ${isRolling || cinematicItem ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : `bg-gradient-to-r ${buttonGradient} text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]`}`}
                                >
                                    <span className="relative z-10">{isRolling || cinematicItem ? 'CHANNELING...' : 'SUMMON'}</span>
                                </button>
                                <div className="text-center text-xs font-mono text-slate-400">Cost: {ROLL_COST} Energy</div>
                                <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 mt-4">
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                                        <div className="text-xs text-gray-400">
                                            <div className="uppercase tracking-wider mb-1">Total Luck</div>
                                            <div className="text-xl text-green-400 font-mono font-bold">x{derivedStats.totalLuck.toFixed(2)}</div>
                                        </div>
                                        <div className="text-right text-xs text-gray-400">
                                            <div className="uppercase tracking-wider mb-1">Rolls</div>
                                            <div className="text-xl text-blue-400 font-mono font-bold">{gameState.totalRolls}</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                                        <span>Mythic Pity</span>
                                        <span className={gameState.pityCounters[Rarity.MYTHIC] > 300 ? "text-red-400 animate-pulse" : "text-gray-400"}>
                                            {gameState.pityCounters[Rarity.MYTHIC]}/{PITY_THRESHOLDS[Rarity.MYTHIC]}
                                        </span>
                                    </div>
                                    <ProgressBar current={gameState.pityCounters[Rarity.MYTHIC] || 0} max={PITY_THRESHOLDS[Rarity.MYTHIC]} color="bg-gradient-to-r from-red-600 to-pink-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto p-4 md:p-8 h-full">
                        {activeTab === 'inventory' && (
                            <div className="h-full flex flex-col">
                                <div className="flex flex-col gap-4 mb-6 border-b border-slate-800 pb-4 bg-slate-950 p-4 rounded-xl shadow-sm">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h2 className="text-3xl font-fantasy text-white">Armory</h2>
                                            <p className="text-slate-400 text-sm mt-1">Manage your artifacts. Double click to inspect.</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-slate-500 uppercase tracking-wider">Equipped Weapon</div>
                                            <div className={`${themeColor} font-bold flex items-center justify-end gap-2`}>
                                                <Sword size={14} /> {derivedStats.weaponName}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* SORTING TOOLBAR */}
                                    <div className="flex flex-wrap gap-2 pt-2 items-center">
                                        <div className="text-xs text-slate-500 font-bold mr-2 uppercase tracking-wider">SORT BY:</div>
                                        {[
                                            { key: 'rarity', label: 'Rarity', icon: Star },
                                            { key: 'power', label: 'Power', icon: Zap },
                                            { key: 'value', label: 'Value', icon: Coins },
                                            { key: 'count', label: 'Count', icon: Layers },
                                            { key: 'newest', label: 'Newest', icon: Clock },
                                            { key: 'type', label: 'Type', icon: Hash },
                                        ].map(opt => (
                                            <button
                                                key={opt.key}
                                                onClick={() => setSortBy(opt.key as SortOption)}
                                                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors border ${sortBy === opt.key ? 'bg-blue-900/50 text-blue-200 border-blue-700' : 'bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800'}`}
                                            >
                                                <opt.icon size={12} /> {opt.label}
                                            </button>
                                        ))}
                                        
                                        <div className="h-6 w-px bg-slate-800 mx-2"></div>

                                        <button 
                                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                            className="px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                                        >
                                            {sortOrder === 'asc' ? <ArrowUpNarrowWide size={14} /> : <ArrowDownWideNarrow size={14} />}
                                            {sortOrder === 'asc' ? 'ASC' : 'DESC'}
                                        </button>

                                        <button 
                                            onClick={sellAllItems}
                                            className="px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 bg-red-900/50 border border-red-800 hover:bg-red-900 text-red-200 transition-colors ml-auto"
                                        >
                                            <Trash2 size={14} /> Sell All
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20">
                                    {sortedInventory.map((item) => (
                                        <ItemCard 
                                            key={item.uuid} 
                                            item={item} 
                                            isEquipped={gameState.equippedWeaponId === item.uuid}
                                            onSell={sellItem} 
                                            onEquip={equipItem}
                                            onInspect={setInspectItem}
                                            onToggleLock={toggleItemLock} // NEW: Pass toggle function
                                        />
                                    ))}
                                    {sortedInventory.length === 0 && (
                                        <div className="col-span-full text-center py-10 text-slate-600 italic">
                                            Your inventory is empty. Summon some artifacts!
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* NEW CODEX TAB */}
                        {activeTab === 'codex' && (
                            <CodexView discoveredItems={gameState.discoveredItems} onInspect={(item) => handleLootInspect(item)} />
                        )}

                        {/* ... (Other tabs: forge, shop, boss - same as before) */}
                        {activeTab === 'forge' && (
                            <div className="h-full flex flex-col md:flex-row gap-6">
                                <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-4 overflow-y-auto max-h-[80vh]">
                                    <h3 className="font-fantasy text-xl text-yellow-500 mb-4 flex items-center gap-2">
                                        <Star size={20} /> Legendary Artifacts
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {gameState.inventory
                                            .filter(i => [Rarity.LEGENDARY, Rarity.MYTHIC, Rarity.DIVINE, Rarity.EXOTIC, Rarity.IMPOSSIBLE].includes(i.rarity) && i.type === ItemType.WEAPON)
                                            .map(item => (
                                            <ItemCard 
                                                key={item.uuid}
                                                item={item}
                                                isEquipped={gameState.equippedWeaponId === item.uuid}
                                                onSell={() => {}}
                                                onEquip={() => {}}
                                                showActions={false}
                                                onSelect={selectForgeItem}
                                                isSelected={selectedForgeId === item.uuid}
                                                onToggleLock={toggleItemLock} // Also in forge
                                            />
                                        ))}
                                        {gameState.inventory.filter(i => [Rarity.LEGENDARY, Rarity.MYTHIC, Rarity.DIVINE, Rarity.EXOTIC].includes(i.rarity)).length === 0 && (
                                            <div className="col-span-2 text-center text-slate-500 py-10 italic">
                                                No legendary items found. Summon more artifacts!
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 bg-slate-950 rounded-xl border-2 border-red-900/30 p-6 flex flex-col items-center relative overflow-hidden">
                                    <h2 className="text-3xl font-fantasy text-red-500 mb-8 z-10">The Anvil</h2>
                                    {selectedForgeId ? (
                                        <div className="w-full flex flex-col items-center z-10">
                                            {(() => {
                                                const item = gameState.inventory.find(i => i.uuid === selectedForgeId);
                                                const blacksmithStone = gameState.inventory.find(i => i.id === 'blacksmith_stone');
                                                if (!item) return null;

                                                const currentLevel = item.upgradeLevel || 0;
                                                const successRate = UPGRADE_RATES[Math.min(currentLevel, UPGRADE_RATES.length - 1)];
                                                const cost = UPGRADE_COSTS[Math.min(currentLevel, UPGRADE_COSTS.length - 1)];
                                                const canAfford = gameState.wallet.coins >= cost;
                                                const hasMaterial = (blacksmithStone?.count || 0) > 0;

                                                return (
                                                    <>
                                                        <div className="relative mb-8">
                                                            <ItemCard item={item} isEquipped={false} onSell={() => {}} onEquip={() => {}} showActions={false} />
                                                            <div className="absolute -top-3 -right-3 bg-black border border-white p-1 rounded-full">
                                                                <Sword size={16} className="text-yellow-400" />
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="w-full bg-black/40 p-4 rounded-lg border border-slate-800 mb-6">
                                                            <div className="flex justify-between mb-2 text-sm">
                                                                <span className="text-slate-400">Current Level</span>
                                                                <span className="font-bold">+{currentLevel}</span>
                                                            </div>
                                                            <div className="flex justify-between mb-2 text-sm">
                                                                <span className="text-slate-400">Success Rate</span>
                                                                <span className={`font-bold ${successRate > 50 ? 'text-green-400' : 'text-red-400'}`}>{successRate}%</span>
                                                            </div>
                                                            <div className="flex justify-between mb-2 text-sm">
                                                                <span className="text-slate-400">Risk</span>
                                                                <span className="text-red-500 font-bold flex items-center gap-1">
                                                                    <ShieldAlert size={14} /> BREAKABLE
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="w-full grid grid-cols-2 gap-4 mb-8">
                                                            <div className={`p-3 rounded border flex flex-col items-center ${hasMaterial ? 'border-green-800 bg-green-900/10' : 'border-red-800 bg-red-900/10'}`}>
                                                                <div className="text-xs text-slate-400 mb-1">Material</div>
                                                                <div className="font-bold text-sm">Blacksmith Stone</div>
                                                                <div className={`text-xs ${hasMaterial ? 'text-green-400' : 'text-red-400'}`}>
                                                                    {blacksmithStone?.count || 0} / 1
                                                                </div>
                                                            </div>
                                                            <div className={`p-3 rounded border flex flex-col items-center ${canAfford ? 'border-green-800 bg-green-900/10' : 'border-red-800 bg-red-900/10'}`}>
                                                                <div className="text-xs text-slate-400 mb-1">Cost</div>
                                                                <div className="font-bold text-sm flex items-center gap-1">
                                                                    <Coins size={12} /> {cost}
                                                                </div>
                                                                <div className={`text-xs ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                                                                    {canAfford ? 'Affordable' : 'Too Expensive'}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <button 
                                                            onClick={attemptUpgrade}
                                                            disabled={!canAfford || !hasMaterial}
                                                            className={`
                                                                w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all
                                                                ${canAfford && hasMaterial 
                                                                    ? 'bg-red-700 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(185,28,28,0.4)] hover:scale-105' 
                                                                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                                                }
                                                            `}
                                                        >
                                                            <Hammer size={20} /> UPGRADE
                                                        </button>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-64 text-slate-600 z-10">
                                            <ArrowUpCircle size={64} className="mb-4 opacity-20" />
                                            <p className="text-center text-sm">Select a Legendary Weapon<br/>from the left to upgrade.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'shop' && (
                            <div className="max-w-3xl mx-auto">
                                <h2 className="text-3xl font-fantasy text-white mb-4">Void Market</h2>
                                <div className="grid gap-4">
                                    {UPGRADES.map(upgrade => {
                                        const currentLevel = gameState.upgrades[upgrade.id] || 1;
                                        const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel - 1));
                                        const canAfford = upgrade.currency === 'coins' 
                                            ? gameState.wallet.coins >= cost 
                                            : gameState.wallet.gems >= cost;

                                        return (
                                            <div key={upgrade.id} className="bg-slate-950 border border-slate-800 p-6 rounded-xl flex items-center justify-between hover:border-slate-600 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${canAfford ? 'bg-slate-800 text-blue-400' : 'bg-red-950 text-red-400'}`}>
                                                        {upgrade.type === 'click' && <Sword size={24} />}
                                                        {upgrade.type === 'energy' && <Zap size={24} />}
                                                        {upgrade.type === 'regen' && <TrendingUp size={24} />}
                                                        {upgrade.type === 'luck' && <Star size={24} />}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-bold text-lg">{upgrade.name}</h3>
                                                            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400">Lvl {currentLevel}</span>
                                                        </div>
                                                        <p className="text-sm text-slate-500">{upgrade.description}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => buyUpgrade(upgrade.id)}
                                                    disabled={!canAfford}
                                                    className={`px-6 py-3 rounded-lg font-bold text-sm flex flex-col items-center min-w-[100px] transition-all ${canAfford ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                                                >
                                                    <span>UPGRADE</span>
                                                    <span className="text-[10px] font-mono opacity-80 flex items-center gap-1 mt-1">
                                                        {upgrade.currency === 'coins' ? <Coins size={10} /> : <Diamond size={10} />}
                                                        {cost.toLocaleString()}
                                                    </span>
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {activeTab === 'boss' && (
                            // ... (Boss Tab same as before)
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="w-full max-w-2xl relative">
                                    <div 
                                        className="bg-slate-950 border border-red-900/50 p-8 rounded-3xl text-center relative overflow-hidden select-none cursor-crosshair active:scale-[0.99] transition-transform duration-75 shadow-[0_0_30px_rgba(153,27,27,0.1)] group"
                                        onClick={attackBoss}
                                    >
                                        <div className="absolute top-4 right-4 bg-red-950 border border-red-800 text-red-400 text-xs px-3 py-1 rounded-full font-mono">
                                            Lv.{gameState.bossLevel}
                                        </div>

                                        <h2 className="text-4xl font-fantasy text-red-500 mb-2 relative z-10 drop-shadow-md">{gameState.activeEnemy?.name}</h2>
                                        <p className="text-red-200/50 mb-8 text-sm italic relative z-10">"{gameState.activeEnemy?.description}"</p>
                                        
                                        <div className="w-48 h-48 mx-auto mb-8 relative z-10 group-active:scale-95 transition-transform">
                                            <div className="absolute inset-0 bg-red-600 rounded-full filter blur-[40px] opacity-10 animate-pulse"></div>
                                            <div className="w-full h-full bg-black/60 rounded-full border-4 border-red-800/50 flex items-center justify-center relative shadow-2xl">
                                                <Skull size={80} className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
                                            </div>
                                        </div>

                                        <div className="max-w-md mx-auto relative z-10">
                                            <div className="flex justify-between text-xs font-bold mb-2 tracking-wider">
                                                <span className="text-red-400">HEALTH</span>
                                                <span className="text-white">{gameState.activeEnemy?.hp} / {gameState.activeEnemy?.maxHp}</span>
                                            </div>
                                            <div className="h-4 bg-black rounded-full border border-red-900/50 overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-red-800 to-red-600 transition-all duration-100 ease-out" 
                                                    style={{ width: `${(gameState.activeEnemy.hp / gameState.activeEnemy.maxHp) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="mt-8 text-xs text-slate-500 font-mono">
                                            CLICK TO ATTACK • DPS: {derivedStats.totalDamage}
                                        </div>
                                    </div>
                                </div>

                                {activeEvent && activeEvent.id === 'hallows_eve' && (
                                    <button 
                                        onClick={enterHauntedRealm}
                                        className="mt-8 bg-orange-950 border border-orange-700 text-orange-400 px-8 py-4 rounded-xl font-bold font-fantasy tracking-widest hover:bg-orange-900 hover:text-orange-200 transition-all animate-bounce shadow-[0_0_30px_rgba(234,88,12,0.3)]"
                                    >
                                        🎃 ENTER HAUNTED REALM
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="absolute bottom-0 left-0 w-1/2 md:w-1/3 h-32 bg-gradient-to-t from-slate-950 to-transparent p-4 pt-12 pointer-events-none z-20">
                    <div className="flex flex-col-reverse gap-1">
                        {messages.map((m, i) => (
                            <div key={i} className={`text-xs font-mono ${m.includes('Gacha') ? 'text-purple-300' : m.includes('Öldü') ? 'text-red-400 font-bold' : m.includes('Secret') ? 'text-yellow-400' : m.includes('Equip') ? 'text-blue-300' : 'text-gray-400'} drop-shadow-sm`}>
                                <span className="opacity-30 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                                {m}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat Panel (Same as before) */}
            {isChatOpen && (
                <div className="w-64 md:w-80 bg-slate-950/95 border-l border-slate-800 flex flex-col z-20 absolute md:relative right-0 h-full shadow-2xl transition-all">
                    <div className="p-3 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                            <MessageSquare size={14} /> Global Chat
                        </h3>
                        <button onClick={() => setIsChatOpen(false)} className="md:hidden text-slate-500">✕</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2" ref={chatScrollRef}>
                        {chatHistory.map(msg => (
                            <div key={msg.id} className={`text-xs rounded p-2 ${msg.isSystem ? 'bg-yellow-950/30 border border-yellow-900/30' : 'bg-slate-900'}`}>
                                <div className="flex items-baseline justify-between mb-0.5">
                                    <span className={`font-bold ${msg.isSystem ? 'text-yellow-600' : msg.sender === 'YOU' ? 'text-blue-400' : 'text-slate-500'}`}>
                                        {msg.sender}
                                    </span>
                                    <span className="text-[10px] text-slate-700">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <div className={msg.isSystem ? 'text-yellow-200' : 'text-slate-300'}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleChatSubmit} className="p-3 border-t border-slate-800 flex gap-2">
                        <input 
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            placeholder="Say something..." 
                            className="flex-1 bg-black/50 border border-slate-700 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                        />
                        <button type="submit" className="bg-blue-600 p-1.5 rounded text-white hover:bg-blue-500">
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            )}
            {!isChatOpen && (
                 <button onClick={() => setIsChatOpen(true)} className="absolute top-4 right-4 bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white z-30 md:hidden">
                     <MessageSquare size={20} />
                 </button>
            )}

        </main>
    </div>
  );
}
