import Database from 'better-sqlite3';

// Creates or opens the local database file automatically
const db = new Database('game.db');

// Set SQLite performance and safety settings
db.pragma('journal_mode= WAL');

export function initDatabase() { 
    // able for player profiles
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

  console.log('DataBase initialized Successfully!');
}

export default db;