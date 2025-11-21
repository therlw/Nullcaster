
import { Rarity, Upgrade, GameEvent, Quest } from './types';
import { Sword, Coins, Clover, Wand2, Flame, Gem, Hand, Key, Moon, Zap, Bug, Hammer, Bomb, Ghost, Skull, Cookie, Feather, Disc, Box } from 'lucide-react';

export const RARITY_COLORS: Record<Rarity, string> = {
  [Rarity.COMMON]: 'text-gray-400 border-gray-600 shadow-gray-900',
  [Rarity.UNCOMMON]: 'text-green-400 border-green-600 shadow-green-900',
  [Rarity.RARE]: 'text-blue-400 border-blue-500 shadow-blue-900',
  [Rarity.EPIC]: 'text-purple-400 border-purple-500 shadow-purple-900',
  [Rarity.LEGENDARY]: 'text-yellow-400 border-yellow-500 shadow-yellow-900',
  [Rarity.MYTHIC]: 'text-red-500 border-red-600 shadow-red-900',
  [Rarity.EXOTIC]: 'text-pink-500 border-pink-500 shadow-pink-900',
  [Rarity.DIVINE]: 'text-cyan-300 border-cyan-400 shadow-cyan-900',
  [Rarity.IMPOSSIBLE]: 'text-white border-white shadow-black animate-glitch',
};

// Increased opacity for better contrast against dark backgrounds
export const RARITY_BG: Record<Rarity, string> = {
  [Rarity.COMMON]: 'bg-gray-800',
  [Rarity.UNCOMMON]: 'bg-green-950',
  [Rarity.RARE]: 'bg-blue-950',
  [Rarity.EPIC]: 'bg-purple-950',
  [Rarity.LEGENDARY]: 'bg-yellow-950',
  [Rarity.MYTHIC]: 'bg-red-950',
  [Rarity.EXOTIC]: 'bg-pink-950',
  [Rarity.DIVINE]: 'bg-cyan-950',
  [Rarity.IMPOSSIBLE]: 'bg-black',
};

// UNIQUE VISUAL THEMES FOR SPECIFIC ITEMS - Made more solid/opaque
export const ITEM_VISUALS: Record<string, string> = {
    'rusty_sword': 'bg-gradient-to-br from-stone-800 via-orange-950 to-stone-900 border-orange-900 shadow-orange-900/20',
    'old_coin': 'bg-gradient-to-b from-stone-700 to-stone-900 border-stone-500',
    'iron_dagger': 'bg-gradient-to-br from-slate-700 to-slate-900 border-slate-500',
    'lucky_clover': 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-900 via-emerald-950 to-black border-emerald-700 shadow-emerald-900/40',
    'sapphire_wand': 'bg-gradient-to-t from-blue-950 via-indigo-950 to-slate-900 border-blue-600',
    'blue_aura': 'bg-blue-950 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.2)]',
    'shadow_blade': 'bg-gradient-to-b from-gray-900 via-purple-950 to-black border-purple-800',
    'void_stone': 'bg-black border-purple-600 shadow-[inset_0_0_20px_rgba(168,85,247,0.2)]',
    'midas_hand': 'bg-gradient-to-br from-yellow-700 via-yellow-900 to-yellow-950 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]',
    'fate_key': 'bg-slate-900 border-yellow-500/50 shadow-yellow-500/10',
    'blood_moon_scythe': 'bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-red-950 via-black to-red-950 border-red-700 shadow-red-900/50',
    'neon_katana': 'bg-slate-950 border-pink-600 shadow-[0_0_10px_rgba(236,72,153,0.3)] bg-[linear-gradient(45deg,transparent_25%,rgba(236,72,153,0.05)_50%,transparent_75%,transparent_100%)]',
    'zeus_bolt': 'bg-gradient-to-tr from-blue-950 via-cyan-950 to-white/5 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    'developer_error': 'bg-black border-dashed border-white animate-glitch',
    'blacksmith_stone': 'bg-stone-800 border-stone-600',
    'magic_ore': 'bg-indigo-950 border-indigo-500',
    // HALLOWEEN ITEMS
    'pumpkin_bomb': 'bg-orange-950 border-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.4)]',
    'ghost_cloak': 'bg-purple-950 border-purple-400 opacity-90',
    'witch_broom': 'bg-amber-900 border-amber-700',
    'headless_blade': 'bg-black border-orange-700 shadow-red-900/50',
    'rotten_candy': 'bg-stone-900 border-stone-700 opacity-80',
};

// FULL ART CARD BACKGROUNDS (URLS)
// This allows items to have a custom TCG-style card art
export const ITEM_CARD_BACKGROUNDS: Record<string, string> = {
    // Using &sz=w1200 to force High Resolution from Google Drive
    'headless_blade': 'https://drive.google.com/thumbnail?id=1WtqHZyZJGUtJf3KMv673aKqlvxy_46ef&sz=w1200', 
    'blood_moon_scythe': 'https://images.unsplash.com/photo-1535063406194-15eb282862e6?q=80&w=1000&auto=format&fit=crop'
};

// Fallback backgrounds if no specific art is defined
export const GENERIC_MYTHIC_BACKGROUND = "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=1000&auto=format&fit=crop"; // Red/Dark Nebula
export const GENERIC_LEGENDARY_BACKGROUND = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop"; // Gold/Texture

