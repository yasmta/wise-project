import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'server', 'db', 'database.sqlite');

async function seed() {
    console.log('Opening DB at:', dbPath);
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    console.log('Seeding users...');

    const users = [
        { username: 'EcoKing', points: 1500, email: 'eco@test.com' },
        { username: 'SolarQueen', points: 1200, email: 'solar@test.com' },
        { username: 'WindMaster', points: 900, email: 'wind@test.com' },
        { username: 'RecycleBot', points: 400, email: 'bot@test.com' }
    ];

    for (const u of users) {
        try {
            const hash = await bcrypt.hash('password123', 10);
            await db.run(
                'INSERT INTO users (username, password_hash, email, country, points) VALUES (?, ?, ?, ?, ?)',
                [u.username, hash, u.email, 'Spain', u.points]
            );
            console.log(`Added ${u.username}`);
        } catch (err) {
            console.log(`Skipping ${u.username} (maybe exists)`);
        }
    }

    console.log('Seeding complete.');
}

seed().catch(console.error);
