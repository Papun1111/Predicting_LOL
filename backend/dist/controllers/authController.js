import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
// Helper: Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // 1. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // 3. Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        if (user) {
            // 4. Return user info + Token
            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user.id),
            });
        }
        else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 1. Find user by email
        const user = await User.findOne({ email });
        // 2. Check password
        // FIX: We explicitly check "user.password" exists to satisfy TypeScript
        if (user && user.password && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user.id),
            });
        }
        else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// @desc    Get current user data
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    // @ts-ignore
    res.status(200).json(req.user);
};
//# sourceMappingURL=authController.js.map