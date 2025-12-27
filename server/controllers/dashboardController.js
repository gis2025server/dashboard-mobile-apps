const { getDatabase, runQuery, getRow, getAllRows } = require('../database/init');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const userDb = getDatabase('datauser');
    const outletDb = getDatabase('dataoutlet');
    const visitMdDb = getDatabase('datavisitmd');
    const visitSalesDb = getDatabase('datavisitsales');
    const actionDb = getDatabase('visitaction');

    // Get counts
    const totalUsers = await getRow(userDb, 'SELECT COUNT(*) as count FROM datauser', []);
    const totalOutlets = await getRow(outletDb, 'SELECT COUNT(*) as count FROM dataoutlet', []);
    
    // MD Visit stats
    const totalMdVisits = await getRow(visitMdDb, 'SELECT COUNT(*) as count FROM datavisitmd', []);
    const completedMdVisits = await getRow(visitMdDb, "SELECT COUNT(*) as count FROM datavisitmd WHERE status = 'completed'", []);
    const scheduledMdVisits = await getRow(visitMdDb, "SELECT COUNT(*) as count FROM datavisitmd WHERE status = 'scheduled'", []);
    
    // Sales Visit stats
    const totalSalesVisits = await getRow(visitSalesDb, 'SELECT COUNT(*) as count FROM datavisitsales', []);
    const completedSalesVisits = await getRow(visitSalesDb, "SELECT COUNT(*) as count FROM datavisitsales WHERE status = 'completed'", []);
    const scheduledSalesVisits = await getRow(visitSalesDb, "SELECT COUNT(*) as count FROM datavisitsales WHERE status = 'scheduled'", []);

    // Visit actions
    const totalVisitActions = await getRow(actionDb, 'SELECT COUNT(*) as count FROM visitaction', []);
    const completedActions = await getRow(actionDb, 'SELECT COUNT(*) as count FROM visitaction WHERE checkout_time IS NOT NULL', []);

    // Get recent activities
    const recentActions = await getAllRows(
      actionDb,
      'SELECT * FROM visitaction ORDER BY created_at DESC LIMIT 10',
      []
    );

    // Get visits by date (last 7 days)
    const mdVisitsByDate = await getAllRows(
      visitMdDb,
      `SELECT DATE(datevisit) as date, COUNT(*) as count 
       FROM datavisitmd 
       WHERE datevisit >= DATE('now', '-7 days')
       GROUP BY DATE(datevisit)
       ORDER BY date`,
      []
    );

    const salesVisitsByDate = await getAllRows(
      visitSalesDb,
      `SELECT DATE(datevisit) as date, COUNT(*) as count 
       FROM datavisitsales 
       WHERE datevisit >= DATE('now', '-7 days')
       GROUP BY DATE(datevisit)
       ORDER BY date`,
      []
    );

    // Get visits by warehouse
    const mdVisitsByWarehouse = await getAllRows(
      visitMdDb,
      `SELECT warehouse, COUNT(*) as count 
       FROM datavisitmd 
       GROUP BY warehouse`,
      []
    );

    const salesVisitsByWarehouse = await getAllRows(
      visitSalesDb,
      `SELECT warehouse, COUNT(*) as count 
       FROM datavisitsales 
       GROUP BY warehouse`,
      []
    );

    // Get POSM status distribution
    const posmStats = await getAllRows(
      actionDb,
      `SELECT status_posm, COUNT(*) as count 
       FROM visitaction 
       WHERE status_posm IS NOT NULL
       GROUP BY status_posm`,
      []
    );

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers: totalUsers.count,
          totalOutlets: totalOutlets.count,
          totalMdVisits: totalMdVisits.count,
          completedMdVisits: completedMdVisits.count,
          scheduledMdVisits: scheduledMdVisits.count,
          totalSalesVisits: totalSalesVisits.count,
          completedSalesVisits: completedSalesVisits.count,
          scheduledSalesVisits: scheduledSalesVisits.count,
          totalVisitActions: totalVisitActions.count,
          completedActions: completedActions.count
        },
        charts: {
          mdVisitsByDate,
          salesVisitsByDate,
          mdVisitsByWarehouse,
          salesVisitsByWarehouse,
          posmStats
        },
        recentActivities: recentActions
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard statistics',
      error: error.message
    });
  }
};

// Get user-specific dashboard
const getUserDashboard = async (req, res) => {
  try {
    const { username } = req.user;

    const visitMdDb = getDatabase('datavisitmd');
    const visitSalesDb = getDatabase('datavisitsales');
    const actionDb = getDatabase('visitaction');

    // Get user's visits
    const myMdVisits = await getAllRows(
      visitMdDb,
      'SELECT * FROM datavisitmd WHERE username = ? ORDER BY datevisit DESC LIMIT 10',
      [username]
    );

    const mySalesVisits = await getAllRows(
      visitSalesDb,
      'SELECT * FROM datavisitsales WHERE username = ? ORDER BY datevisit DESC LIMIT 10',
      [username]
    );

    // Get user's visit actions
    const myActions = await getAllRows(
      actionDb,
      'SELECT * FROM visitaction WHERE username = ? ORDER BY created_at DESC LIMIT 10',
      [username]
    );

    // Get user's stats
    const myMdVisitsCount = await getRow(
      visitMdDb,
      'SELECT COUNT(*) as count FROM datavisitmd WHERE username = ?',
      [username]
    );

    const mySalesVisitsCount = await getRow(
      visitSalesDb,
      'SELECT COUNT(*) as count FROM datavisitsales WHERE username = ?',
      [username]
    );

    const myCompletedVisits = await getRow(
      actionDb,
      'SELECT COUNT(*) as count FROM visitaction WHERE username = ? AND checkout_time IS NOT NULL',
      [username]
    );

    const myTodayVisits = await getRow(
      actionDb,
      "SELECT COUNT(*) as count FROM visitaction WHERE username = ? AND DATE(created_at) = DATE('now')",
      [username]
    );

    res.json({
      success: true,
      data: {
        stats: {
          myMdVisitsCount: myMdVisitsCount.count,
          mySalesVisitsCount: mySalesVisitsCount.count,
          myCompletedVisits: myCompletedVisits.count,
          myTodayVisits: myTodayVisits.count
        },
        myMdVisits,
        mySalesVisits,
        myActions
      }
    });
  } catch (error) {
    console.error('Get user dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user dashboard',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getUserDashboard
};
