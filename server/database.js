import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'db', 'database.sqlite');

let db;

export const getDb = async () => {
    if (db) return db;

    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Initialize Schema
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password_hash TEXT,
            email TEXT,
            country TEXT,
            points INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author_id INTEGER,
            content TEXT,
            parent_id INTEGER DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(author_id) REFERENCES users(id),
            FOREIGN KEY(parent_id) REFERENCES posts(id)
        );
        CREATE TABLE IF NOT EXISTS post_likes (
            user_id INTEGER,
            post_id INTEGER,
            PRIMARY KEY (user_id, post_id),
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(post_id) REFERENCES posts(id)
        );
        CREATE TABLE IF NOT EXISTS friendships (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id_1 INTEGER,
            user_id_2 INTEGER,
            status TEXT DEFAULT 'pending', -- 'pending', 'accepted'
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id_1) REFERENCES users(id),
            FOREIGN KEY(user_id_2) REFERENCES users(id),
            UNIQUE(user_id_1, user_id_2)
        );
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER,
            receiver_id INTEGER,
            content TEXT,
            read BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(sender_id) REFERENCES users(id),
            FOREIGN KEY(receiver_id) REFERENCES users(id)
        );

        -- Badges System
        CREATE TABLE IF NOT EXISTS badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE, -- e.g. 'ozone_apprentice'
            name TEXT,
            description TEXT,
            category TEXT, -- 'learning', 'home', 'community', 'company', 'special'
            icon TEXT, -- emoji or path
            criteria_type TEXT, -- 'quiz_count', 'quiz_score', 'module_complete', 'manual_action', etc.
            criteria_value INTEGER DEFAULT 1 -- threshold to earn
        );

        CREATE TABLE IF NOT EXISTS user_badges (
            user_id INTEGER,
            badge_id INTEGER,
            earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, badge_id),
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(badge_id) REFERENCES badges(id)
        );

        CREATE TABLE IF NOT EXISTS user_actions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            action_type TEXT, -- 'quiz_complete', 'clean_fridge', 'recycle_cfc', etc.
            action_data TEXT, -- JSON string for extra details if needed
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );

        -- Quizzes System
        CREATE TABLE IF NOT EXISTS quizzes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            questions TEXT, -- JSON string
            order_index INTEGER
        );

        CREATE TABLE IF NOT EXISTS user_quizzes (
            user_id INTEGER,
            quiz_id INTEGER,
            score INTEGER,
            completed_at DATETIME,
            PRIMARY KEY (user_id, quiz_id),
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (quiz_id) REFERENCES quizzes (id)
        );

        -- Challenges System
        CREATE TABLE IF NOT EXISTS challenges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            category TEXT, -- 'direct', 'indirect', 'education', 'collective', 'habit'
            points INTEGER,
            level TEXT, -- 'easy', 'medium', 'hard'
            verification_type TEXT, -- 'photo', 'link', 'quiz', 'auto'
            periodicity TEXT, -- 'once', 'weekly', 'monthly'
            max_per_period INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS user_challenges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            challenge_id INTEGER,
            status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
            proof_content TEXT, -- URL or text
            completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(challenge_id) REFERENCES challenges(id)
        );
    `);

    console.log('Database connected and initialized.');
    return db;
};
