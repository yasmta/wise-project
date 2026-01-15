import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

(async () => {
    const db = await open({
        filename: './server/db/database.sqlite',
        driver: sqlite3.Database
    });

    console.log("Checking 'quizzes' table info:");
    const quizzesInfo = await db.all("PRAGMA table_info(quizzes)");
    console.log(quizzesInfo);

    console.log("Checking 'challenges' table info:");
    const challengesInfo = await db.all("PRAGMA table_info(challenges)");
    console.log(challengesInfo);
})();
