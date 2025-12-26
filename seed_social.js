import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'server', 'db', 'database.sqlite');

async function seedSocial() {
    console.log('Opening DB at:', dbPath);
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    console.log('--- Cleaning old social data (optional) ---');
    // await db.run('DELETE FROM posts'); 
    // await db.run('DELETE FROM friendships');
    // await db.run('DELETE FROM messages');
    // For now we append or update.

    console.log('--- Seeding Social Users ---');
    const bots = [
        { username: 'GreenNinja', email: 'ninja@test.com', points: 2100 },
        { username: 'AquaMarine', email: 'aqua@test.com', points: 3400 },
        { username: 'ForestGump', email: 'forest@test.com', points: 1200 },
        { username: 'CaptainPlanet', email: 'cap@test.com', points: 9000 },
        { username: 'RecycleRex', email: 'rex@test.com', points: 500 }
    ];

    const botIds = {};

    for (const b of bots) {
        let user = await db.get('SELECT id FROM users WHERE username = ?', [b.username]);
        if (!user) {
            const hash = await bcrypt.hash('password', 10);
            const res = await db.run(
                'INSERT INTO users (username, email, password_hash, points, country) VALUES (?, ?, ?, ?, ?)',
                [b.username, b.email, hash, b.points, 'Global']
            );
            botIds[b.username] = res.lastID;
            console.log(`Created ${b.username}`);
        } else {
            botIds[b.username] = user.id;
            console.log(`Found ${b.username}`);
        }
    }

    console.log('--- Seeding Posts ---');
    const posts = [
        { author: 'GreenNinja', content: 'Just planted 5 trees today! #Reforestation' },
        { author: 'AquaMarine', content: 'Did you know 70% of oxygen comes from the ocean? Protect it! 🌊' },
        { author: 'CaptainPlanet', content: 'The power is yours! Don\'t forget to recycle.' },
        { author: 'ForestGump', content: 'Run, Forest, Run... against climate change!' }
    ];

    for (const p of posts) {
        await db.run(
            'INSERT INTO posts (author_id, content, created_at) VALUES (?, ?, datetime("now", "-' + Math.floor(Math.random() * 10) + ' hours"))',
            [botIds[p.author], p.content]
        );
    }

    console.log('--- Seeding Friendships & Messages ---');
    // Ensure we have a main user (assuming ID 1 or find 'Wisdom' if exists, else picking first bot)
    // We'll just link bots together for now.

    // GreenNinja <-> AquaMarine (Friends)
    await db.run('INSERT OR IGNORE INTO friendships (user_id_1, user_id_2, status) VALUES (?, ?, ?)',
        [botIds['GreenNinja'], botIds['AquaMarine'], 'accepted']);

    // ForestGump -> GreenNinja (Pending Request)
    await db.run('INSERT OR IGNORE INTO friendships (user_id_1, user_id_2, status) VALUES (?, ?, ?)',
        [botIds['ForestGump'], botIds['GreenNinja'], 'pending']);

    // Messages between GreenNinja and AquaMarine
    await db.run('INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
        [botIds['GreenNinja'], botIds['AquaMarine'], 'Hey Aqua, how are the oceans?']);
    await db.run('INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
        [botIds['AquaMarine'], botIds['GreenNinja'], 'Cleaning up nicely! Thanks for asking.']);

    console.log('Social Seed Complete.');
}

seedSocial().catch(console.error);
