
import { Item, ItemType, Rarity, Enemy } from '../types';
import { BASE_CHANCES } from '../constants';

export const ITEMS_DB: Item[] = [
  // Materials
  { id: 'blacksmith_stone', name: 'Demirci Taşı', rarity: Rarity.UNCOMMON, baseChance: 15, power: 0, type: ItemType.CATALYST, description: 'Used to upgrade legendary items.', sellValue: 10 },
  { id: 'magic_ore', name: 'Büyülü Cevher', rarity: Rarity.RARE, baseChance: 5, power: 0, type: ItemType.CATALYST, description: 'Enhances upgrade chances.', sellValue: 50 },

  // Common
  { id: 'rusty_sword', name: 'Paslı Kılıç', rarity: Rarity.COMMON, baseChance: BASE_CHANCES.Common, power: 1, type: ItemType.WEAPON, sellValue: 1 },
  { id: 'old_coin', name: 'Eski Para', rarity: Rarity.COMMON, baseChance: BASE_CHANCES.Common, power: 0, type: ItemType.CATALYST, sellValue: 1 },
  
  // Uncommon
  { id: 'iron_dagger', name: 'Demir Hançer', rarity: Rarity.UNCOMMON, baseChance: BASE_CHANCES.Uncommon, power: 3, type: ItemType.WEAPON, sellValue: 5 },
  { id: 'lucky_clover', name: 'Şans Yoncası', rarity: Rarity.UNCOMMON, baseChance: BASE_CHANCES.Uncommon, power: 0, type: ItemType.CHARM, specialEffect: '+2% Luck', sellValue: 5 },

  // Rare
  { id: 'sapphire_wand', name: 'Safir Asa', rarity: Rarity.RARE, baseChance: BASE_CHANCES.Rare, power: 10, type: ItemType.WEAPON, sellValue: 25 },
  { id: 'blue_aura', name: 'Mavi Alev', rarity: Rarity.RARE, baseChance: BASE_CHANCES.Rare, power: 0, type: ItemType.AURA, specialEffect: '+5% Luck', sellValue: 30 },

  // Epic
  { id: 'shadow_blade', name: 'Gölge Bıçağı', rarity: Rarity.EPIC, baseChance: BASE_CHANCES.Epic, power: 35, type: ItemType.WEAPON, sellValue: 100 },
  { id: 'void_stone', name: 'Boşluk Taşı', rarity: Rarity.EPIC, baseChance: BASE_CHANCES.Epic, power: 0, type: ItemType.CATALYST, specialEffect: 'Auto-roll speed up', sellValue: 120 },

  // Legendary
  { id: 'midas_hand', name: 'Midas\'ın Eli', rarity: Rarity.LEGENDARY, baseChance: BASE_CHANCES.Legendary, power: 100, type: ItemType.WEAPON, specialEffect: 'Gold x2', sellValue: 1000 },
  { id: 'fate_key', name: 'Kader Anahtarı', rarity: Rarity.LEGENDARY, baseChance: BASE_CHANCES.Legendary, power: 0, type: ItemType.KEY, specialEffect: 'Unlocks Boss Room', sellValue: 2000 },

  // Mythic
  { id: 'blood_moon_scythe', name: 'Kanlı Ay Tırpanı', rarity: Rarity.MYTHIC, baseChance: BASE_CHANCES.Mythic, power: 500, type: ItemType.WEAPON, specialEffect: 'Life Steal', sellValue: 10000 },
  
  // Exotic
  { id: 'neon_katana', name: 'Neon Katana', rarity: Rarity.EXOTIC, baseChance: BASE_CHANCES.Exotic, power: 1200, type: ItemType.WEAPON, description: 'Gelecekten gelen bir hata.', sellValue: 50000 },

  // Divine
  { id: 'zeus_bolt', name: 'Yıldırım', rarity: Rarity.DIVINE, baseChance: BASE_CHANCES.Divine, power: 5000, type: ItemType.WEAPON, specialEffect: 'Insta-kill non-bosses', sellValue: 200000 },

  // Impossible
  { id: 'developer_error', name: 'NULL_REFERENCE', rarity: Rarity.IMPOSSIBLE, baseChance: BASE_CHANCES.Impossible, power: 99999, type: ItemType.WEAPON, description: 'Bu eşya var olmamalıydı.', sellValue: 0, isSecret: true },

  // --- HALLOWEEN EVENT ITEMS (REBALANCED HARDER) ---
  { id: 'rotten_candy', name: 'Çürük Şeker', rarity: Rarity.COMMON, baseChance: 70, power: 0, type: ItemType.CHARM, description: 'Iyy, yenmez bu.', sellValue: 1, isEventItem: true },
  { id: 'pumpkin_bomb', name: 'Balkabağı Bombası', rarity: Rarity.RARE, baseChance: 20, power: 25, type: ItemType.WEAPON, description: 'Patlayan sürpriz.', sellValue: 50, isEventItem: true },
  { id: 'ghost_cloak', name: 'Hayalet Pelerini', rarity: Rarity.EPIC, baseChance: 8, power: 0, type: ItemType.AURA, specialEffect: 'Dodge +10%', sellValue: 200, isEventItem: true },
  { id: 'witch_broom', name: 'Cadı Süpürgesi', rarity: Rarity.LEGENDARY, baseChance: 1.9, power: 150, type: ItemType.WEAPON, description: 'Uçarak kes.', sellValue: 1500, isEventItem: true },
  { id: 'headless_blade', name: 'Başsız Süvari Kılıcı', rarity: Rarity.MYTHIC, baseChance: 0.1, power: 888, type: ItemType.WEAPON, description: 'Lanetli ve ölümcül.', sellValue: 6666, isEventItem: true },
];

export const ENEMIES_DB: Enemy[] = [
  // Void Enemies
  { id: 'void_slime', name: 'Boşluk Balçığı', level: 1, hp: 50, maxHp: 50, damage: 2, isBoss: false, description: 'Zayıf bir varlık.', dropTableId: 'basic' },
  { id: 'cursed_knight', name: 'Lanetli Şövalye', level: 10, hp: 500, maxHp: 500, damage: 15, isBoss: false, description: 'Eski bir koruyucu.', dropTableId: 'mid' },
  
  // Bosses
  { id: 'fate_weaver', name: 'Kader Ören', level: 50, hp: 10000, maxHp: 10000, damage: 100, isBoss: true, description: 'RNG Warp Field aktif: Şansınız manipüle ediliyor.', dropTableId: 'boss_1' },
  { id: 'glitch_god', name: '?? ERROR ??', level: 999, hp: 1000000, maxHp: 1000000, damage: 9999, isBoss: true, description: 'Sistem çöküyor...', dropTableId: 'boss_secret' },

  // Halloween Enemies (BUFFED)
  // Spooky Ghost is now a tanky mob to make farming candy harder
  { id: 'spooky_ghost', name: 'Balkabağı Kralı', level: 66, hp: 15000, maxHp: 15000, damage: 50, isBoss: true, description: 'Perili Alemin Hükümdarı.', dropTableId: 'halloween_mob' },
  { id: 'pumpkin_king', name: 'Kadim Kabus', level: 100, hp: 100000, maxHp: 100000, damage: 500, isBoss: true, description: 'Şekerlerin efendisi.', dropTableId: 'halloween_boss' }
];
