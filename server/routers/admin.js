const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { requireAdmin, canPromoteToAdmin, requireOnlyAdmin } = require('../middleware/adminAuth');
const {
  getDashboardOverview,
  getUsers,
  getUserDetails,
  updateUserStatus,
  promoteToAdmin,
  demoteFromAdmin,
  deleteUser,
  getSystemAnalytics,
  getJobs,
  getSystemLogs
} = require('../controllers/adminController');

// Validation middleware
const validateRequest = (req, res, next) => {
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

// All admin routes require authentication and admin role
router.use(auth);
router.use(requireAdmin);

// Dashboard overview
router.get('/dashboard', getDashboardOverview);

// User management
router.get('/users', getUsers);
router.get('/users/:userId', getUserDetails);
router.put('/users/:userId/status', 
  [
    body('isActive').isBoolean().withMessage('isActive must be a boolean')
  ],
  validateRequest,
  updateUserStatus
);

// Admin promotion (only if no admin exists)
router.put('/users/:userId/promote', canPromoteToAdmin, promoteToAdmin);

// Admin demotion (only if more than one admin exists)
router.put('/users/:userId/demote', requireOnlyAdmin, demoteFromAdmin);

// Delete user (only if not the only admin)
router.delete('/users/:userId', requireOnlyAdmin, deleteUser);

// Analytics
router.get('/analytics', getSystemAnalytics);
router.get('/jobs', getJobs);

// System monitoring
router.get('/logs', getSystemLogs);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Admin API is healthy',
    timestamp: new Date(),
    admin: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

module.exports = router;
