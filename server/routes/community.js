import express from 'express';
import { getDb } from '../database.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = 'wise-ozone-secret-key-change-in-prod';

// Auth Middleware (Duplicated or imported? Better to export from auth or a middleware file)
// For simplicity in this refactor step, I'll inline it or extract it to a middleware file.
// Let's create a middleware file? Or just put it here.
// Best practice: `server/middleware/auth.js`.
// I'll stick to inlining for now to save a file, or better, export it from `auth.js`?
// No, auth.js is routes.
// I'll just redefine it here to keep modules self-contained for now, or move it to `server/middleware.js` later.

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
    try {
        const db = await getDb();
        const query = `
            SELECT p.*, u.username as author, 
            (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes,
            (SELECT COUNT(*) FROM posts WHERE parent_id = p.id) as replies
            FROM posts p
            JOIN users u ON p.author_id = u.id
            WHERE p.parent_id ${parentId ? '= ?' : 'IS NULL'}
            ORDER BY p.created_at DESC
        `;
        const params = parentId ? [parentId] : [];
        const posts = await db.all(query, params);
        res.json(posts);
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
            SELECT p.*, u.username as author, 0 as likes, 0 as replies
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
    const userId = req.user.id; // Corrected from `user_id` in some contexts, but `req.user.id` is standard

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

// Update Points (Moved from User/Auth to here or User route? Ideally user route. 
// But let's check `server.js`... it was `/api/user/update-points`. 
// I'll put it in `auth.js` or a new `user.js`? `auth` is fine for now as it handles user data.)
// Wait, `auth.js` has login/register.
// I'll add `update-points` to `auth.js` (renaming it to `users.js` is better, but `auth.js` is what I made).
// Or I can add it here? No, Community is for posts, not points.
// Let's Add it to `auth.js`.

export default router;
