import mongoose, { Document, Schema } from 'mongoose';
const RecommendationSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    myTeam: [{ type: Number, required: true }],
    enemyTeam: [{ type: Number, required: true }], // Can be empty if drafting first
    suggestions: [
        {
            id: Number,
            name: String,
            score: Number,
            roles: [String]
        }
    ],
    createdAt: { type: Date, default: Date.now },
});
const Recommendation = mongoose.model('Recommendation', RecommendationSchema);
export default Recommendation;
//# sourceMappingURL=Recommendation.js.map