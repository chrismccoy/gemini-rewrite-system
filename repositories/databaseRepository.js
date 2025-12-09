/**
 * Data Access Layer for SQLite
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const config = require('../config/appConfig');

class DatabaseRepository {

    constructor() {
        const dataDir = path.join(__dirname, '../data');

        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }

        this.db = new Database(path.join(dataDir, 'curator.db'));

        this.initSchema();
    }

    initSchema() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS feeds (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                content TEXT,
                original_link TEXT UNIQUE,
                source_name TEXT,
                status TEXT DEFAULT 'draft',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT
            );
        `);

        this.setSetting('system_prompt', config.defaults.systemPrompt, true);
    }

    run(sql, ...params) {
        return this.db.prepare(sql).run(...params);
    }

    all(sql, ...params) {
        return this.db.prepare(sql).all(...params);
    }

    get(sql, ...params) {
        return this.db.prepare(sql).get(...params);
    }

    deletePost(id) {
        return this.run('DELETE FROM posts WHERE id = ?', id);
    }

    getSetting(key) {
        const row = this.get('SELECT value FROM settings WHERE key = ?', key);
        return row ? row.value : '';
    }

    setSetting(key, value, ignoreIfExists = false) {
        const sql = ignoreIfExists
            ? 'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)'
            : 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)';
        this.run(sql, key, value);
    }
}

module.exports = new DatabaseRepository();
