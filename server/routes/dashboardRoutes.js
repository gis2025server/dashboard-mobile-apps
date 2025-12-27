const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Get global dashboard statistics (admin only)
router.get('/stats', verifyAdmin, dashboardController.getDashboardStats);

// Get user-specific dashboard
router.get('/my-dashboard', dashboardController.getUserDashboard);

module.exports = router;
