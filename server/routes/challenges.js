import express from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from '../database.js';

const router = express.Router();
const SECRET_KEY = 'wise-ozone-secret-key-change-in-prod';

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

// GET all challenges (with user status)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const db = await getDb();
        const challenges = await db.all('SELECT * FROM challenges');

        // Enrich with user status
        const enriched = await Promise.all(challenges.map(async (c) => {
            let status = 'available';
            let completedAt = null;

            if (c.verification_type === 'quiz') {
                // For quizzes, check the specialized user_quizzes table
                // We assume completing ANY quiz marks the "Weekly Quiz" challenge as done for now
                const userQuiz = await db.get(
                    'SELECT completed_at FROM user_quizzes WHERE user_id = ? ORDER BY completed_at DESC LIMIT 1',
                    [req.user.id]
                );
                if (userQuiz) {
                    status = 'approved';
                    completedAt = userQuiz.completed_at;
                }
            } else {
                // For other challenges, check user_challenges
                const userChal = await db.get(
                    'SELECT status, completed_at FROM user_challenges WHERE user_id = ? AND challenge_id = ? ORDER BY completed_at DESC LIMIT 1',
                    [req.user.id, c.id]
                );
                if (userChal) {
                    status = userChal.status;
                    completedAt = userChal.completed_at;
                }
            }

            return {
                ...c,
                status,
                completed_at: completedAt
            };
        }));

        res.json(enriched);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed' });
    }
});

// POST submit challenge (Mock AI verification)
router.post('/submit', authenticateToken, async (req, res) => {
    const { challengeId, proofContent } = req.body;
    const userId = req.user.id;

    // Simulate AI verification delay
    // await new Promise(r => setTimeout(r, 1000)); // Handled by frontend for UX now

    // Assume verification PASSES for prototype
    const status = 'approved';

    try {
        const db = await getDb();

        // 0. Get Challenge and Validate
        const challenge = await db.get('SELECT * FROM challenges WHERE id = ?', [challengeId]);
        if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

        if (challenge.verification_type === 'link') {
            if (!proofContent || !proofContent.startsWith('http')) {
                return res.status(400).json({ error: 'Invalid link provided' });
            }
        }

        // 1. Record User Challenge
        await db.run(
            'INSERT INTO user_challenges (user_id, challenge_id, status, proof_content) VALUES (?, ?, ?, ?)',
            [userId, challengeId, status, proofContent]
        );

        // 2. Award Points
        await db.run('UPDATE users SET points = points + ? WHERE id = ?', [challenge.points, userId]);

        // 3. Log Action for Badges (IMPORTANT)
        let actionType = 'challenge_general';
        const title = challenge.title || '';
        if (title.includes('Nevera') || title.includes('Clean')) actionType = 'clean_fridge';
        if (title.includes('Reciclar') || title.includes('Recycle')) actionType = 'recycle_appliance';

        await db.run('INSERT INTO user_actions (user_id, action_type, action_data) VALUES (?, ?, ?)',
            [userId, actionType, JSON.stringify({ challengeId: challenge.id, title: challenge.title })]);


        res.json({ success: true, status: 'approved', pointsEarned: challenge.points });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to submit' });
    }
});

export default router;
