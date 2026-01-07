import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';
import communityRoutes from './routes/community.js';
import challengeRoutes from './routes/challenges.js';
import userRoutes from './routes/user.js';
import socialRoutes from './routes/social.js';
import badgeRoutes from './routes/badges.js';
import quizRoutes from './routes/quizzes.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins for dev
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes); // Points & Leaderboard
app.use('/api/social', socialRoutes); // Friends & Messages
app.use('/api', dataRoutes); // /api/ozone-concentration, etc.
app.use('/api/community', communityRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/quizzes', quizRoutes);

// Statics (if needed, or frontend handles it)
// app.use(express.static(path.join(__dirname, '../dist')));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
