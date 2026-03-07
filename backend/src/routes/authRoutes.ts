import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, registerSchema, loginSchema } from '../utils/validate.js';

const router = express.Router();

// POST /api/auth/register
// 1. Validates input (username, email, password)
// 2. Calls register controller
router.post('/register', validate(registerSchema), register);

// POST /api/auth/login
// 1. Validates input
// 2. Calls login controller
router.post('/login', validate(loginSchema), login);

// GET /api/auth/me
// 1. Checks for valid Token (protect)
// 2. Returns user data
router.get('/me', protect, getMe);

export default router;