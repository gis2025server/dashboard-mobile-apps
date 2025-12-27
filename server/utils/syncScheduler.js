const cron = require('node-cron');
const { getDatabase, runQuery, getRow, getAllRows } = require('../database/init');

// Sync function to mark records as synced
async function performSync() {
  try {
    console.log('Starting scheduled sync at:', new Date().toISOString());

    const tables = ['datauser', 'dataoutlet', 'datavisitmd', 'datavisitsales', 'visitaction'];
    let totalSynced = 0;

    for (const tableName of tables) {
      try {
        const db = getDatabase(tableName);
        
        // Update synced_at timestamp for all records
        const result = await runQuery(
          db,
          `UPDATE ${tableName} SET synced_at = CURRENT_TIMESTAMP WHERE synced_at IS NULL OR synced_at < updated_at`,
          []
        );

        totalSynced += result.changes;
        console.log(`Synced ${result.changes} records in ${tableName}`);
      } catch (error) {
        console.error(`Error syncing ${tableName}:`, error);
      }
    }

    // Log sync activity
    try {
      const syncLogDb = getDatabase('synclog');
      await runQuery(
        syncLogDb,
        'INSERT INTO synclog (sync_type, table_name, record_count, status, message) VALUES (?, ?, ?, ?, ?)',
        ['scheduled', 'all', totalSynced, 'success', `Synced ${totalSynced} total records`]
      );
    } catch (error) {
      console.error('Error logging sync:', error);
    }

    console.log(`Scheduled sync completed. Total records synced: ${totalSynced}`);
    
    return {
      success: true,
      recordsSynced: totalSynced
    };
  } catch (error) {
    console.error('Sync error:', error);
    
    // Log sync error
    try {
      const syncLogDb = getDatabase('synclog');
      await runQuery(
        syncLogDb,
        'INSERT INTO synclog (sync_type, table_name, record_count, status, message) VALUES (?, ?, ?, ?, ?)',
        ['scheduled', 'all', 0, 'error', error.message]
      );
    } catch (logError) {
      console.error('Error logging sync error:', logError);
    }

    return {
      success: false,
      error: error.message
    };
  }
}

// Initialize sync scheduler
function initSyncScheduler() {
  // Schedule sync at 12:00 (noon)
  const schedule1 = process.env.SYNC_SCHEDULE_1 || '0 12 * * *';
  cron.schedule(schedule1, () => {
    console.log('Running scheduled sync at 12:00');
    performSync();
  });

  // Schedule sync at 18:00 (6 PM)
  const schedule2 = process.env.SYNC_SCHEDULE_2 || '0 18 * * *';
  cron.schedule(schedule2, () => {
    console.log('Running scheduled sync at 18:00');
    performSync();
  });

  console.log('Sync scheduler initialized');
  console.log(`Sync will run at: ${schedule1} and ${schedule2}`);
}

// Manual sync trigger (for API endpoint)
async function triggerManualSync() {
  console.log('Manual sync triggered');
  return await performSync();
}

// Get sync logs
async function getSyncLogs(limit = 50) {
  try {
    const db = getDatabase('synclog');
    const logs = await getAllRows(
      db,
      'SELECT * FROM synclog ORDER BY sync_time DESC LIMIT ?',
      [limit]
    );

    return {
      success: true,
      data: logs
    };
  } catch (error) {
    console.error('Get sync logs error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  initSyncScheduler,
  triggerManualSync,
  getSyncLogs,
  performSync
};
