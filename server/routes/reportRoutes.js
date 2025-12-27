const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Get daily report
router.get('/daily', reportController.getDailyReport);

// Export report to Excel
router.get('/export', reportController.exportReport);

// Get report summary
router.get('/summary', reportController.getReportSummary);

module.exports = router;