// Hybrid Icon System: Can be a Lucide Component OR a String URL
export const ITEM_ICONS: Record<string, any> = {
    'rusty_sword': 'https://drive.google.com/thumbnail?id=1bGI4XG7QNzMJX2aq8OT4NOCc0cD19RYJ&sz=w256', // Example: External URL
    'old_coin': Coins,
    'iron_dagger': Sword,
    'lucky_clover': Clover,
    'sapphire_wand': Wand2,
    'blue_aura': Flame,
    'shadow_blade': Sword,
    'void_stone': Disc,
    'midas_hand': Hand,
    'fate_key': Key,
    'blood_moon_scythe': Moon,
    'neon_katana': Sword,
    'zeus_bolt': Zap,
    'developer_error': Bug,
    'blacksmith_stone': Hammer,
    'magic_ore': Gem,
    'rotten_candy': Cookie,
    "pumpkin_bomb": "https://drive.google.com/thumbnail?id=1K6RaFqnMTTyO2CW5QeMtC4Jm6AKUABiP&sz=w256", 
    'ghost_cloak': Ghost,
    'witch_broom': Feather,
    // Using &sz=w512 to ensure the sword icon is crisp
    'headless_blade': "https://drive.google.com/thumbnail?id=1-ufMPUQz7tSN-ObCb8AJBMz3B-XjOSMl",
};

export const RARITY_ORDER = [
  Rarity.COMMON,
  Rarity.UNCOMMON,
  Rarity.RARE,
  Rarity.EPIC,
  Rarity.LEGENDARY,
  Rarity.MYTHIC,
  Rarity.EXOTIC,
  Rarity.DIVINE,
  Rarity.IMPOSSIBLE
];

export const PITY_THRESHOLDS = {
  [Rarity.RARE]: 40,
  [Rarity.LEGENDARY]: 100,
  [Rarity.MYTHIC]: 350,
};

// Base chances in percentage
export const BASE_CHANCES: Record<Rarity, number> = {
  [Rarity.COMMON]: 65,
  [Rarity.UNCOMMON]: 20,
  [Rarity.RARE]: 10,
  [Rarity.EPIC]: 3.5,
  [Rarity.LEGENDARY]: 1,
  [Rarity.MYTHIC]: 0.3,
  [Rarity.EXOTIC]: 0.1,
  [Rarity.DIVINE]: 0.05,
  [Rarity.IMPOSSIBLE]: 0.009,
};

export const ENERGY_REGEN_RATE = 1;
export const ROLL_COST = 10;
export const MAX_INVENTORY = 50;

// Upgrade Configuration (Metin2 Style)
export const UPGRADE_RATES = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10]; // Success % for level 0->1, 1->2 ...
export const UPGRADE_COSTS = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25000, 50000]; // Coin cost

export const EVENTS: Record<string, GameEvent> = {
    HALLOWEEN: {
        id: 'hallows_eve',
        name: "Hallow's Eve",
        description: "The Haunted Realm is open. Collect Candy!",
        luckBonus: 0.20,
        themeColor: 'orange'
    }
};

export const QUESTS_DB: Quest[] = [
    { id: 'roll_50', description: 'Summon 50 Artifacts', target: 50, type: 'roll', reward: { coins: 500, gems: 10 } },
    { id: 'roll_200', description: 'Summon 200 Artifacts', target: 200, type: 'roll', reward: { coins: 2500, gems: 50 } },
    { id: 'kill_5', description: 'Defeat 5 Bosses', target: 5, type: 'kill_boss', reward: { coins: 1000, gems: 20 } },
    { id: 'kill_20', description: 'Defeat 20 Bosses', target: 20, type: 'kill_boss', reward: { coins: 5000, gems: 100 } },
    { id: 'forge_10', description: 'Forge 10 Items', target: 10, type: 'forge', reward: { coins: 1500, gems: 30 } }
];

export const UPGRADES: Upgrade[] = [
    { 
        id: 'click_power', 
        name: 'Void Strike', 
        description: 'Increase base click damage.', 
        baseCost: 50, 
        costMultiplier: 1.5, 
        level: 1, 
        type: 'click', 
        currency: 'coins' 
    },
    { 
        id: 'max_energy', 
        name: 'Spirit Vessel', 
        description: 'Increase maximum energy capacity.', 
        baseCost: 100, 
        costMultiplier: 1.4, 
        level: 1, 
        type: 'energy', 
        currency: 'coins' 
    },
    { 
        id: 'energy_regen', 
        name: 'Mana Flow', 
        description: 'Regenerate energy faster.', 
        baseCost: 250, 
        costMultiplier: 1.6, 
        level: 1, 
        type: 'regen', 
        currency: 'coins' 
    },
    { 
        id: 'luck_boost', 
        name: 'Fate Manipulation', 
        description: 'Passively increase luck multiplier.', 
        baseCost: 5, 
        costMultiplier: 2.0, 
        level: 1, 
        type: 'luck', 
        currency: 'gems' 
    }
];

export const BOT_NAMES = ["VoidSlayer", "RNG_God", "LuckLess", "FateSeeker", "ShadowHunter", "GachaKing", "NullPointer", "System32"];
export const CHAT_TEMPLATES = [
    "Anyone got a Mythic yet?",
    "This boss is too hard... HP is infinite lol",
    "Just crafted a legendary! Finally!",
    "Need more energy... regen is slow",
    "Is the pity system working guys?",
    "Hallow's Eve event is sick!",
    "Selling Common Sword 1G (scam)",
    "How do I unlock the secret room?",
    "Rolls are rigged I swear",
    "Nice aura!"
];
