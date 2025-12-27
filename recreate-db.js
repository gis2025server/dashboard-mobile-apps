const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DB_PATH = './databases';
const dbFile = path.join(DB_PATH, 'visitaction.db');

console.log('Recreating visitaction database with updated schema...');

// Delete the old database file if it exists
if (fs.existsSync(dbFile)) {
  try {
    fs.unlinkSync(dbFile);
    console.log('✓ Old visitaction.db deleted');
  } catch (error) {
    console.error('Error deleting old database:', error.message);
    console.log('Please stop the server first (Ctrl+C) and run this script again.');
    process.exit(1);
  }
}

// Create new database with updated schema
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  }
  console.log('✓ Connected to visitaction database');
});

const schema = `
  CREATE TABLE IF NOT EXISTS visitaction (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visit_id INTEGER NOT NULL,
    visit_type TEXT NOT NULL,
    username TEXT NOT NULL,
    nama_md TEXT NOT NULL,
    amo TEXT,
    warehouse TEXT,
    idoutlet TEXT NOT NULL,
    namaoutlet TEXT NOT NULL,
    alamatoutlet TEXT NOT NULL,
    outlet_latitude REAL NOT NULL,
    outlet_longitude REAL NOT NULL,
    checkin_latitude REAL,
    checkin_longitude REAL,
    checkin_time DATETIME,
    checkout_latitude REAL,
    checkout_longitude REAL,
    checkout_time DATETIME,
    dokumentasi_before TEXT,
    dokumentasi_after TEXT,
    status_posm TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    synced_at DATETIME
  )
`;

db.run(schema, (err) => {
  if (err) {
    console.error('Error creating table:', err);
    process.exit(1);
  }
  console.log('✓ visitaction table created with updated schema');
  console.log('\nDatabase recreation complete!');
  console.log('You can now restart the server and run tests again.');
  
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    }
    process.exit(0);
  });
});
