import mongoose from 'mongoose';
const predictionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // The drafted champions
    team1: [{ type: Number, required: true }],
    team2: [{ type: Number, required: true }],
    // ✅ NEW: The drafted summoner spells (Optional, hence no 'required: true')
    team1Spells: [{ type: Number }],
    team2Spells: [{ type: Number }],
    winProbability: { type: Number, required: true },
    // Your old explanation object (preserved for backward compatibility)
    explanation: { type: Object, default: {} },
    // The new SHAP X-Ray array format
    explanations: [{
            factor: { type: String },
            impact: { type: Number }
        }],
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Prediction', predictionSchema);
//# sourceMappingURL=Prediction.js.map