import express from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from '../database.js';

const router = express.Router();
const SECRET_KEY = 'wise-ozone-secret-key-change-in-prod';

// Middleware (TODO: Extract to shared file)
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

// --- PROFILE ---
router.get('/profile/:username', async (req, res) => {
    const { username } = req.params;
    const requesterId = req.headers['x-user-id']; // Optional: check friendship status if logged in

    try {
        const db = await getDb();
        const user = await db.get('SELECT id, username, points, country, email FROM users WHERE username = ?', [username]);

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Calculate Stats
        const level = Math.floor(user.points / 500) + 1;

        let friendshipStatus = 'none';
        if (requesterId) {
            // Check friendship
            const f = await db.get(`
                SELECT status FROM friendships 
                WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)
            `, [requesterId, user.id, user.id, requesterId]);
            if (f) friendshipStatus = f.status;
        }

        res.json({ ...user, level, friendshipStatus });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- FRIENDSHIPS ---
router.post('/friends/request', authenticateToken, async (req, res) => {
    const { toUserId } = req.body;
    const fromUserId = req.user.id;

    if (fromUserId === toUserId) return res.status(400).json({ error: 'Cannot add yourself' });

    try {
        const db = await getDb();
        // Check existing
        const existing = await db.get(`
            SELECT * FROM friendships 
            WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)
        `, [fromUserId, toUserId, toUserId, fromUserId]);

        if (existing) return res.status(400).json({ error: 'Friendship already exists or pending' });

        await db.run('INSERT INTO friendships (user_id_1, user_id_2) VALUES (?, ?)', [fromUserId, toUserId]);
        res.json({ success: true, status: 'pending' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/friends/accept', authenticateToken, async (req, res) => {
    const { friendshipId } = req.body; // Or use user ID logic
    // For simplicity, let's accept by target user ID
    // Actually better to have a list of pending requests
});

// Get Friends List
router.get('/friends', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const db = await getDb();
        const friends = await db.all(`
            SELECT u.id, u.username, u.points 
            FROM friendships f
            JOIN users u ON (u.id = f.user_id_1 OR u.id = f.user_id_2)
            WHERE (f.user_id_1 = ? OR f.user_id_2 = ?) 
            AND f.status = 'accepted'
            AND u.id != ?
        `, [userId, userId, userId]);
        res.json(friends);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- MESSAGES ---
// --- MESSAGES ---
router.get('/conversations', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const db = await getDb();
        // Finding all unique partners I have interacted with
        const convos = await db.all(`
            SELECT u.id, u.username, u.points, last_msg.created_at as last_activity
            FROM users u
            JOIN (
                SELECT 
                    CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as partner_id,
                    MAX(created_at) as created_at
                FROM messages
                WHERE sender_id = ? OR receiver_id = ?
                GROUP BY partner_id
            ) last_msg ON u.id = last_msg.partner_id
            ORDER BY last_msg.created_at DESC
        `, [userId, userId, userId]);
        res.json(convos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/messages/:friendId', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { friendId } = req.params;

    try {
        const db = await getDb();
        const messages = await db.all(`
            SELECT * FROM messages 
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC
        `, [userId, friendId, friendId, userId]);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/messages', authenticateToken, async (req, res) => {
    const { toUserId, content } = req.body;
    const fromUserId = req.user.id;

    try {
        const db = await getDb();
        const result = await db.run(
            'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
            [fromUserId, toUserId, content]
        );
        res.status(201).json({ id: result.lastID, content, created_at: new Date() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
