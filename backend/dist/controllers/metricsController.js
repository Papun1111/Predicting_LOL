import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// 1. Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const getModelMetrics = async (req, res) => {
    try {
        // Navigate from: backend/dist/controllers -> backend/dist -> backend -> Root -> ml/data
        const metricsPath = path.resolve(__dirname, '../../../ml/data/model_metrics.json');
        // Quick debug log to ensure the path resolves correctly on your machine
        console.log("Looking for metrics file at:", metricsPath);
        if (!fs.existsSync(metricsPath)) {
            res.status(404).json({ error: "Metrics data not found. Please run the training script first." });
            return;
        }
        const rawData = fs.readFileSync(metricsPath, 'utf-8');
        const metrics = JSON.parse(rawData);
        res.json(metrics);
    }
    catch (error) {
        console.error("Metrics Route Error:", error);
        res.status(500).json({ error: "Failed to fetch model metrics from the server." });
    }
};
//# sourceMappingURL=metricsController.js.map