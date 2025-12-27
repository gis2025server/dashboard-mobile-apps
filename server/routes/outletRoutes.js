const express = require('express');
const router = express.Router();
const outletController = require('../controllers/outletController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { uploadExcel } = require('../utils/fileUpload');

// All routes require authentication
router.use(verifyToken);

// Admin only routes
router.post('/', verifyAdmin, outletController.addOutlet);
router.put('/:id', verifyAdmin, outletController.editOutlet);
router.delete('/:id', verifyAdmin, outletController.deleteOutlet);
router.post('/upload-excel', verifyAdmin, uploadExcel.single('file'), outletController.uploadExcel);

// All authenticated users can view
router.get('/', outletController.getAllOutlets);
router.get('/:id', outletController.getOutletById);

module.exports = router;
