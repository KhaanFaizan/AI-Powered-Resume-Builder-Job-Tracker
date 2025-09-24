const User = require('../models/User');

// Check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Check if admin is still active
    const admin = await User.findById(req.user.id);
    if (!admin || !admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is inactive'
      });
    }

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Check if user can be promoted to admin (only if no admin exists)
const canPromoteToAdmin = async (req, res, next) => {
  try {
    const canPromote = await User.canPromoteToAdmin();
    
    if (!canPromote) {
      return res.status(403).json({
        success: false,
        message: 'Only one admin is allowed. An admin already exists.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin promotion check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking admin promotion eligibility'
    });
  }
};

// Check if current user is the only admin (for demotion protection)
const requireOnlyAdmin = async (req, res, next) => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    if (adminCount <= 1) {
      return res.status(403).json({
        success: false,
        message: 'Cannot perform this action. At least one admin must remain.'
      });
    }

    next();
  } catch (error) {
    console.error('Only admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking admin count'
    });
  }
};

module.exports = {
  requireAdmin,
  canPromoteToAdmin,
  requireOnlyAdmin
};
