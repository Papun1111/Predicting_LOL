import type { Request, Response, NextFunction } from 'express';
import { ZodObject, z } from 'zod';
export declare const registerSchema: ZodObject<{
    body: ZodObject<{
        username: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const loginSchema: ZodObject<{
    body: ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const predictSchema: ZodObject<{
    body: ZodObject<{
        team1: z.ZodArray<z.ZodNumber>;
        team2: z.ZodArray<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const recommendSchema: ZodObject<{
    body: ZodObject<{
        myTeam: z.ZodArray<z.ZodNumber>;
        enemyTeam: z.ZodArray<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const validate: (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validate.d.ts.map