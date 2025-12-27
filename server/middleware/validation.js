const { body, param, query, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Login validation
const validateLogin = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores and hyphens'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

// User creation/update validation
const validateUser = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores and hyphens'),
  body('nama')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('jabatan')
    .optional()
    .trim()
    .isIn(['MD', 'Sales', 'Admin']).withMessage('Invalid job position'),
  body('amo')
    .optional()
    .trim()
    .matches(/^[A-Z0-9-]+$/).withMessage('Invalid AMO format'),
  body('warehouse')
    .optional()
    .trim()
    .matches(/^[A-Z0-9-]+$/).withMessage('Invalid warehouse format'),
  validate
];

// Outlet validation
const validateOutlet = [
  body('idoutlet')
    .optional()
    .trim()
    .matches(/^[A-Z0-9-]+$/).withMessage('Invalid outlet ID format'),
  body('namaoutlet')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Outlet name must be between 2 and 200 characters'),
  body('alamatoutlet')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 }).withMessage('Address must be between 5 and 500 characters'),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  validate
];

// Visit validation
const validateVisit = [
  body('username')
    .optional()
    .trim()
    .notEmpty().withMessage('Username is required'),
  body('idoutlet')
    .optional()
    .trim()
    .notEmpty().withMessage('Outlet ID is required'),
  body('datevisit')
    .optional()
    .isISO8601().withMessage('Invalid date format (use YYYY-MM-DD)'),
  validate
];

// Visit action validation
const validateVisitAction = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required'),
  body('idoutlet')
    .trim()
    .notEmpty().withMessage('Outlet ID is required'),
  body('visit_type')
    .optional()
    .isIn(['md', 'sales']).withMessage('Visit type must be either "md" or "sales"'),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('posm_status')
    .optional()
    .isIn(['terpasang', 'outlet tidak ada', 'toko tutup']).withMessage('Invalid POSM status'),
  validate
];

// ID parameter validation
const validateId = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid ID'),
  validate
];

// Date query validation
const validateDateQuery = [
  query('date')
    .optional()
    .isISO8601().withMessage('Invalid date format (use YYYY-MM-DD)'),
  query('startDate')
    .optional()
    .isISO8601().withMessage('Invalid start date format (use YYYY-MM-DD)'),
  query('endDate')
    .optional()
    .isISO8601().withMessage('Invalid end date format (use YYYY-MM-DD)'),
  validate
];

// Auth user validation
const validateAuthUser = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores and hyphens'),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('access_level')
    .optional()
    .isIn(['admin', 'user']).withMessage('Access level must be either "admin" or "user"'),
  validate
];

// Sanitize input to prevent XSS and SQL injection
const sanitizeInput = (req, res, next) => {
  // Remove any potential SQL injection patterns
  const dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(--|;|\/\*|\*\/|xp_|sp_)/gi,
    /(<script|<iframe|javascript:|onerror=|onload=)/gi
  ];

  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Check for dangerous patterns
        for (let pattern of dangerousPatterns) {
          if (pattern.test(obj[key])) {
            return res.status(400).json({
              success: false,
              message: 'Invalid input detected'
            });
          }
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);

  next();
};

module.exports = {
  validate,
  validateLogin,
  validateUser,
  validateOutlet,
  validateVisit,
  validateVisitAction,
  validateId,
  validateDateQuery,
  validateAuthUser,
  sanitizeInput
};
