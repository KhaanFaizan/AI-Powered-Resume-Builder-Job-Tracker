const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getSettings,
  updateSettings,
  updateProfile,
  updateNotifications,
  updatePrivacy,
  updatePreferences,
  updateSecurity,
  changePassword,
  exportData,
  deleteAccount
} = require('../controllers/settingsController');

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

// Profile validation
const profileValidation = [
  body('firstName').optional().isLength({ min: 1, max: 50 }).withMessage('First name must be between 1 and 50 characters'),
  body('lastName').optional().isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1 and 50 characters'),
  body('phone').optional().isLength({ min: 10, max: 20 }).withMessage('Phone number must be between 10 and 20 characters'),
  body('location').optional().isLength({ max: 100 }).withMessage('Location must be less than 100 characters'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('website').optional().isURL().withMessage('Website must be a valid URL'),
  body('linkedin').optional().isURL().withMessage('LinkedIn must be a valid URL'),
  body('github').optional().isURL().withMessage('GitHub must be a valid URL')
];

// Password validation
const passwordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

// Delete account validation
const deleteAccountValidation = [
  body('password').notEmpty().withMessage('Password is required to delete account')
];

// All routes are protected
router.use(auth);

// GET /api/settings - Get user settings
router.get('/', getSettings);

// PUT /api/settings - Update all settings
router.put('/', updateSettings);

// PUT /api/settings/profile - Update profile information
router.put('/profile', profileValidation, validateRequest, updateProfile);

// PUT /api/settings/notifications - Update notification preferences
router.put('/notifications', updateNotifications);

// PUT /api/settings/privacy - Update privacy settings
router.put('/privacy', updatePrivacy);

// PUT /api/settings/preferences - Update application preferences
router.put('/preferences', updatePreferences);

// PUT /api/settings/security - Update security settings
router.put('/security', updateSecurity);

// PUT /api/settings/password - Change password
router.put('/password', passwordValidation, validateRequest, changePassword);

// GET /api/settings/export - Export user data
router.get('/export', exportData);

// DELETE /api/settings/account - Delete account
router.delete('/account', deleteAccountValidation, validateRequest, deleteAccount);

module.exports = router;
