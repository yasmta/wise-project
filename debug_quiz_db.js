
import fetch from 'node-fetch';

(async () => {
    try {
        // We probably need a token. Let's try to fetch without one or fake it if backend allows.
        // Actually, the backend is protected: authenticateToken.
        // I'll assume I can just query the DB directly which is easier since I am on the server.

        const { getDb } = await import('./server/database.js');
        const db = await getDb();
        const challenges = await db.all("SELECT * FROM challenges WHERE id = 1"); // Assuming ID 1 is quiz
        console.log(JSON.stringify(challenges, null, 2));

        const userChallenges = await db.all("SELECT * FROM user_challenges");
        console.log("User Completions:", JSON.stringify(userChallenges, null, 2));

    } catch (err) {
        console.error(err);
    }
})();
