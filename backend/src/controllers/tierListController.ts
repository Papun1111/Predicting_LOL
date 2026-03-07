import type{ Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const getTierList = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Load Data
    const statsPath = path.join(process.cwd(), '../ml/data/champion_full_stats.json');
    const infoPath = path.join(process.cwd(), '../ml/data/champion_info_2.json');
    
    if (!fs.existsSync(statsPath) || !fs.existsSync(infoPath)) {
      res.status(404).json({ error: "Data files not found" });
      return;
    }

    const statsDb = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));
    const infoDb = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
    
    // Normalize Champion Info (Map ID to Name/Key)
    const champInfo: any = {};
    const rawInfo = infoDb.data || infoDb;
    const infoArray = Array.isArray(rawInfo) ? rawInfo : Object.values(rawInfo);
    
    infoArray.forEach((c: any) => {
      champInfo[c.id || c.key] = c;
    });

    // 2. Calculate OP Score for each champion
    const scoredChampions = [];

    for (const [idStr, stats] of Object.entries(statsDb)) {
      const id = parseInt(idStr);
      const cStats = stats as any;
      const info = champInfo[id];
      
      if (!info || cStats.games < 50) continue; // Skip unknown or highly unplayed

      // The OP Formula
      const wr = cStats.winRate * 100;
      const pr = cStats.pickRate * 100;
      const br = cStats.banRate * 100;

      // Base weight calculation
      // Example: 52 WR * 0.4 + 15 PR * 0.3 + 20 BR * 0.3 = 20.8 + 4.5 + 6.0 = 31.3
      const opScore = (wr * 0.4) + (pr * 0.3) + (br * 0.3);

      scoredChampions.push({
        id,
        name: info.name,
        key: info.key, // Needed for images
        winRate: wr.toFixed(1),
        pickRate: pr.toFixed(1),
        banRate: br.toFixed(1),
        opScore: parseFloat(opScore.toFixed(2)),
        tags: info.tags || []
      });
    }

    // 3. Sort by OP Score (Descending)
    scoredChampions.sort((a, b) => b.opScore - a.opScore);

    // 4. Assign Tiers based on Percentiles
    const total = scoredChampions.length;
    const tierList = scoredChampions.map((champ, index) => {
      const percentile = index / total;
      let tier = 'D';

      if (percentile <= 0.05) tier = 'S+';      // Top 5%
      else if (percentile <= 0.15) tier = 'S';  // Next 10%
      else if (percentile <= 0.35) tier = 'A';  // Next 20%
      else if (percentile <= 0.65) tier = 'B';  // Next 30%
      else if (percentile <= 0.85) tier = 'C';  // Next 20%

      return { ...champ, tier };
    });

    res.json(tierList);

  } catch (error) {
    console.error("Tier List Error:", error);
    res.status(500).json({ error: "Failed to generate tier list" });
  }
};