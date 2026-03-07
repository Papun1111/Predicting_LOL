import mongoose, { Document, Schema } from 'mongoose';

export interface IRecommendation extends Document {
  userId?: mongoose.Types.ObjectId;
  myTeam: number[];
  enemyTeam: number[];
  suggestions: Array<{
    id: number;
    name: string;
    score: number;
    roles: string[];
  }>;
  createdAt: Date;
}

const RecommendationSchema: Schema = new Schema({
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

const Recommendation=mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
export default Recommendation;