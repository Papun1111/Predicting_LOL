import express from 'express';
import { getPrediction, getHistory, getAllChampions, getChampionById } from '../controllers/predictController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, predictSchema } from '../utils/validate.js';
import { getTierList } from '../controllers/tierListController.js';
import { getModelMetrics } from '../controllers/metricsController.js';
import { getSummonerSpells } from '../controllers/spellController.js';

const router = express.Router();

// POST /api/predict
// 1. Validates that 2 teams of 5 champions are sent
// 2. Calls Python script via controller
// 3. (Optional) You can add 'protect' here if only logged-in users should predict
router.post('/', validate(predictSchema),protect, getPrediction);

// GET /api/predict/history
// 1. PROTECTED: User must be logged in
// 2. Returns their past predictions
router.get('/history', protect, getHistory);
router.get('/champions', getAllChampions);
router.get('/champions/:id', getChampionById);
router.get('/tierlist', getTierList);
router.get('/metrics', getModelMetrics);
router.get('/spells', protect, getSummonerSpells);
export default router;