import express from 'express';
import { getRecommendations } from '../controllers/recommendController.js';
import { validate, recommendSchema } from '../utils/validate.js';
const router = express.Router();
// POST /api/recommend
// 1. Validates input teams
// 2. Calls recommend.py via controller
router.post('/', validate(recommendSchema), getRecommendations);
export default router;
//# sourceMappingURL=recommendRoutes.js.map