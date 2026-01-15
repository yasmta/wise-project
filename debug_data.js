import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

(async () => {
    try {
        const db = await open({
            filename: './server/db/database.sqlite',
            driver: sqlite3.Database
        });

        console.log("--- COUNT CHECK ---");
        const challengeCount = await db.get("SELECT COUNT(*) as count FROM challenges");
        console.log(`Challenges count: ${challengeCount.count}`);

        const badgeCount = await db.get("SELECT COUNT(*) as count FROM badges");
        console.log(`Badges count: ${badgeCount.count}`);

        const quizCount = await db.get("SELECT COUNT(*) as count FROM quizzes");
        console.log(`Quizzes count: ${quizCount.count}`);

        console.log("--- DATA SAMPLE ---");
        if (badgeCount.count > 0) {
            const badges = await db.all("SELECT * FROM badges LIMIT 1");
            console.log("Sample Badge:", badges[0]);
        } else {
            console.log("WARNING: No badges found.");
        }

    } catch (err) {
        console.error("Database Error:", err);
    }
})();
