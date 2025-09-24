const User = require('../models/User');
const Job = require('../models/Job');
const UserSettings = require('../models/UserSettings');
const mongoose = require('mongoose');

// Get admin dashboard overview
const getDashboardOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalJobs,
      recentUsers,
      recentJobs,
      userGrowth,
      jobStats
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Job.countDocuments(),
      User.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email createdAt lastLogin'),
      Job.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
        .select('company role status createdAt'),
      User.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]),
      Job.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const overview = {
      totalUsers,
      activeUsers,
      totalJobs,
      recentUsers,
      recentJobs,
      userGrowth,
      jobStats,
      systemHealth: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        timestamp: new Date()
      }
    };

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard overview',
      error: error.message
    });
  }
};

// Get all users with pagination and filters
const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      isActive = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (isActive !== '') {
      query.isActive = isActive === 'true';
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .select('-password')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get user details
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's jobs
    const userJobs = await Job.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user's settings
    const userSettings = await UserSettings.findOne({ user: userId });

    // Get user activity stats
    const jobStats = await Job.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        user,
        jobs: userJobs,
        settings: userSettings,
        jobStats
      }
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details',
      error: error.message
    });
  }
};

// Update user status (activate/deactivate)
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deactivating the only admin
    if (user.role === 'admin' && !isActive) {
      const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate the only admin user'
        });
      }
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user: user.toJSON() }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

// Promote user to admin
const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if promotion is allowed
    const canPromote = await User.canPromoteToAdmin();
    if (!canPromote) {
      return res.status(403).json({
        success: false,
        message: 'Only one admin is allowed. An admin already exists.'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User is already an admin'
      });
    }

    user.role = 'admin';
    user.adminPromotedBy = req.user.id;
    user.adminPromotedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'User promoted to admin successfully',
      data: { user: user.toJSON() }
    });
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to promote user to admin',
      error: error.message
    });
  }
};

// Demote admin to user
const demoteFromAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User is not an admin'
      });
    }

    // Check if this is the only admin
    const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
    if (adminCount <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot demote the only admin user'
      });
    }

    user.role = 'user';
    user.adminPromotedBy = null;
    user.adminPromotedAt = null;
    await user.save();

    res.json({
      success: true,
      message: 'Admin demoted to user successfully',
      data: { user: user.toJSON() }
    });
  } catch (error) {
    console.error('Error demoting admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to demote admin',
      error: error.message
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting the only admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the only admin user'
        });
      }
    }

    // Delete user's data
    await UserSettings.deleteOne({ user: userId });
    await Job.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// Get system analytics
const getSystemAnalytics = async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    let startDate = new Date();
    switch (timeRange) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    const [
      userStats,
      jobStats,
      userGrowth,
      jobGrowth,
      topCompanies,
      systemHealth
    ] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: ['$isActive', 1, 0] } },
            admins: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } }
          }
        }
      ]),
      Job.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),
      Job.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),
      Job.aggregate([
        {
          $group: {
            _id: '$company',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date()
      }
    ]);

    res.json({
      success: true,
      data: {
        userStats: userStats[0] || { total: 0, active: 0, admins: 0 },
        jobStats,
        userGrowth,
        jobGrowth,
        topCompanies,
        systemHealth,
        timeRange
      }
    });
  } catch (error) {
    console.error('Error fetching system analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system analytics',
      error: error.message
    });
  }
};

// Get all jobs with filters
const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      company = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    if (company) {
      query.company = { $regex: company, $options: 'i' };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const jobs = await Job.find(query)
      .populate('user', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalJobs,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

// Get system logs (simplified version)
const getSystemLogs = async (req, res) => {
  try {
    // In a real application, you'd have a proper logging system
    const logs = [
      {
        id: 1,
        level: 'info',
        message: 'System started successfully',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        source: 'server'
      },
      {
        id: 2,
        level: 'info',
        message: 'New user registered',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        source: 'auth'
      },
      {
        id: 3,
        level: 'warning',
        message: 'High memory usage detected',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        source: 'system'
      }
    ];

    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching system logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system logs',
      error: error.message
    });
  }
};

module.exports = {
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
};
