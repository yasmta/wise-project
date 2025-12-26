import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'server', 'db', 'database.sqlite');

async function debugChat() {
    console.log('--- DB PATH ---');
    console.log(dbPath);

    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    console.log('\n--- TABLES ---');
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log(tables);

    console.log('\n--- MESSAGES TABLE INFO ---');
    try {
        const info = await db.all("PRAGMA table_info(messages)");
        console.log(info);
    } catch (e) { console.error("Could not get table info", e); }

    console.log('\n--- TEST QUERY (Conversations) ---');
    // Simulate user ID = 1 (assuming user exists)
    // First, find a valid user
    const user = await db.get("SELECT * FROM users LIMIT 1");
    if (!user) {
        console.log("No users found!");
        return;
    }
    console.log(`Testing with User: ${user.username} (ID: ${user.id})`);

    const userId = user.id;

    const query = `
            SELECT u.id, u.username, u.points, last_msg.created_at as last_activity
            FROM users u
            JOIN (
                SELECT 
                    CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as partner_id,
                    MAX(created_at) as created_at
                FROM messages
                WHERE sender_id = ? OR receiver_id = ?
                GROUP BY partner_id
            ) last_msg ON u.id = last_msg.partner_id
            ORDER BY last_msg.created_at DESC
    `;

    try {
        const res = await db.all(query, [userId, userId, userId]);
        console.log("Query Results:", res);
    } catch (e) {
        console.error("Query FAILED:", e);
    }

    console.log('\n--- ALL MESSAGES FOR THIS USER ---');
    const msgs = await db.all("SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ?", [userId, userId]);
    console.log(msgs);
}

debugChat().catch(console.error);
