import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const getSummonerSpells = async (req, res) => {
    try {
        const spellsPath = path.resolve(__dirname, '../../../ml/data/summoner_spell_info.json');
        if (!fs.existsSync(spellsPath)) {
            res.status(404).json({ error: "Summoner Spells data not found." });
            return;
        }
        const rawData = fs.readFileSync(spellsPath, 'utf-8');
        const parsedData = JSON.parse(rawData);
        const spellData = parsedData.data ? parsedData.data : parsedData;
        // ✅ FIX: Removed the `.image.full` requirement.
        // Instead, we construct the image URL manually using the spell's `key`.
        // We also filter out unplayable game modes to keep the UI clean.
        const spellsArray = Object.values(spellData)
            .filter((spell) => spell.name &&
            !spell.name.includes("Siege") &&
            !spell.name.includes("Disabled") &&
            !spell.name.includes("Poro"))
            .map((spell) => ({
            id: spell.id, // The numeric ID (e.g., 4 for Flash)
            name: spell.name,
            description: spell.description,
            // Riot's servers map the "key" string to the image file (e.g., SummonerFlash.png)
            image: `https://ddragon.leagueoflegends.com/cdn/14.3.1/img/spell/${spell.key}.png`
        }));
        res.json(spellsArray);
    }
    catch (error) {
        console.error("Spells Route Error:", error);
        res.status(500).json({ error: "Failed to fetch summoner spells." });
    }
};
//# sourceMappingURL=spellController.js.map