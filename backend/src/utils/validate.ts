import type{ Request, Response, NextFunction } from 'express';
import { ZodObject, z } from 'zod';

// --- SCHEMAS ---

// 1. Auth Schemas
export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

// 2. Machine Learning Schemas
export const predictSchema = z.object({
  body: z.object({
    team1: z.array(z.number()).length(5, "Team 1 must have exactly 5 champion IDs"),
    team2: z.array(z.number()).length(5, "Team 2 must have exactly 5 champion IDs"),
  }),
});

export const recommendSchema = z.object({
  body: z.object({
    myTeam: z.array(z.number()).max(5, "Your team cannot have more than 5 champions"),
    enemyTeam: z.array(z.number()).max(5, "Enemy team cannot have more than 5 champions"),
  }),
});

// --- MIDDLEWARE ---
// This function sits between the User and the Controller.
// It checks if the data matches the schema above.
export const validate = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (e: any) {
    return res.status(400).json({
      error: "Validation Error",
      details: e.errors,
    });
  }
};