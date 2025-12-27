const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const outletRoutes = require('./outletRoutes');
const visitRoutes = require('./visitRoutes');
const visitActionRoutes = require('./visitActionRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const reportRoutes = require('./reportRoutes');
const syncRoutes = require('./syncRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/outlets', outletRoutes);
router.use('/visits', visitRoutes);
router.use('/visit-actions', visitActionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);
router.use('/sync', syncRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
