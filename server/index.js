import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

console.log("Loaded API Key:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + "..." : "NOT FOUND");

// Routes
import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';
import communityRoutes from './routes/community.js';
import challengeRoutes from './routes/challenges.js';
import userRoutes from './routes/user.js';
import socialRoutes from './routes/social.js';
import badgeRoutes from './routes/badges.js';
import quizRoutes from './routes/quizzes.js';
import chatRoutes from './routes/chat.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins for dev
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes); // Points & Leaderboard
app.use('/api/social', socialRoutes); // Friends & Messages
app.use('/api', dataRoutes); // /api/ozone-concentration, etc.
app.use('/api/community', communityRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/chat', chatRoutes);
import adminRoutes from './routes/admin.js';
app.use('/api/admin', adminRoutes);

// Statics (if needed, or frontend handles it)
// Statics
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../dist')));

// Handle React Routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
