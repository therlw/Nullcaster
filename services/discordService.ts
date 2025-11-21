
import { InventoryItem, Rarity } from '../types';
import { ITEM_ICONS } from '../constants';

// User provided webhook
const WEBHOOK_URL = "https://discord.com/api/webhooks/1396415678327820288/EgwuO-NwBhNrgriZy9jwx5OMsz8tgIjgKGRyb4t9nuHVtM7I_R89-YSt5ZZkXYbTEbLe";

// Decimal colors for Discord Embeds
const RARITY_COLORS_DECIMAL: Record<Rarity, number> = {
    [Rarity.COMMON]: 9807270, // Gray (#95a5a6)
    [Rarity.UNCOMMON]: 3066993, // Green (#2ecc71)
    [Rarity.RARE]: 3447003, // Blue (#3498db)
    [Rarity.EPIC]: 10181046, // Purple (#9b59b6)
    [Rarity.LEGENDARY]: 15844367, // Gold (#f1c40f)
    [Rarity.MYTHIC]: 15158332, // Red (#e74c3c)
    [Rarity.EXOTIC]: 15105570, // Pink (#e67e22)
    [Rarity.DIVINE]: 1752220, // Cyan (#1abc9c)
    [Rarity.IMPOSSIBLE]: 0 // Black (#000000)
};

// Filter: Only send these rarities
const ALLOWED_RARITIES = [
    Rarity.LEGENDARY,
    Rarity.MYTHIC,
    Rarity.EXOTIC,
    Rarity.DIVINE,
    Rarity.IMPOSSIBLE
];

export const sendToDiscord = async (item: InventoryItem, context: 'Summon' | 'Forge' | 'Event' = 'Summon') => {
    if (!WEBHOOK_URL) return;

    // FILTER: Only allow Legendary+ items
    if (!ALLOWED_RARITIES.includes(item.rarity)) {
        return;
    }

    // Attempt to get a valid image URL for the embed thumbnail
    let iconUrl = ""; 
    const iconSource = ITEM_ICONS[item.id];
    
    if (typeof iconSource === 'string') {
        // If it's a URL (like the Google Thumbnail API links we added), use it directly
        iconUrl = iconSource;
    } else {
        // Fallback for Lucide icons - use a generic generic rarity image or specific placeholder
        // For now, we leave empty or use a static asset if available
    }

    const payload = {
        username: "Fate Walker RNG",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/4081/4081553.png", // Generic Gacha Icon
        embeds: [
            {
                title: `${context === 'Forge' ? '⚒️ ITEM REFORGED!' : '✨ NEW LEGENDARY ARTIFACT!'}`,
                description: `A **${item.rarity}** artifact has been discovered!`,
                color: RARITY_COLORS_DECIMAL[item.rarity] || 0,
                fields: [
                    { name: "Item Name", value: `**${item.name}** ${item.upgradeLevel > 0 ? `+${item.upgradeLevel}` : ''}`, inline: true },
                    { name: "Power", value: item.power.toString(), inline: true },
                    { name: "Type", value: item.type, inline: true },
                    { name: "Market Value", value: `${item.sellValue} G`, inline: true }
                ],
                thumbnail: iconUrl ? { url: iconUrl } : undefined,
                footer: {
                    text: `Fate Walker: Void Chamber • ${new Date().toLocaleTimeString()}`
                }
            }
        ]
    };

    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error("Failed to send Discord webhook. Possible CORS restriction.", error);
    }
};
