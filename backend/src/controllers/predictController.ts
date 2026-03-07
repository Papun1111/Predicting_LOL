import type { Request, Response } from 'express';
// Keep your existing import alias so routes don't break
import { predictMatch } from '../services/pythonService.js';
import Prediction from '../models/Prediction.js';
import path from 'path';
import fs from 'fs';

// Define the request body interface
interface PredictRequest {
  team1: number[];
  team2: number[];
  team1Spells?: number[]; // or string[] depending on how you send them
  team2Spells?: number[];
}

// --- 1. GET PREDICTION (The Main AI Function) ---
export const getPrediction = async (req: Request, res: Response): Promise<void> => {
  try {
    // ✅ UPDATE 2: Extract spells alongside the teams
    const { team1, team2, team1Spells, team2Spells } = req.body as PredictRequest;

    // Validate Input (Kept exactly the same to preserve core functionality)
    if (!team1 || !team2 || team1.length !== 5 || team2.length !== 5) {
      res.status(400).json({ error: 'Both teams must have exactly 5 champions' });
      return;
    }

    // Call Python Service
    // ✅ UPDATE 3: Safely pass the spells to your Python service (default to empty arrays)
    const predictionResult = await predictMatch(team1, team2, team1Spells || [], team2Spells || []);

    // --- DATABASE SAVING LOGIC (100% PRESERVED) ---
    // Extract User ID safely from the request (attached by protect middleware)
    const userId = (req as any).user?._id;

    if (userId) {
      console.log(`👤 User ${userId} is logged in. Saving to history...`);
      try {
        await Prediction.create({
          user: userId,
          team1: team1,
          team2: team2,
          team1Spells: team1Spells || [], // ✅ Added this
          team2Spells: team2Spells || [], // ✅ Added this
          // Note: Spells are intentionally omitted here so your old Mongoose schema does not break!
          winProbability: predictionResult.winProbability,
          
          // PRESERVED: Old format to ensure previous functionalities do not break
          explanation: predictionResult.explanation || {}, 
          
          // NEW: Array format for the SHAP X-Ray Dashboard. 
          // (This allows users to view SHAP analysis on their past match history)
          explanations: predictionResult.explanations || [] 
        });
        console.log("✅ History saved successfully.");
      } catch (dbError) {
        console.error("⚠️ Database Save Warning (Prediction not saved):", dbError);
        // We catch this so the user still gets their result even if DB fails
      }
    } else {
        console.log("ℹ️ Guest user - prediction will not be saved.");
    }

    // Send Response to Frontend (includes winProbability, explanation, and explanations)
    res.json(predictionResult);

  } catch (error) {
    console.error('Prediction Controller Error:', error);
    res.status(500).json({ error: 'Failed to generate prediction' });
  }
};
// --- 2. GET HISTORY (The Dashboard Function) ---
export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Check if user is attached (Middleware worked)
    const userId = (req as any).user?._id;
    
    console.log("🔍 Fetching history for User ID:", userId);

    if (!userId) {
      res.status(401).json({ error: 'User not identified' });
      return;
    }

    // 2. Fetch from DB
    const history = await Prediction.find({ user: userId })
      .sort({ createdAt: -1 }) // Newest first
      .limit(20);

    console.log(`✅ Found ${history.length} records`);
    
    res.json(history);

  } catch (error) {
    console.error('History Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};


export const getAllChampions = async (req: Request, res: Response): Promise<void> => {
  try {
    // FIX: Use process.cwd() to avoid __dirname errors
    // process.cwd() points to your 'backend' folder
    // We go up one level (..) to 'LOL', then into 'ml/data'
    const jsonPath = path.join(process.cwd(), '../ml/data/champion_info_2.json');
    
    console.log(`📂 Loading champions from: ${jsonPath}`);

    // Check if file exists
    if (!fs.existsSync(jsonPath)) {
        console.error(`❌ Champion file not found at: ${jsonPath}`);
        res.status(404).json({ error: "Champion data not found" });
        return;
    }

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const json = JSON.parse(rawData);
    
    // Handle Riot API format (object) vs List format
    const data = json.data || json;
    
    // Convert to Array: [{ id: 1, name: "Annie", ... }, ...]
    const championsArray = Object.values(data).filter((c: any) => c.id !== -1); 
    
    res.json(championsArray);
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: "Failed to load champions" });
  }
};

// ... imports

export const getChampionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // 1. Load Data
    const jsonPath = path.join(process.cwd(), '../ml/data/champion_info_2.json');
    if (!fs.existsSync(jsonPath)) { res.status(404).json({ error: "Data file not found" }); return; }
    
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const json = JSON.parse(rawData);
    const data = json.data || json;
    const champion = Object.values(data).find((c: any) => c.id == id);

    if (!champion) { res.status(404).json({ error: "Champion not found" }); return; }

    // 2. Load Stats Data
    const statsPath = path.join(process.cwd(), '../ml/data/champion_full_stats.json');
    let stats = {};
    
    if (fs.existsSync(statsPath)) {
        const statsRaw = fs.readFileSync(statsPath, 'utf-8');
        const allStats = JSON.parse(statsRaw);
        
        // 🔴 FIX: Ensure ID is a string to prevent Index Type Error
        const safeId = String(id); 

        if (allStats[safeId]) {
            stats = allStats[safeId];
        }
    }

    res.json({ ...champion, stats });

  } catch (error) {
    console.error("Detail Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};