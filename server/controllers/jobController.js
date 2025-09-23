const Job = require('../models/Job');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

// Get all jobs for a user
const getJobs = async (req, res) => {
  try {
    const { status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const userId = req.user.id;

    console.log('Job query params:', { status, sortBy, sortOrder, userId });

    let query = { user: userId };
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    console.log('Sort object:', sort);

    const jobs = await Job.find(query)
      .sort(sort)
      .select('-__v');

    // Add virtual fields
    const jobsWithVirtuals = jobs.map(job => ({
      ...job.toObject(),
      daysUntilDeadline: job.daysUntilDeadline
    }));

    res.json({
      success: true,
      count: jobs.length,
      data: jobsWithVirtuals
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs',
      error: error.message
    });
  }
};

// Get a single job by ID
const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const job = await Job.findOne({ _id: jobId, user: userId });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...job.toObject(),
        daysUntilDeadline: job.daysUntilDeadline
      }
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching job',
      error: error.message
    });
  }
};

// Create a new job application
const createJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const jobData = {
      ...req.body,
      user: req.user.id
    };

    const job = new Job(jobData);
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job application created successfully',
      data: {
        ...job.toObject(),
        daysUntilDeadline: job.daysUntilDeadline
      }
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating job',
      error: error.message
    });
  }
};

// Update a job application
const updateJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const jobId = req.params.id;
    const userId = req.user.id;

    const job = await Job.findOneAndUpdate(
      { _id: jobId, user: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      message: 'Job application updated successfully',
      data: {
        ...job.toObject(),
        daysUntilDeadline: job.daysUntilDeadline
      }
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating job',
      error: error.message
    });
  }
};

// Delete a job application
const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const job = await Job.findOneAndDelete({ _id: jobId, user: userId });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      message: 'Job application deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting job',
      error: error.message
    });
  }
};

// Get job statistics for dashboard
const getJobStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Job.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgMatchPercentage: { $avg: '$matchPercentage' }
        }
      }
    ]);

    const totalJobs = await Job.countDocuments({ user: userId });
    const recentJobs = await Job.find({ user: userId })
      .sort({ applicationDate: -1 })
      .limit(5)
      .select('company role status applicationDate');

    // Calculate overall match percentage
    const matchStats = await Job.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          avgMatchPercentage: { $avg: '$matchPercentage' }
        }
      }
    ]);

    const overallMatchPercentage = matchStats.length > 0 ? 
      Math.round(matchStats[0].avgMatchPercentage) : 0;

    res.json({
      success: true,
      data: {
        totalJobs,
        overallMatchPercentage,
        statusBreakdown: stats,
        recentJobs
      }
    });
  } catch (error) {
    console.error('Error fetching job stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching job statistics',
      error: error.message
    });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobStats
};
