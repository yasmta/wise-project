import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

(async () => {
    const db = await open({
        filename: './server/db/database.sqlite',
        driver: sqlite3.Database
    });

    try {
        console.log("Adding 'questions' column to 'quizzes' table...");
        await db.exec("ALTER TABLE quizzes ADD COLUMN questions TEXT;");
        console.log("Column 'questions' added successfully.");
    } catch (err) {
        if (err.message.includes("duplicate column name")) {
            console.log("Column 'questions' already exists.");
        } else {
            console.error("Error adding column:", err);
        }
    }
})();
