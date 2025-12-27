const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateLogin, validateAuthUser } = require('../middleware/validation');

// Public routes
// Login (with rate limiting and validation)
router.post('/login', authLimiter, validateLogin, authController.login);

// Protected routes (admin only)
// Get all login users
router.get('/users', verifyToken, verifyAdmin, authController.getAllUsers);

// Add login user
router.post('/users', verifyToken, verifyAdmin, validateAuthUser, authController.addUser);

// Edit login user
router.put('/users/:id', verifyToken, verifyAdmin, validateAuthUser, authController.editUser);

// Delete login user
router.delete('/users/:id', verifyToken, verifyAdmin, authController.deleteUser);

module.exports = router;
