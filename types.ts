
export enum Rarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
  MYTHIC = 'Mythic',
  EXOTIC = 'Exotic',
  DIVINE = 'Divine',
  IMPOSSIBLE = 'Impossible',
}

export enum ItemType {
  WEAPON = 'Weapon',
  AURA = 'Aura',
  CHARM = 'Charm',
  CATALYST = 'Catalyst',
  KEY = 'Key',
}

export interface Item {
  id: string;
  name: string;
  rarity: Rarity;
  baseChance: number; // Percentage 0-100
  power: number;
  type: ItemType;
  description?: string;
  specialEffect?: string;
  sellValue: number;
  isSecret?: boolean;
  isEventItem?: boolean; // NEW
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  damage: number;
  isBoss: boolean;
  description: string;
  dropTableId: string;
}

export interface InventoryItem extends Item {
  uuid: string; // Unique instance ID (shared across stack)
  upgradeLevel: number;
  obtainedAt: number;
  count: number; // Stack quantity
  isLocked?: boolean; // NEW: Lock status
}

export interface PlayerStats {
  luckMultiplier: number; // Base 1.0
  clickPower: number;
  autoClickPower: number;
  energy: number;
  maxEnergy: number;
  energyRegen: number;
}

export interface Wallet {
  coins: number;
  gems: number;
  divineDust: number;
  candy: number; // NEW: Event Currency
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  level: number;
  type: 'click' | 'energy' | 'luck' | 'regen';
  currency: 'coins' | 'gems' | 'divineDust';
}

export interface GameEvent {
    id: string;
    name: string;
    description: string;
    luckBonus: number;
    themeColor: string; // tailwind class suffix
}

export interface Quest {
    id: string;
    description: string;
    target: number;
    type: 'roll' | 'kill_boss' | 'forge';
    reward: { coins: number; gems: number };
}

export interface ChatMessage {
    id: string;
    sender: string;
    text: string;
    isSystem?: boolean;
    timestamp: number;
    rarity?: Rarity; // For system drops highlight
}

export interface GameState {
  stats: PlayerStats;
  wallet: Wallet;
  inventory: InventoryItem[];
  discoveredItems: string[]; // NEW: Track IDs of items ever found
  equippedWeaponId: string | null; // Manual Equip
  activeEventId: string | null; // Event System
  activeZone: 'void' | 'haunted'; // NEW: Zone System
  pityCounters: Record<string, number>; // Key is Rarity
  totalRolls: number;
  activeEnemy: Enemy;
  bossLevel: number; // Boss progression
  unlockedSecrets: string[];
  upgrades: Record<string, number>; // Upgrade ID -> Level
  questProgress: Record<string, number>; // Quest ID -> Current Count
  claimedQuests: string[]; // IDs of claimed quests
  lastTick: number;
}
