
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GameState, InventoryItem, Rarity, ItemType, ChatMessage } from '../types';
import { RngService } from '../services/rngSystem';
import { sendToDiscord } from '../services/discordService'; 
import { ROLL_COST, MAX_INVENTORY, UPGRADES, PITY_THRESHOLDS, EVENTS, QUESTS_DB, BOT_NAMES, CHAT_TEMPLATES, RARITY_ORDER, UPGRADE_RATES, UPGRADE_COSTS } from '../constants';
import { ENEMIES_DB, ITEMS_DB } from '../data/gameData';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_STATE: GameState = {
  stats: {
    luckMultiplier: 1.0,
    clickPower: 1,
    autoClickPower: 0,
    energy: 100,
    maxEnergy: 100,
    energyRegen: 1,
  },
  wallet: {
    coins: 0,
    gems: 0,
    divineDust: 0,
    candy: 0
  },
  inventory: [],
  equippedWeaponId: null,
  activeEventId: null,
  activeZone: 'void',
  pityCounters: {
    [Rarity.RARE]: 0,
    [Rarity.LEGENDARY]: 0,
    [Rarity.MYTHIC]: 0,
  },
  totalRolls: 0,
  activeEnemy: { ...ENEMIES_DB[0] }, // Clone to prevent mutation of DB
  bossLevel: 1,
  unlockedSecrets: [],
  upgrades: {
    'click_power': 1,
    'max_energy': 1,
    'energy_regen': 1,
    'luck_boost': 1
  },
  questProgress: {},
  claimedQuests: [],
  lastTick: Date.now(),
};

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useGameEngine = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('fate_walker_save_v4');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            const migratedInventory = (parsed.inventory || []).map((i: any) => ({
                ...i,
                count: i.count || 1
            }));
            
            return { 
                ...INITIAL_STATE, 
                ...parsed, 
                inventory: migratedInventory,
                stats: { ...INITIAL_STATE.stats, ...parsed.stats },
                wallet: { ...INITIAL_STATE.wallet, ...parsed.wallet, candy: parsed.wallet.candy || 0 },
                activeZone: parsed.activeZone || 'void',
                questProgress: parsed.questProgress || {},
                claimedQuests: parsed.claimedQuests || []
            };
        } catch (e) {
            return INITIAL_STATE;
        }
    }
    return INITIAL_STATE;
  });

  const [cinematicItem, setCinematicItem] = useState<InventoryItem | null>(null);
  const [forgedItemResult, setForgedItemResult] = useState<{item: InventoryItem, status: 'success' | 'broken'} | null>(null); 
  const [selectedForgeId, setSelectedForgeId] = useState<string | null>(null);
  const [lastItemObtained, setLastItemObtained] = useState<InventoryItem | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isForging, setIsForging] = useState(false); 
  const [messages, setMessages] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [shakeScreen, setShakeScreen] = useState(false);

  // OPTIMIZED AUTO-SAVE: Save periodically instead of on every render
  const gameStateRef = useRef(gameState);
  useEffect(() => {
      gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
        localStorage.setItem('fate_walker_save_v4', JSON.stringify(gameStateRef.current));
    }, 5000); // Save every 5 seconds

    const handleBeforeUnload = () => {
        localStorage.setItem('fate_walker_save_v4', JSON.stringify(gameStateRef.current));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
        clearInterval(saveInterval);
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // --- CHAT SIMULATION ---
  useEffect(() => {
      const chatInterval = setInterval(() => {
          if (Math.random() > 0.3) return; 

          const isSystem = Math.random() > 0.9;
          let text = "";
          let sender = "";
          let rarity: Rarity | undefined = undefined;

          if (isSystem) {
              sender = "SYSTEM";
              const rareItems = [Rarity.LEGENDARY, Rarity.MYTHIC];
              const r = rareItems[Math.floor(Math.random() * rareItems.length)];
              rarity = r;
              text = `Player ${BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)]} found [${r} Artifact]!`;
          } else {
              sender = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
              text = CHAT_TEMPLATES[Math.floor(Math.random() * CHAT_TEMPLATES.length)];
          }

          const msg: ChatMessage = {
              id: generateId(),
              sender,
              text,
              isSystem,
              rarity,
              timestamp: Date.now()
          };

          setChatHistory(prev => [msg, ...prev].slice(0, 50));
      }, 5000);

      return () => clearInterval(chatInterval);
  }, []);

  const sendChatMessage = (text: string) => {
      const msg: ChatMessage = {
          id: generateId(),
          sender: "YOU",
          text,
          timestamp: Date.now()
      };
      setChatHistory(prev => [msg, ...prev].slice(0, 50));
  };

  const activeEvent = useMemo(() => {
      if (gameState.activeEventId && EVENTS[gameState.activeEventId]) {
          return EVENTS[gameState.activeEventId];
      }
      return null;
  }, [gameState.activeEventId]);

  // Derived Stats
  const derivedStats = useMemo(() => {
    let weaponPower = 0;
    let weaponName = "Fists";

    if (gameState.equippedWeaponId) {
        const equipped = gameState.inventory.find(i => i.uuid === gameState.equippedWeaponId);
        if (equipped) {
            weaponPower = equipped.power;
            weaponName = equipped.name;
            if (equipped.upgradeLevel > 0) {
                weaponName += ` +${equipped.upgradeLevel}`;
            }
        }
    }

    const auras = gameState.inventory.filter(i => i.type === ItemType.AURA);
    let auraLuck = auras.reduce((acc, i) => acc + (0.05 * (i.count || 1)), 0); 

    let eventLuck = 0;
    if (activeEvent) {
        eventLuck = activeEvent.luckBonus;
    }

    return {
        totalDamage: gameState.stats.clickPower + weaponPower,
        totalLuck: gameState.stats.luckMultiplier + auraLuck + eventLuck,
        weaponName
    };
  }, [gameState.inventory, gameState.stats, gameState.equippedWeaponId, activeEvent]);

  // Game Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const now = Date.now();
        let newEnergy = prev.stats.energy;
        if (newEnergy < prev.stats.maxEnergy) {
            newEnergy = Math.min(prev.stats.maxEnergy, newEnergy + (prev.stats.energyRegen * 0.5));
        }
        return {
          ...prev,
          stats: { ...prev.stats, energy: newEnergy },
          lastTick: now
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addMessage = useCallback((msg: string) => {
    setMessages(prev => [msg, ...prev].slice(0, 6));
  }, []);

  const triggerShake = () => {
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 500);
  };

  const updateQuestProgress = (type: 'roll' | 'kill_boss' | 'forge', amount = 1) => {
      setGameState(prev => {
          const newProgress = { ...prev.questProgress };
          QUESTS_DB.filter(q => q.type === type).forEach(q => {
              if (!prev.claimedQuests.includes(q.id)) {
                  newProgress[q.id] = (newProgress[q.id] || 0) + amount;
              }
          });
          return { ...prev, questProgress: newProgress };
      });
  };

  const claimQuest = (questId: string) => {
      const quest = QUESTS_DB.find(q => q.id === questId);
      if (!quest) return;
      
      const current = gameState.questProgress[questId] || 0;
      if (current < quest.target) return;
      if (gameState.claimedQuests.includes(questId)) return;

      setGameState(prev => ({
          ...prev,
          wallet: {
              ...prev.wallet,
              coins: prev.wallet.coins + quest.reward.coins,
              gems: prev.wallet.gems + quest.reward.gems
          },
          claimedQuests: [...prev.claimedQuests, questId]
      }));
      addMessage(`🏆 Quest Complete: ${quest.description}`);
  };

  const performRoll = useCallback(() => {
    if (gameState.stats.energy < ROLL_COST) {
      addMessage("⚠️ Yetersiz Enerji!");
      return;
    }
    
    if (isRolling || cinematicItem || isForging) return; 

    setIsRolling(true);
    
    setGameState(prev => ({
        ...prev,
        stats: { ...prev.stats, energy: prev.stats.energy - ROLL_COST },
    }));

    setTimeout(() => {
      let luck = derivedStats.totalLuck;
      const result = RngService.roll(luck, gameState.pityCounters);
      
      const baseItem: InventoryItem = {
        ...result.item,
        uuid: generateId(),
        upgradeLevel: 0,
        obtainedAt: Date.now(),
        count: 1
      };

      setCinematicItem(baseItem); 
      
      sendToDiscord(baseItem, 'Summon');
      
      setGameState(prev => {
        const newPity = { ...prev.pityCounters };
        newPity[Rarity.RARE] = (newPity[Rarity.RARE] || 0) + 1;
        newPity[Rarity.LEGENDARY] = (newPity[Rarity.LEGENDARY] || 0) + 1;
        newPity[Rarity.MYTHIC] = (newPity[Rarity.MYTHIC] || 0) + 1;

        if (result.pityReset === Rarity.MYTHIC) newPity[Rarity.MYTHIC] = 0;
        if (result.pityReset === Rarity.LEGENDARY) newPity[Rarity.LEGENDARY] = 0;
        if (result.pityReset === Rarity.RARE) newPity[Rarity.RARE] = 0;

        if (baseItem.rarity === Rarity.MYTHIC) newPity[Rarity.MYTHIC] = 0;
        if (baseItem.rarity === Rarity.LEGENDARY) newPity[Rarity.LEGENDARY] = 0;

        const existingItemIndex = prev.inventory.findIndex(i => i.id === baseItem.id);
        let newInventory = [...prev.inventory];

        if (existingItemIndex >= 0) {
            const existing = newInventory[existingItemIndex];
            newInventory[existingItemIndex] = {
                ...existing,
                count: (existing.count || 1) + 1,
                obtainedAt: Date.now()
            };
        } else {
            newInventory.push(baseItem);
        }

        return {
          ...prev,
          inventory: newInventory,
          pityCounters: newPity,
          totalRolls: prev.totalRolls + 1
        };
      });
      
      updateQuestProgress('roll');
      setIsRolling(false);
    }, 800); 
  }, [gameState, isRolling, cinematicItem, isForging, derivedStats.totalLuck, addMessage]);

  const performTrickOrTreat = useCallback(() => {
      if (gameState.wallet.candy < 50) {
          addMessage("🍬 Not enough Candy! Need 50.");
          return;
      }
      if (isRolling || cinematicItem) return;

      setIsRolling(true);
      setGameState(prev => ({
          ...prev,
          wallet: { ...prev.wallet, candy: prev.wallet.candy - 50 }
      }));

      setTimeout(() => {
          const eventItems = ITEMS_DB.filter(i => i.isEventItem);
          const totalWeight = eventItems.reduce((acc, item) => acc + item.baseChance, 0);
          let randomValue = Math.random() * totalWeight;
          
          let selectedItem = eventItems[0];
          for (const item of eventItems) {
              randomValue -= item.baseChance;
              if (randomValue <= 0) {
                  selectedItem = item;
                  break;
              }
          }
          
          const baseItem: InventoryItem = {
              ...selectedItem,
              uuid: generateId(),
              upgradeLevel: 0,
              obtainedAt: Date.now(),
              count: 1
          };

          setCinematicItem(baseItem);
          sendToDiscord(baseItem, 'Event');
          
          setGameState(prev => {
            const existingItemIndex = prev.inventory.findIndex(i => i.id === baseItem.id);
            let newInventory = [...prev.inventory];
            if (existingItemIndex >= 0) {
                const existing = newInventory[existingItemIndex];
                newInventory[existingItemIndex] = {
                    ...existing,
                    count: (existing.count || 1) + 1
                };
            } else {
                newInventory.push(baseItem);
            }
            return { ...prev, inventory: newInventory };
          });
          setIsRolling(false);
      }, 1000);
  }, [gameState.wallet.candy, isRolling, cinematicItem, addMessage]);

  const enterHauntedRealm = () => {
      const ghost = ENEMIES_DB.find(e => e.id === 'spooky_ghost');
      if (ghost) {
          setGameState(prev => ({
              ...prev,
              activeZone: 'haunted',
              activeEnemy: { ...ghost }
          }));
          addMessage("👻 Entered the Haunted Realm!");
      }
  };

  const exitHauntedRealm = () => {
      const slime = ENEMIES_DB.find(e => e.id === 'void_slime');
      if (slime) {
          setGameState(prev => ({
              ...prev,
              activeZone: 'void',
              activeEnemy: { ...slime, level: prev.bossLevel }
          }));
          addMessage("🌌 Returned to Void.");
      }
  };

  const resolveCinematic = () => {
      if (!cinematicItem) return;
      setLastItemObtained(cinematicItem);
      addMessage(`Gacha: [${cinematicItem.rarity}] ${cinematicItem.name}`);
      
      if ([Rarity.MYTHIC, Rarity.DIVINE, Rarity.EXOTIC, Rarity.LEGENDARY].includes(cinematicItem.rarity)) {
          triggerShake();
          const msg: ChatMessage = {
              id: generateId(),
              sender: "SYSTEM",
              text: `YOU found [${cinematicItem.name}]!`,
              isSystem: true,
              rarity: cinematicItem.rarity,
              timestamp: Date.now()
          };
          setChatHistory(prev => [msg, ...prev].slice(0, 50));
      }
      setCinematicItem(null);
  };

  const resolveForge = () => setForgedItemResult(null);

  const equipItem = (uuid: string) => {
      const item = gameState.inventory.find(i => i.uuid === uuid);
      if (item && item.type === ItemType.WEAPON) {
          setGameState(prev => ({
              ...prev,
              equippedWeaponId: uuid
          }));
          addMessage(`⚔️ Kuşanıldı: ${item.name}`);
      }
  };

  const sellItem = (uuid: string) => {
    const itemIndex = gameState.inventory.findIndex(i => i.uuid === uuid);
    if (itemIndex === -1) return;
    const item = gameState.inventory[itemIndex];
    if (uuid === gameState.equippedWeaponId && item.count <= 1) {
        addMessage("⚠️ Kuşanılan eşya satılamaz!");
        return;
    }
    setGameState(prev => {
        const newInv = [...prev.inventory];
        const currentItem = newInv[itemIndex];
        if (currentItem.count > 1) {
            newInv[itemIndex] = { ...currentItem, count: currentItem.count - 1 };
            addMessage(`💰 Satıldı: ${currentItem.name} (x1) (+${currentItem.sellValue} G)`);
        } else {
            newInv.splice(itemIndex, 1);
            addMessage(`💰 Satıldı: ${currentItem.name} (+${currentItem.sellValue} G)`);
        }
        return {
            ...prev,
            inventory: newInv,
            wallet: { ...prev.wallet, coins: prev.wallet.coins + item.sellValue }
        };
    });
  };

  const selectForgeItem = (uuid: string) => setSelectedForgeId(uuid);

  const attemptUpgrade = () => {
      if (isForging || !selectedForgeId) return;
      const itemIndex = gameState.inventory.findIndex(i => i.uuid === selectedForgeId);
      if (itemIndex === -1) return;
      const item = gameState.inventory[itemIndex];
      const currentLevel = item.upgradeLevel || 0;
      const successRate = UPGRADE_RATES[Math.min(currentLevel, UPGRADE_RATES.length - 1)];
      const cost = UPGRADE_COSTS[Math.min(currentLevel, UPGRADE_COSTS.length - 1)];

      if (gameState.wallet.coins < cost) {
          addMessage(`⚠️ Yetersiz Para! (Gereken: ${cost} G)`);
          return;
      }
      const material = gameState.inventory.find(i => i.id === 'blacksmith_stone');
      if (!material || material.count < 1) {
          addMessage("⚠️ Yetersiz Malzeme! (Gereken: Demirci Taşı)");
          return;
      }

      setIsForging(true);

      setTimeout(() => {
          const roll = Math.random() * 100;
          const isSuccess = roll <= successRate;

          if (isSuccess) {
              const newItem = {
                  ...item,
                  upgradeLevel: currentLevel + 1,
                  power: Math.floor(item.power * 1.2) 
              };
              setForgedItemResult({ item: newItem, status: 'success' });
              sendToDiscord(newItem, 'Forge');
              setGameState(prev => {
                   const newInv = [...prev.inventory];
                   const stoneIndex = newInv.findIndex(i => i.id === 'blacksmith_stone');
                   if (newInv[stoneIndex].count > 1) {
                       newInv[stoneIndex] = { ...newInv[stoneIndex], count: newInv[stoneIndex].count - 1 };
                   } else {
                       newInv.splice(stoneIndex, 1);
                   }
                   const newWallet = { ...prev.wallet, coins: prev.wallet.coins - cost };
                   if (item.count > 1) {
                       newInv[itemIndex] = { ...item, count: item.count - 1 };
                       newInv.push({ ...newItem, uuid: generateId(), count: 1 });
                   } else {
                       newInv[itemIndex] = newItem;
                   }
                   return { ...prev, inventory: newInv, wallet: newWallet };
              });
              addMessage(`🔨 Upgrade Başarılı! ${item.name} +${currentLevel + 1}`);
          } else {
              setForgedItemResult({ item: item, status: 'broken' });
              setGameState(prev => {
                   const newInv = [...prev.inventory];
                   const stoneIndex = newInv.findIndex(i => i.id === 'blacksmith_stone');
                   if (newInv[stoneIndex].count > 1) {
                       newInv[stoneIndex] = { ...newInv[stoneIndex], count: newInv[stoneIndex].count - 1 };
                   } else {
                       newInv.splice(stoneIndex, 1);
                   }
                   const newWallet = { ...prev.wallet, coins: prev.wallet.coins - cost };
                   if (item.count > 1) {
                       newInv[itemIndex] = { ...item, count: item.count - 1 };
                   } else {
                       newInv.splice(itemIndex, 1);
                       if (prev.equippedWeaponId === item.uuid) {
                           return { ...prev, inventory: newInv, wallet: newWallet, equippedWeaponId: null };
                       }
                   }
                   return { ...prev, inventory: newInv, wallet: newWallet };
              });
              addMessage(`💔 Upgrade Başarısız! Eşya Kırıldı.`);
          }
          setIsForging(false);
          updateQuestProgress('forge');
          setSelectedForgeId(null);
      }, 3000);
  };

  const attackBoss = () => {
      if (!gameState.activeEnemy) return;
      setGameState(prev => {
          let newHp = prev.activeEnemy.hp - derivedStats.totalDamage;
          let newWallet = { ...prev.wallet };
          let newEnemy = { ...prev.activeEnemy };
          let bossLevel = prev.bossLevel;
          let msg = "";
          let killed = false;

          if (newHp <= 0) {
              newHp = 0;
              killed = true;
              if (prev.activeZone === 'haunted') {
                   const candyEarned = Math.floor(Math.random() * 10) + 5;
                   newWallet.candy = (newWallet.candy || 0) + candyEarned;
                   msg = `🎃 Spirit Vanquished! +${candyEarned} Candy Corn`;
                   newEnemy.hp = newEnemy.maxHp;
              } else {
                   const gemsEarned = Math.max(1, Math.floor(prev.activeEnemy.level / 2));
                   const coinsEarned = prev.activeEnemy.level * 50;
                   newWallet.gems += gemsEarned;
                   newWallet.coins += coinsEarned;
                   bossLevel += 1;
                   newEnemy.hp = Math.floor(prev.activeEnemy.maxHp * 1.5);
                   newEnemy.maxHp = newEnemy.hp;
                   newEnemy.level = bossLevel;
                   newEnemy.damage = Math.floor(prev.activeEnemy.damage * 1.2);
                   msg = `💀 Boss Öldü! +${gemsEarned} Gem, +${coinsEarned} G`;
              }
          } else {
              newEnemy.hp = newHp;
          }
          if (msg) addMessage(msg);
          if (killed) setTimeout(() => updateQuestProgress('kill_boss'), 0);
          return { ...prev, activeEnemy: newEnemy, wallet: newWallet, bossLevel: bossLevel };
      });
  };

  const buyUpgrade = (upgradeId: string) => {
      const upgradeDef = UPGRADES.find(u => u.id === upgradeId);
      if (!upgradeDef) return;
      const currentLevel = gameState.upgrades[upgradeId] || 1;
      const cost = Math.floor(upgradeDef.baseCost * Math.pow(upgradeDef.costMultiplier, currentLevel - 1));
      
      if (upgradeDef.currency === 'coins' && gameState.wallet.coins < cost) {
          addMessage("Yetersiz Altın!");
          return;
      }
      if (upgradeDef.currency === 'gems' && gameState.wallet.gems < cost) {
          addMessage("Yetersiz Gem!");
          return;
      }

      setGameState(prev => {
          const newWallet = { ...prev.wallet };
          const newStats = { ...prev.stats };
          if (upgradeDef.currency === 'coins') newWallet.coins -= cost;
          if (upgradeDef.currency === 'gems') newWallet.gems -= cost;
          if (upgradeDef.type === 'click') newStats.clickPower += 2;
          if (upgradeDef.type === 'energy') newStats.maxEnergy += 20;
          if (upgradeDef.type === 'regen') newStats.energyRegen += 0.5;
          if (upgradeDef.type === 'luck') newStats.luckMultiplier += 0.1;
          return {
              ...prev,
              wallet: newWallet,
              stats: newStats,
              upgrades: { ...prev.upgrades, [upgradeId]: currentLevel + 1 }
          };
      });
      addMessage(`⬆️ Yükseltme: ${upgradeDef.name} (Lv.${currentLevel + 1})`);
  };

  const manualCharge = () => {
     setGameState(prev => ({
         ...prev,
         stats: { ...prev.stats, energy: Math.min(prev.stats.maxEnergy, prev.stats.energy + 5) }
     }));
  };

  const unlockSecret = (secretId: string) => {
      if (!gameState.unlockedSecrets.includes(secretId)) {
          setGameState(prev => ({
              ...prev,
              unlockedSecrets: [...prev.unlockedSecrets, secretId],
              wallet: { ...prev.wallet, gems: prev.wallet.gems + 10 }
          }));
          addMessage("👁️ GİZLİ ODA BULUNDU: +10 GEM");
          triggerShake();
      }
  };

  const toggleEvent = (eventId: string) => {
      setGameState(prev => ({
          ...prev,
          activeEventId: prev.activeEventId === eventId ? null : eventId,
          activeZone: 'void'
      }));
      addMessage(`🎃 Event ${gameState.activeEventId === eventId ? 'Deaktif' : 'Aktif'}`);
  }

  return {
    gameState,
    isRolling,
    isForging,
    cinematicItem,
    forgedItemResult,
    resolveCinematic,
    resolveForge,
    selectedForgeId,
    lastItemObtained,
    messages,
    shakeScreen,
    derivedStats,
    activeEvent,
    chatHistory,
    performRoll,
    performTrickOrTreat,
    sellItem,
    equipItem,
    selectForgeItem,
    attemptUpgrade,
    claimQuest,
    sendChatMessage,
    manualCharge,
    attackBoss,
    buyUpgrade,
    unlockSecret,
    toggleEvent,
    enterHauntedRealm,
    exitHauntedRealm
  };
};