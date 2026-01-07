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

// GET all badges
router.get('/', async (req, res) => {
    try {
        const db = await getDb();
        const badges = await db.all('SELECT * FROM badges');
        res.json(badges);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch badges' });
    }
});

// GET user badges
router.get('/my-badges', authenticateToken, async (req, res) => {
    try {
        const db = await getDb();

        // Auto-check badges on load (optional, but ensures sync)
        await checkAndAwardBadges(req.user.id, db);

        const userBadges = await db.all(`
            SELECT b.*, ub.earned_at 
            FROM badges b
            JOIN user_badges ub ON b.id = ub.badge_id
            WHERE ub.user_id = ?
        `, [req.user.id]);
        res.json(userBadges);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user badges' });
    }
});

// Helper: Check and Award Badges
async function checkAndAwardBadges(userId, db) {
    // This function evaluates all badge criteria for the user
    // In a real app, this might be optimized to only check relevant badges

    // 1. Fetch all badges
    const badges = await db.all('SELECT * FROM badges');

    // 2. Fetch user stats/actions
    const actions = await db.all('SELECT * FROM user_actions WHERE user_id = ?', [userId]);

    const newBadges = [];

    for (const badge of badges) {
        // Skip if already earned
        const existing = await db.get('SELECT 1 FROM user_badges WHERE user_id = ? AND badge_id = ?', [userId, badge.id]);
        if (existing) continue;

        let earned = false;

        switch (badge.criteria_type) {
            case 'quiz_count':
                const quizCount = actions.filter(a => a.action_type === 'quiz_complete').length;
                if (quizCount >= badge.criteria_value) earned = true;
                break;
            case 'quiz_high_score_count':
                // logic for high score
                const highScores = actions.filter(a => a.action_type === 'quiz_complete' && a.action_data && JSON.parse(a.action_data).score >= 8).length;
                if (highScores >= badge.criteria_value) earned = true;
                break;
            case 'module_complete_all':
                // implementation depends on module tracking
                break;
            case 'action_clean_fridge':
                earned = actions.some(a => a.action_type === 'clean_fridge');
                break;
            case 'action_recycle_appliance':
                earned = actions.filter(a => a.action_type === 'recycle_appliance').length >= badge.criteria_value;
                break;
            case 'action_no_old_appliances':
                earned = actions.some(a => a.action_type === 'no_old_appliances');
                break;
            case 'action_home_general':
                const homeTypes = ['clean_fridge', 'recycle_appliance', 'no_old_appliances'];
                const uniqueHomeActions = new Set(actions.filter(a => homeTypes.includes(a.action_type)).map(a => a.action_type));
                if (uniqueHomeActions.size >= badge.criteria_value) earned = true;
                break;
            case 'forum_contributions':
                const forumCount = actions.filter(a => a.action_type === 'forum_contributions').length;
                if (forumCount >= badge.criteria_value) earned = true;
                break;
            case 'manual_award':
                // Admin or special trigger only
                break;
            default:
                // Fallback: If criteria_type matches an action_type directly
                if (actions.some(a => a.action_type === badge.criteria_type)) {
                    earned = true;
                }
                break;
        }

        if (earned) {
            await db.run('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)', [userId, badge.id]);
            newBadges.push(badge);
        }
    }

    return newBadges;
}

// POST report action (triggers badge check)
router.post('/action', authenticateToken, async (req, res) => {
    const { action_type, action_data } = req.body;
    const userId = req.user.id;

    try {
        const db = await getDb();

        // Record action
        await db.run('INSERT INTO user_actions (user_id, action_type, action_data) VALUES (?, ?, ?)',
            [userId, action_type, JSON.stringify(action_data || {})]);

        // Check badges
        const newBadges = await checkAndAwardBadges(userId, db);

        // Award points if forum contribution
        let pointsAwarded = 0;
        if (action_type === 'forum_contributions') {
            pointsAwarded = 10; // Default points for forum action
            await db.run('UPDATE users SET points = points + ? WHERE id = ?', [pointsAwarded, userId]);
        }

        res.json({ success: true, newBadges, pointsAwarded });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to record action' });
    }
});

export default router;
