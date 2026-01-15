import express from 'express';
import { getDb } from '../database.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = 'wise-ozone-secret-key-change-in-prod';

// Auth Middleware
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

// Get all posts (or replies)
router.get('/posts', async (req, res) => {
    const parentId = req.query.parentId || null;

    // Optional Auth to check 'isLiked'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let userId = null;

    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            userId = decoded.id;
        } catch (e) { /* invalid token, treat as guest */ }
    }

    try {
        const db = await getDb();
        const query = `
            SELECT p.*, u.username as author,
            (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes,
            (SELECT COUNT(*) FROM posts WHERE parent_id = p.id) as replies
            ${userId ? `,(SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND user_id = ${userId}) as user_liked` : ', 0 as user_liked'}
            FROM posts p
            JOIN users u ON p.author_id = u.id
            WHERE p.parent_id ${parentId ? '= ?' : 'IS NULL'}
            ORDER BY p.created_at DESC
        `;
        const params = parentId ? [parentId] : [];
        const posts = await db.all(query, params);

        const formattedPosts = posts.map(p => ({
            ...p,
            user_liked: !!p.user_liked
        }));

        res.json(formattedPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a post
router.post('/posts', authenticateToken, async (req, res) => {
    const { content, parentId } = req.body;
    const authorId = req.user.id;

    if (!content) return res.status(400).json({ error: 'Content is required' });

    try {
        const db = await getDb();
        const result = await db.run(
            'INSERT INTO posts (author_id, content, parent_id) VALUES (?, ?, ?)',
            [authorId, content, parentId || null]
        );
        const newPost = await db.get(`
            SELECT p.*, u.username as author, 0 as likes, 0 as replies, 0 as user_liked
            FROM posts p
            JOIN users u ON p.author_id = u.id
            WHERE p.id = ?
        `, [result.lastID]);
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Like/Unlike
router.post('/posts/:id/like', authenticateToken, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const db = await getDb();
        const existingLike = await db.get('SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?', [userId, postId]);
        if (existingLike) {
            await db.run('DELETE FROM post_likes WHERE user_id = ? AND post_id = ?', [userId, postId]);
            res.json({ liked: false });
        } else {
            await db.run('INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)', [userId, postId]);
            res.json({ liked: true });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a post
router.delete('/posts/:id', authenticateToken, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const db = await getDb();
        const post = await db.get('SELECT * FROM posts WHERE id = ?', [postId]);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.author_id !== userId) return res.status(403).json({ error: 'Unauthorized' });

        await db.run('DELETE FROM posts WHERE id = ? OR parent_id = ?', [postId, postId]);
        await db.run('DELETE FROM post_likes WHERE post_id = ?', [postId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
