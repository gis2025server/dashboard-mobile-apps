const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { triggerManualSync, getSyncLogs } = require('../utils/syncScheduler');

// All routes require authentication
router.use(verifyToken);

// Trigger manual sync (admin only)
router.post('/trigger', verifyAdmin, (req, res) => {
  try {
    const result = triggerManualSync();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to trigger sync',
      error: error.message
    });
  }
});

// Get sync logs (admin only)
router.get('/logs', verifyAdmin, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const result = getSyncLogs(limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get sync logs',
      error: error.message
    });
  }
});

module.exports = router;
