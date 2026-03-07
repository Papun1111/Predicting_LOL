import type{ Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

interface DecodedToken extends jwt.JwtPayload {
  id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  // 1. Check if the header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      // Using 'const' ensures TypeScript knows this is a string (or undefined)
      const token = req.headers.authorization.split(' ')[1];

      // Explicit check to ensure it's not undefined/empty
      if (!token) {
        res.status(401).json({ error: 'Not authorized, no token' });
        return;
      }

      // 2. Verify token (Now strictly typed as string)
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;

      // 3. Get user from the token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401).json({ error: 'Not authorized, user not found' });
        return;
      }

      // 4. Attach user to request
      //@ts-check
      req.user = user;
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } else {
    // If no header exists at all
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};