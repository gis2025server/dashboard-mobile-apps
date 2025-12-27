const express = require('express');
const router = express.Router();
const visitActionController = require('../controllers/visitActionController');
const { verifyToken } = require('../middleware/auth');
const { uploadImage } = require('../utils/fileUpload');

// All routes require authentication
router.use(verifyToken);

// Start visit - get scheduled visits for a user on a specific date
router.post('/start', visitActionController.startVisit);

// Check-in to a visit location
router.post('/checkin', visitActionController.checkIn);

// Upload documentation photos
router.post('/upload-photo', uploadImage.single('photo'), visitActionController.uploadPhoto);

// Update POSM status
router.post('/update-status', visitActionController.updateStatus);

// Check-out from visit
router.post('/checkout', visitActionController.checkOut);

// Get all visit actions
router.get('/', visitActionController.getAllVisitActions);

// Get visit action by ID
router.get('/:id', visitActionController.getVisitActionById);

// Get visit actions by username
router.get('/user/:username', visitActionController.getVisitActionsByUser);

module.exports = router;
