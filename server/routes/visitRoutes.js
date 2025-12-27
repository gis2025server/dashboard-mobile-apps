const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { uploadExcel } = require('../utils/fileUpload');

// All routes require authentication
router.use(verifyToken);

// MD Visit routes
router.get('/md', visitController.getAllMdVisits);
router.get('/md/:id', visitController.getMdVisitById);
router.post('/md', verifyAdmin, visitController.addMdVisit);
router.put('/md/:id', verifyAdmin, visitController.editMdVisit);
router.delete('/md/:id', verifyAdmin, visitController.deleteMdVisit);
router.post('/md/upload-excel', verifyAdmin, uploadExcel.single('file'), visitController.uploadMdExcel);

// Sales Visit routes
router.get('/sales', visitController.getAllSalesVisits);
router.get('/sales/:id', visitController.getSalesVisitById);
router.post('/sales', verifyAdmin, visitController.addSalesVisit);
router.put('/sales/:id', verifyAdmin, visitController.editSalesVisit);
router.delete('/sales/:id', verifyAdmin, visitController.deleteSalesVisit);
router.post('/sales/upload-excel', verifyAdmin, uploadExcel.single('file'), visitController.uploadSalesExcel);

module.exports = router;
