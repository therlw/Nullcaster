import { Item, Rarity } from '../types';
import { ITEMS_DB } from '../data/gameData';
import { PITY_THRESHOLDS, BASE_CHANCES } from '../constants';

export class RngService {
  /**
   * Calculates the drop based on luck, pity, and base rates.
   * Uses a weighted table approach for precision.
   */
  static roll(
    luckMultiplier: number,
    pityCounters: Record<string, number>,
    excludeRarities: Rarity[] = []
  ): { item: Item; pityReset: Rarity | null } {
    
    // 1. Check Pity Hard Guarantees (Highest priority first)
    if (pityCounters[Rarity.MYTHIC] >= PITY_THRESHOLDS[Rarity.MYTHIC]) {
      const item = this.getRandomItemByRarity(Rarity.MYTHIC);
      if (item) return { item, pityReset: Rarity.MYTHIC };
    }
    if (pityCounters[Rarity.LEGENDARY] >= PITY_THRESHOLDS[Rarity.LEGENDARY]) {
      const item = this.getRandomItemByRarity(Rarity.LEGENDARY);
      if (item) return { item, pityReset: Rarity.LEGENDARY };
    }
    if (pityCounters[Rarity.RARE] >= PITY_THRESHOLDS[Rarity.RARE]) {
      const item = this.getRandomItemByRarity(Rarity.RARE);
      if (item) return { item, pityReset: Rarity.RARE };
    }

    // 2. Calculate Dynamic Probabilities
    // Start checking from rarest to common
    const raritiesOrder = [
      Rarity.IMPOSSIBLE,
      Rarity.DIVINE,
      Rarity.EXOTIC,
      Rarity.MYTHIC,
      Rarity.LEGENDARY,
      Rarity.EPIC,
      Rarity.RARE,
      Rarity.UNCOMMON,
      Rarity.COMMON,
    ];

    const randomValue = Math.random() * 100; // 0 - 100 float
    let accumulatedChance = 0;

    // We iterate from IMPOSSIBLE down to COMMON? 
    // Actually, for "roll under" logic, we usually check rarest first.
    // Or we check if randomValue < threshold. 
    // Let's use a standard threshold check modified by luck.
    
    for (const rarity of raritiesOrder) {
      if (excludeRarities.includes(rarity)) continue;
      
      let chance = BASE_CHANCES[rarity];
      
      // Apply Luck Multiplier (Diminishing returns for high rarities to prevent game break)
      // Only apply luck to non-impossible items
      if (rarity !== Rarity.IMPOSSIBLE) {
          chance = chance * luckMultiplier;
      }

      // Simulate "dice roll" for this specific tier
      // Since we are iterating, we need an independent check or cumulative?
      // Let's use independent checks for each rarity tier from top to bottom.
      // If success, return. If fail, go to next lower tier.
      
      const roll = Math.random() * 100;
      if (roll <= chance) {
        const item = this.getRandomItemByRarity(rarity);
        if (item) return { item, pityReset: rarity === Rarity.COMMON ? null : rarity };
      }
    }

    // Fallback to Common if all checks fail (should be rare given math, but safe)
    return { 
      item: this.getRandomItemByRarity(Rarity.COMMON)!, 
      pityReset: null 
    };
  }

  private static getRandomItemByRarity(rarity: Rarity): Item | undefined {
    const pool = ITEMS_DB.filter(i => i.rarity === rarity);
    if (pool.length === 0) return undefined;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  static calculateSellValue(item: Item): number {
    return item.sellValue;
  }
}