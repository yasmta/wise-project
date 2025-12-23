import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'db', 'database.sqlite');
const dbDir = path.join(__dirname, 'db');

async function initDb() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  console.log('Creating tables...');

  // 0. Users
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT,
      password_hash TEXT,
      country TEXT,
      points INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 1. Consumption
  await db.exec(`
    CREATE TABLE IF NOT EXISTS consumption (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity TEXT,
      code TEXT,
      year INTEGER,
      tonnes REAL
    )
  `);

  // 2. Emissions
  await db.exec(`
    CREATE TABLE IF NOT EXISTS emissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity TEXT,
      code TEXT,
      year INTEGER,
      natural_emissions REAL,
      total_emissions REAL,
      anthropic_emissions REAL
    )
  `);

  // 3. Ozone Hole Surface
  await db.exec(`
    CREATE TABLE IF NOT EXISTS hole_surface (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER,
      max_area REAL,
      mean_area REAL
    )
  `);

  // 4. Stratospheric Concentration
  await db.exec(`
    CREATE TABLE IF NOT EXISTS ozone_concentration (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER,
      mean_concentration REAL,
      min_concentration REAL
    )
  `);

  // 5. Marine Dataset (Generic if needed, usually simple metrics)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS marine_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER,
      metric_name TEXT,
      value REAL
    )
  `);

  console.log('Tables created. Importing data...');

  const files = fs.readdirSync(dbDir).filter(f => f.endsWith('.xlsx'));

  for (const file of files) {
    const filePath = path.join(dbDir, file);
    const wb = XLSX.readFile(filePath);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet); // Array of objects

    if (file.includes('consumption')) {
      const stmt = await db.prepare('INSERT INTO consumption (entity, code, year, tonnes) VALUES (?, ?, ?, ?)');
      for (const row of data) {
        // Keys might vary slighty, using values assuming column order or trying key names based on analysis output
        // Based on analysis: Entity, Code, Year, Consumption...
        const keys = Object.keys(row);
        await stmt.run(row[keys[0]], row[keys[1]], row[keys[2]], row[keys[3]]);
      }
      await stmt.finalize();
      console.log(`Imported ${data.length} rows into 'consumption'`);
    }

    else if (file.includes('emissions')) {
      // Assuming: Entity, Code, Year, Natural, Total (or similar)
      // Adjust logic: Anthropic = Total - Natural usually, or it's a column
      const stmt = await db.prepare('INSERT INTO emissions (entity, code, year, natural_emissions, total_emissions) VALUES (?, ?, ?, ?, ?)');
      for (const row of data) {
        const keys = Object.keys(row);
        // Cautionary index usage
        await stmt.run(row[keys[0]], row[keys[1]], row[keys[2]], row[keys[3]], row[keys[4]]);
      }
      await stmt.finalize();
      console.log(`Imported ${data.length} rows into 'emissions'`);
    }

    else if (file.includes('ozone_hole_surface')) {
      const stmt = await db.prepare('INSERT INTO hole_surface (year, max_area, mean_area) VALUES (?, ?, ?)');
      for (const row of data) {
        const keys = Object.keys(row);
        // Detecting Year first
        await stmt.run(row[keys[0]], row[keys[1]], row[keys[2]]);
      }
      await stmt.finalize();
      console.log(`Imported ${data.length} rows into 'hole_surface'`);
    }

    else if (file.includes('concentration')) {
      const stmt = await db.prepare('INSERT INTO ozone_concentration (year, mean_concentration, min_concentration) VALUES (?, ?, ?)');
      for (const row of data) {
        const keys = Object.keys(row);
        await stmt.run(row[keys[0]], row[keys[1]], row[keys[2]]);
      }
      await stmt.finalize();
      console.log(`Imported ${data.length} rows into 'ozone_concentration'`);
    }
  }

  console.log('Database populated successfully.');
}

initDb().catch(err => {
  console.error(err);
});
