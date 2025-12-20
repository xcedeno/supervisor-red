import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB
const dbPath = path.join(__dirname, 'devices.db');
const db = new Database(dbPath);

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    ip TEXT NOT NULL,
    torre TEXT NOT NULL
  )
`);

export const getAllDevices = () => {
    return db.prepare('SELECT * FROM devices').all();
};

export const addDevice = (device) => {
    const stmt = db.prepare('INSERT INTO devices (id, name, ip, torre) VALUES (?, ?, ?, ?)');
    return stmt.run(device.id, device.name, device.ip, device.torre);
};

export const getDeviceById = (id) => {
    return db.prepare('SELECT * FROM devices WHERE id = ?').get(id);
};

// Migration helper: Import from legacy JSON if DB is empty
export const importFromJSON = () => {
    const jsonPath = path.join(__dirname, 'public', 'devices.json');
    if (fs.existsSync(jsonPath)) {
        const count = db.prepare('SELECT count(*) as count FROM devices').get().count;
        if (count === 0) {
            console.log('Migrating data from devices.json to SQLite...');
            try {
                const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
                if (Array.isArray(data)) {
                    const insert = db.prepare('INSERT OR IGNORE INTO devices (id, name, ip, torre) VALUES (?, ?, ?, ?)');
                    const importTransaction = db.transaction((devices) => {
                        for (const device of devices) {
                            if (device.id && device.name && device.ip && device.torre) {
                                insert.run(device.id, device.name, device.ip, device.torre);
                            }
                        }
                    });
                    importTransaction(data);
                    console.log(`Migrated ${data.length} devices.`);

                    // Optional: Rename JSON to avoid confusion, or keep as backup
                    // fs.renameSync(jsonPath, jsonPath + '.bak'); 
                }
            } catch (err) {
                console.error('Migration failed:', err);
            }
        }
    }
};

// Auto-run migration
importFromJSON();

export default db;
