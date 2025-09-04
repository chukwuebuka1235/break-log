import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export async function openDb() {
    return open({
        filename: './breaks.db',
        driver: sqlite3.Database
    })
}
export async function initDb() {
    const db = await openDb()
    await db.exec(`
      CREATE TABLE IF NOT EXISTS breaks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employeeName TEXT NOT NULL,
      breakStart DATETIME NOT NULL,
      breakEnd DATETIME,
      description TEXT
    )
  `);
    console.log("Database Initialized");
    await db.close();
}

initDb()