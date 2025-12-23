import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'db', 'database.sqlite');

const app = express();
app.use(cors({ origin: '*' })); // Allow all origins for dev
app.use(express.json());

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'wise-ozone-secret-key-change-in-prod'; // Simple secret for this task

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

// --- AUTH ENDPOINTS ---

// Register
app.post('/api/auth/register', async (req, res) => {
    const { username, password, email, country } = req.body;
    if (!username || !password || !email || !country) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run(
            'INSERT INTO users (username, password_hash, email, country) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, email, country]
        );
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        if (await bcrypt.compare(password, user.password_hash)) {
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    country: user.country,
                    points: user.points
                }
            });
        } else {
            res.status(403).json({ error: 'Invalid password' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Points (Protected)
app.post('/api/user/update-points', authenticateToken, async (req, res) => {
    const { points } = req.body;
    const userId = req.user.id;

    try {
        // We accumulate points or set them? "points que se van haciendo" implies accumulation or current total.
        // Let's assume the frontend sends the NEW TOTAL or ADDITION?
        // Usually safer to ADD. Let's assume input is "points to add" for safety, OR "new total".
        // Simplest: Update to absolute value provided, logic on frontend.
        // Better: Backend handles addition. Let's do absolute update for simplicity as per common game logic sync.

        await db.run('UPDATE users SET points = ? WHERE id = ?', [points, userId]);
        res.json({ success: true, points });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

let db;

(async () => {
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Ensure Community Tables exist
    await db.exec(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author_id INTEGER,
            content TEXT,
            parent_id INTEGER DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(author_id) REFERENCES users(id),
            FOREIGN KEY(parent_id) REFERENCES posts(id)
        );
        CREATE TABLE IF NOT EXISTS post_likes (
            user_id INTEGER,
            post_id INTEGER,
            PRIMARY KEY (user_id, post_id),
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(post_id) REFERENCES posts(id)
        );
    `);
    console.log('Database initialized with Community tables.');
})();

// Endpoint 1: Ozone Concentration
app.get('/api/ozone-concentration', async (req, res) => {
    try {
        const data = await db.all('SELECT year, mean_concentration, min_concentration FROM ozone_concentration ORDER BY year ASC');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint 2: Hole Surface
app.get('/api/hole-surface', async (req, res) => {
    try {
        const data = await db.all('SELECT year, max_area, mean_area FROM hole_surface ORDER BY year ASC');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint 3: Emissions
app.get('/api/emissions', async (req, res) => {
    try {
        const data = await db.all('SELECT year, natural_emissions, total_emissions FROM emissions ORDER BY year ASC');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- COMMUNITY ENDPOINTS ---

// Get all posts (or replies to a post)
app.get('/api/community/posts', async (req, res) => {
    const parentId = req.query.parentId || null;
    try {
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
app.post('/api/community/posts', authenticateToken, async (req, res) => {
    const { content, parentId } = req.body;
    const authorId = req.user.id;

    if (!content) return res.status(400).json({ error: 'Content is required' });

    try {
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

// Like/Unlike a post
app.post('/api/community/posts/:id/like', authenticateToken, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
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
app.delete('/api/community/posts/:id', authenticateToken, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
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

// FORCE PORT 3001
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
