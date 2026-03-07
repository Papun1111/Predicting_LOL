import mongoose, { Document } from 'mongoose';
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
declare const Recommendation: mongoose.Model<IRecommendation, {}, {}, {}, mongoose.Document<unknown, {}, IRecommendation, {}, mongoose.DefaultSchemaOptions> & IRecommendation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRecommendation>;
export default Recommendation;
//# sourceMappingURL=Recommendation.d.ts.map