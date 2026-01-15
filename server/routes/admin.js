import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '../database.js';

const router = express.Router();
const SECRET_KEY = 'wise-ozone-secret-key-change-in-prod';

// Admin Middleware
const isAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);

        // Hardcoded admin check
        if (user.username !== 'xaviserra') {
            return res.status(403).json({ error: 'Access denied: Admins only' });
        }

        req.user = user;
        next();
    });
};

// Get all users
router.get('/users', isAdmin, async (req, res) => {
    try {
        const db = await getDb();
        const users = await db.all('SELECT id, username, email, country, points FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new user (Admin only)
router.post('/users', isAdmin, async (req, res) => {
    const { username, password, email, country } = req.body;
    if (!username || !password || !email || !country) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        const db = await getDb();
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run(
            'INSERT INTO users (username, password_hash, email, country) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, email, country]
        );
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        if (err.message && err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Update user points
router.put('/users/:id/points', isAdmin, async (req, res) => {
    const userId = req.params.id;
    const { points } = req.body;

    try {
        const db = await getDb();
        await db.run('UPDATE users SET points = ? WHERE id = ?', [points, userId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user
router.delete('/users/:id', isAdmin, async (req, res) => {
    const userId = req.params.id;
    // Prevent deleting self? Maybe not strictly necessary for this rough admin panel but good practice.
    if (req.user.id == userId) { // simplistic check, careful with type coercion
        return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    try {
        const db = await getDb();
        await db.run('DELETE FROM users WHERE id = ?', [userId]);
        // Also clean up related data ideally, but cascading/manual cleanup might be needed
        // For now just user delete
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all posts for admin (with author info)
router.get('/posts', isAdmin, async (req, res) => {
    try {
        const db = await getDb();
        const posts = await db.all(`
            SELECT p.*, u.username as author 
            FROM posts p 
            JOIN users u ON p.author_id = u.id 
            ORDER BY p.created_at DESC
        `);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete post
router.delete('/posts/:id', isAdmin, async (req, res) => {
    const postId = req.params.id;

    try {
        const db = await getDb();
        await db.run('DELETE FROM posts WHERE id = ? OR parent_id = ?', [postId, postId]);
        await db.run('DELETE FROM post_likes WHERE post_id = ?', [postId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CHALLENGES MANAGEMENT ---

// Get all challenges
router.get('/challenges', isAdmin, async (req, res) => {
    try {
        const db = await getDb();
        const challenges = await db.all('SELECT * FROM challenges');
        res.json(challenges);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new challenge
router.post('/challenges', isAdmin, async (req, res) => {
    const {
        title, description, category, points,
        level, verification_type, periodicity
    } = req.body;

    if (!title || !points) {
        return res.status(400).json({ error: 'Title and Points are required' });
    }

    try {
        const db = await getDb();
        await db.run(`
            INSERT INTO challenges (
                title, description, category, points, 
                level, verification_type, periodicity, max_per_period
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            title,
            description || '',
            category || 'habit',
            points,
            level || 'easy',
            verification_type || 'auto',
            periodicity || 'once',
            1 // Default max per period
        ]);
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete challenge
router.delete('/challenges/:id', isAdmin, async (req, res) => {
    const id = req.params.id;
    try {
        const db = await getDb();
        await db.run('DELETE FROM challenges WHERE id = ?', [id]);
        await db.run('DELETE FROM user_challenges WHERE challenge_id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
