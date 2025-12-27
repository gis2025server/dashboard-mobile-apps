// Database Schema Definitions

const schemas = {
  // Menu Login Table
  menulogin: `
    CREATE TABLE IF NOT EXISTS menulogin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      access_level TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,

  // Data User Table
  datauser: `
    CREATE TABLE IF NOT EXISTS datauser (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      nama TEXT NOT NULL,
      jabatan TEXT NOT NULL,
      amo TEXT NOT NULL,
      warehouse TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      synced_at DATETIME
    )
  `,

  // Data Outlet Table
  dataoutlet: `
    CREATE TABLE IF NOT EXISTS dataoutlet (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      amo TEXT NOT NULL,
      warehouse TEXT NOT NULL,
      idoutlet TEXT UNIQUE NOT NULL,
      namaoutlet TEXT NOT NULL,
      alamatoutlet TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      synced_at DATETIME
    )
  `,

  // Data Visit MD Table
  datavisitmd: `
    CREATE TABLE IF NOT EXISTS datavisitmd (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      amo TEXT NOT NULL,
      warehouse TEXT NOT NULL,
      idoutlet TEXT NOT NULL,
      namaoutlet TEXT NOT NULL,
      datevisit DATE NOT NULL,
      status TEXT DEFAULT 'scheduled',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      synced_at DATETIME,
      FOREIGN KEY (idoutlet) REFERENCES dataoutlet(idoutlet)
    )
  `,

  // Data Visit Sales Table
  datavisitsales: `
    CREATE TABLE IF NOT EXISTS datavisitsales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      amo TEXT NOT NULL,
      warehouse TEXT NOT NULL,
      idoutlet TEXT NOT NULL,
      namaoutlet TEXT NOT NULL,
      datevisit DATE NOT NULL,
      status TEXT DEFAULT 'scheduled',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      synced_at DATETIME,
      FOREIGN KEY (idoutlet) REFERENCES dataoutlet(idoutlet)
    )
  `,

  // Visit Action Table
  visitaction: `
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
  `,

  // Sync Log Table (for tracking synchronization)
  synclog: `
    CREATE TABLE IF NOT EXISTS synclog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sync_type TEXT NOT NULL,
      table_name TEXT NOT NULL,
      record_count INTEGER DEFAULT 0,
      status TEXT NOT NULL,
      message TEXT,
      sync_time DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `
};

module.exports = { schemas };
