import express, {} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';
// Import Routes
import authRoutes from './routes/authRoutes.js';
import predictRoutes from './routes/predictRoutes.js';
import recommendRoutes from './routes/recommendRoutes.js';
// 1. Load Environment Variables
dotenv.config();
// 2. Connect to MongoDB
connectDB();
// 3. Initialize Express
const app = express();
// 4. Middleware
app.use(cors()); // Allow Frontend to talk to Backend
app.use(express.json()); // Parse JSON bodies
// 5. Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/recommend', recommendRoutes);
app.get('/health', (req, res) => {
    res.send('API is running...');
});
app.use(errorHandler);
// 8. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map