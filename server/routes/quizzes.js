import express from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from '../database.js';

const router = express.Router();
const SECRET_KEY = 'wise-ozone-secret-key-change-in-prod';

// Middleware
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

const UNLOCK_INTERVAL_MS = 4 * 24 * 60 * 60 * 1000; // 4 days

// GET all quizzes with user status
router.get('/', authenticateToken, async (req, res) => {
    try {
        console.log('Fetching quizzes for user:', req.user.id);
        const db = await getDb();
        const userId = req.user.id;

        const quizzes = await db.all('SELECT id, title, description, order_index FROM quizzes ORDER BY order_index ASC');
        const userCompletions = await db.all('SELECT quiz_id, completed_at FROM user_quizzes WHERE user_id = ?', [userId]);

        const completionMap = {};
        userCompletions.forEach(c => {
            completionMap[c.quiz_id] = c.completed_at;
        });

        let lastCompletionTime = null;
        const enrichedQuizzes = quizzes.map((q, index) => {
            const completedAt = completionMap[q.id];
            let status = 'locked';

            if (completedAt) {
                status = 'completed';
                lastCompletionTime = new Date(completedAt).getTime();
            } else {
                // Determine if unlocked
                if (index === 0) {
                    status = 'unlocked';
                } else {
                    const prevQuizId = quizzes[index - 1].id;
                    const prevCompletion = completionMap[prevQuizId];
                    if (prevCompletion) {
                        const timeSincePrev = Date.now() - new Date(prevCompletion).getTime();
                        if (timeSincePrev >= UNLOCK_INTERVAL_MS) {
                            status = 'unlocked';
                        } else {
                            // Calculate remaining time
                            status = 'locked';
                            q.unlocks_in = UNLOCK_INTERVAL_MS - timeSincePrev;
                        }
                    }
                }
            }

            return { ...q, status };
        });

        res.json(enrichedQuizzes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
});

// GET specific quiz questions
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const db = await getDb();
        const quiz = await db.get('SELECT * FROM quizzes WHERE id = ?', [req.params.id]);
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

        // In a real app, verify it is actually unlocked for this user
        res.json({
            ...quiz,
            questions: JSON.parse(quiz.questions)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed' });
    }
});

// POST submit quiz
router.post('/:id/submit', authenticateToken, async (req, res) => {
    const { answers } = req.body; // array of indices
    const userId = req.user.id;
    const quizId = req.params.id;

    try {
        const db = await getDb();
        const quiz = await db.get('SELECT * FROM quizzes WHERE id = ?', [quizId]);
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

        const questions = JSON.parse(quiz.questions);
        let score = 0;
        answers.forEach((ans, idx) => {
            if (ans === questions[idx].answer) score++;
        });

        const passed = score === questions.length;

        if (passed) {
            // Check if already completed
            const existing = await db.get('SELECT 1 FROM user_quizzes WHERE user_id = ? AND quiz_id = ?', [userId, quizId]);
            if (!existing) {
                await db.run('INSERT INTO user_quizzes (user_id, quiz_id, score, completed_at) VALUES (?, ?, ?, ?)',
                    [userId, quizId, score, new Date().toISOString()]);

                // Award points
                const points = 50; // Points per quiz
                await db.run('UPDATE users SET points = points + ? WHERE id = ?', [points, userId]);
            }
        }

        res.json({ success: passed, score, total: questions.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
});

export default router;
