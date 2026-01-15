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

        const quizzes = await db.all('SELECT id, title, description, questions, order_index FROM quizzes ORDER BY order_index ASC');
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
                } else if (lastCompletionTime) {
                    const diff = Date.now() - lastCompletionTime;
                    if (diff >= UNLOCK_INTERVAL_MS) {
                        status = 'unlocked';
                    } else {
                        status = 'locked';
                    }
                }
            }
            if (index > 0) {
                const prevCompleted = completionMap[quizzes[index - 1].id];
                if (!prevCompleted) status = 'locked';
            }

            let parsedQuestions = [];
            try {
                parsedQuestions = JSON.parse(q.questions || '[]');
            } catch (e) {
                console.error("Failed to parse questions for quiz", q.id, e);
            }

            return {
                ...q,
                questions: parsedQuestions,
                status,
                unlocksIn: (status === 'locked' && lastCompletionTime) ? (UNLOCK_INTERVAL_MS - (Date.now() - lastCompletionTime)) : 0
            };
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

        // Scoring Logic
        let points = 0;
        const total = questions.length;
        console.log(`Scoring Quiz: Score=${score}/${total}. Answers:`, answers, "Key:", questions.map(q => q.answer));

        if (score === total) points = 100;
        else if (score / total >= 0.5) points = 50;
        else if (score > 0) points = 25;

        console.log(`Current Attempt Points: ${points}`);

        const passed = true; // Always mark as completed

        if (passed) {
            // Check if already completed
            const existing = await db.get('SELECT score FROM user_quizzes WHERE user_id = ? AND quiz_id = ?', [userId, quizId]);

            if (!existing) {
                // First time
                await db.run('INSERT INTO user_quizzes (user_id, quiz_id, score, completed_at) VALUES (?, ?, ?, ?)',
                    [userId, quizId, score, new Date().toISOString()]);

                if (points > 0) {
                    await db.run('UPDATE users SET points = points + ? WHERE id = ?', [points, userId]);
                }
            } else {
                // Already exists - check if improved
                // Calculate old points
                let oldPoints = 0;
                const oldScore = existing.score;
                if (oldScore === total) oldPoints = 100;
                else if (oldScore / total >= 0.5) oldPoints = 50;
                else if (oldScore > 0) oldPoints = 25;

                if (points > oldPoints) {
                    const diff = points - oldPoints;
                    console.log(`Improved Score! Awarding difference: ${diff} XP`);

                    await db.run('UPDATE user_quizzes SET score = ?, completed_at = ? WHERE user_id = ? AND quiz_id = ?',
                        [score, new Date().toISOString(), userId, quizId]);

                    await db.run('UPDATE users SET points = points + ? WHERE id = ?', [diff, userId]);
                } else {
                    console.log("No point improvement.");
                }
            }
        }

        res.json({ success: true, score, total: questions.length, pointsAwarded: points });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
});

export default router;
