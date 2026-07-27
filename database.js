import { DatabaseSync } from 'node:sqlite';

// Creates or opens the local database file automatically using Node's native engine!
const db = new DatabaseSync('game.db');

// Set SQLite performance mode using standard SQL
db.exec('PRAGMA journal_mode = WAL;');

// Initialize database tables
export function initDatabase() {
  // Table for player profiles
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      discord_id TEXT PRIMARY KEY,
      gold INTEGER DEFAULT 100,
      stamina INTEGER DEFAULT 100,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table for anime heroes owned by players
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_id TEXT,
      hero_name TEXT,
      rarity TEXT,
      level INTEGER DEFAULT 1,
      FOREIGN KEY (discord_id) REFERENCES players(discord_id)
    )
  `);

  console.log('Database initialized successfully using native Node SQLite!');
}

export default db;