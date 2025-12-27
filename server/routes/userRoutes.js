const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { uploadExcel } = require('../utils/fileUpload');

// All routes require authentication
router.use(verifyToken);

// Admin only routes
router.post('/', verifyAdmin, userController.addUser);
router.put('/:id', verifyAdmin, userController.editUser);
router.delete('/:id', verifyAdmin, userController.deleteUser);
router.post('/upload-excel', verifyAdmin, uploadExcel.single('file'), userController.uploadExcel);

// All authenticated users can view
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

module.exports = router;
