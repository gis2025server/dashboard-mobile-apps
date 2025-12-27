const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { schemas } = require('./schema');

const DB_PATH = process.env.DB_PATH || './databases';

// Ensure database directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// Database connections cache
const databases = {};

// Get or create database connection
function getDatabase(dbName) {
  if (!databases[dbName]) {
    const dbPath = path.join(DB_PATH, `${dbName}.db`);
    databases[dbName] = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error(`Error opening database ${dbName}:`, err);
      } else {
        console.log(`Connected to ${dbName} database`);
      }
    });
  }
  return databases[dbName];
}

// Execute query with promise wrapper
function runQuery(db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

// Get single row
function getRow(db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Get all rows
function getAllRows(db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Initialize all databases
async function initializeDatabase() {
  try {
    console.log('Initializing databases...');

    // Create all database tables
    for (const [dbName, schema] of Object.entries(schemas)) {
      const db = getDatabase(dbName);
      await runQuery(db, schema);
      console.log(`✓ ${dbName} table created`);
    }

    // Create default admin user
    const loginDb = getDatabase('menulogin');
    const adminUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin-gis';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'gis2026';

    const existingAdmin = await getRow(
      loginDb,
      'SELECT * FROM menulogin WHERE username = ?',
      [adminUsername]
    );

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await runQuery(
        loginDb,
        'INSERT INTO menulogin (username, password, access_level) VALUES (?, ?, ?)',
        [adminUsername, hashedPassword, 'admin']
      );
      console.log(`✓ Default admin user created: ${adminUsername}`);
    } else {
      console.log(`✓ Admin user already exists: ${adminUsername}`);
    }

    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Close all database connections
function closeDatabases() {
  Object.keys(databases).forEach(dbName => {
    databases[dbName].close((err) => {
      if (err) {
        console.error(`Error closing ${dbName}:`, err);
      } else {
        console.log(`${dbName} database closed`);
      }
    });
  });
}

module.exports = {
  getDatabase,
  initializeDatabase,
  closeDatabases,
  runQuery,
  getRow,
  getAllRows
};
