const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadPath = process.env.UPLOAD_PATH || './uploads';
const excelPath = process.env.EXCEL_UPLOAD_PATH || './uploads/excel';
const imagePath = process.env.IMAGE_UPLOAD_PATH || './uploads/images';

[uploadPath, excelPath, imagePath].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration for Excel files
const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, excelPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'excel-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage configuration for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagePath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for Excel files
const excelFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files (.xls, .xlsx) are allowed'), false);
  }
};

// File filter for images
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (.jpg, .jpeg, .png) are allowed'), false);
  }
};

// Multer upload configurations
const uploadExcel = multer({
  storage: excelStorage,
  fileFilter: excelFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = {
  uploadExcel,
  uploadImage
};
