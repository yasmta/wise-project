import express from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from '../database.js';

const router = express.Router();
const SECRET_KEY = 'wise-ozone-secret-key-change-in-prod';

// Middleware (Copied from auth.js for isolated simplicity)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Update Points
router.post('/update-points', authenticateToken, async (req, res) => {
    const { points } = req.body;
    const userId = req.user.id; // from token

    if (typeof points !== 'number') {
        return res.status(400).json({ error: 'Points must be a number' });
    }

    try {
        const db = await getDb();
        // Update user points
        await db.run('UPDATE users SET points = ? WHERE id = ?', [points, userId]);

        // Return confirmed points
        res.json({ success: true, points });
    } catch (err) {
        console.error('Error updating points:', err);
        res.status(500).json({ error: 'Failed to update points' });
    }
});

// Get Leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const db = await getDb();
        // Get top 50 users sorted by points
        // Assuming avatarColor isn't in DB yet, we'll generate it or ignore it for now (frontend can mock or hash it)
        const users = await db.all(`
            SELECT username, points 
            FROM users 
            ORDER BY points DESC 
            LIMIT 50
        `);

        // Add rank to each
        const rankedUsers = users.map((u, index) => ({
            rank: index + 1,
            name: u.username,
            points: u.points,
            trend: Math.random() > 0.5 ? 'up' : 'stable', // Mock trend for now
            avatarColor: '#' + Math.floor(Math.random() * 16777215).toString(16) // Random color for now
        }));

        res.json(rankedUsers);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

export default router;
