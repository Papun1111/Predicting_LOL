import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    user: mongoose.Types.ObjectId;
    team1: number[];
    team2: number[];
    team1Spells: number[];
    team2Spells: number[];
    winProbability: number;
    explanation: any;
    explanations: mongoose.Types.DocumentArray<{
        factor?: string | null;
        impact?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        factor?: string | null;
        impact?: number | null;
    }, {}, {}> & {
        factor?: string | null;
        impact?: number | null;
    }>;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    user: mongoose.Types.ObjectId;
    team1: number[];
    team2: number[];
    team1Spells: number[];
    team2Spells: number[];
    winProbability: number;
    explanation: any;
    explanations: mongoose.Types.DocumentArray<{
        factor?: string | null;
        impact?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        factor?: string | null;
        impact?: number | null;
    }, {}, {}> & {
        factor?: string | null;
        impact?: number | null;
    }>;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    createdAt: NativeDate;
    user: mongoose.Types.ObjectId;
    team1: number[];
    team2: number[];
    team1Spells: number[];
    team2Spells: number[];
    winProbability: number;
    explanation: any;
    explanations: mongoose.Types.DocumentArray<{
        factor?: string | null;
        impact?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        factor?: string | null;
        impact?: number | null;
    }, {}, {}> & {
        factor?: string | null;
        impact?: number | null;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    createdAt: NativeDate;
    user: mongoose.Types.ObjectId;
    team1: number[];
    team2: number[];
    team1Spells: number[];
    team2Spells: number[];
    winProbability: number;
    explanation: any;
    explanations: mongoose.Types.DocumentArray<{
        factor?: string | null;
        impact?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        factor?: string | null;
        impact?: number | null;
    }, {}, {}> & {
        factor?: string | null;
        impact?: number | null;
    }>;
}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    user: mongoose.Types.ObjectId;
    team1: number[];
    team2: number[];
    team1Spells: number[];
    team2Spells: number[];
    winProbability: number;
    explanation: any;
    explanations: mongoose.Types.DocumentArray<{
        factor?: string | null;
        impact?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        factor?: string | null;
        impact?: number | null;
    }, {}, {}> & {
        factor?: string | null;
        impact?: number | null;
    }>;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    createdAt: NativeDate;
    user: mongoose.Types.ObjectId;
    team1: number[];
    team2: number[];
    team1Spells: number[];
    team2Spells: number[];
    winProbability: number;
    explanation: any;
    explanations: mongoose.Types.DocumentArray<{
        factor?: string | null;
        impact?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        factor?: string | null;
        impact?: number | null;
    }, {}, {}> & {
        factor?: string | null;
        impact?: number | null;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        createdAt: NativeDate;
        user: mongoose.Types.ObjectId;
        team1: number[];
        team2: number[];
        team1Spells: number[];
        team2Spells: number[];
        winProbability: number;
        explanation: any;
        explanations: mongoose.Types.DocumentArray<{
            factor?: string | null;
            impact?: number | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            factor?: string | null;
            impact?: number | null;
        }, {}, {}> & {
            factor?: string | null;
            impact?: number | null;
        }>;
    }, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<{
        createdAt: NativeDate;
        user: mongoose.Types.ObjectId;
        team1: number[];
        team2: number[];
        team1Spells: number[];
        team2Spells: number[];
        winProbability: number;
        explanation: any;
        explanations: mongoose.Types.DocumentArray<{
            factor?: string | null;
            impact?: number | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            factor?: string | null;
            impact?: number | null;
        }, {}, {}> & {
            factor?: string | null;
            impact?: number | null;
        }>;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    createdAt: NativeDate;
    user: mongoose.Types.ObjectId;
    team1: number[];
    team2: number[];
    team1Spells: number[];
    team2Spells: number[];
    winProbability: number;
    explanation: any;
    explanations: mongoose.Types.DocumentArray<{
        factor?: string | null;
        impact?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        factor?: string | null;
        impact?: number | null;
    }, {}, {}> & {
        factor?: string | null;
        impact?: number | null;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    user: mongoose.Types.ObjectId;
    team1: number[];
    team2: number[];
    team1Spells: number[];
    team2Spells: number[];
    winProbability: number;
    explanation: any;
    explanations: mongoose.Types.DocumentArray<{
        factor?: string | null;
        impact?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        factor?: string | null;
        impact?: number | null;
    }, {}, {}> & {
        factor?: string | null;
        impact?: number | null;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default _default;
//# sourceMappingURL=Prediction.d.ts.map