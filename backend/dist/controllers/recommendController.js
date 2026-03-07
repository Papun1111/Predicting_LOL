// Re-using the same robust script runner from before
import { recommendChamps as runPythonRec } from '../services/pythonService.js';
export const getRecommendations = async (req, res) => {
    try {
        const { myTeam, enemyTeam } = req.body;
        // Call Python
        const recommendations = await runPythonRec(myTeam || [], enemyTeam || []);
        // Ensure array format
        if (Array.isArray(recommendations)) {
            res.json(recommendations);
        }
        else {
            res.json([]);
        }
    }
    catch (error) {
        console.error('Rec Error:', error);
        res.json([]);
    }
};
//# sourceMappingURL=recommendController.js.map