const express = require('express');
const { body } = require('express-validator');
const { getJobs, getJobById, createJob, updateJob, deleteJob, getJobStats } = require('../controllers/jobController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules for job creation/update
const jobValidation = [
  body('company')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  
  body('role')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Job role cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Job role cannot exceed 100 characters'),
  
  body('status')
    .optional()
    .isIn(['Applied', 'Interview', 'Rejected', 'Hired'])
    .withMessage('Status must be one of: Applied, Interview, Rejected, Hired'),
  
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Deadline must be a valid date')
    .custom((value) => {
      if (value) {
        const deadline = new Date(value);
        const now = new Date();
        if (deadline < now) {
          throw new Error('Deadline cannot be in the past');
        }
      }
      return true;
    }),
  
  body('matchPercentage')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Match percentage must be between 0 and 100'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  
  body('salary')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Salary cannot exceed 50 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('interviewDate')
    .optional()
    .isISO8601()
    .withMessage('Interview date must be a valid date'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  
  body('jobUrl')
    .optional()
    .isURL()
    .withMessage('Job URL must be a valid URL'),
  
  body('contactPerson')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Contact person name cannot exceed 100 characters'),
  
  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Contact email must be a valid email address')
    .normalizeEmail()
];

// All routes are protected
router.use(auth);

// GET /api/jobs - Get all jobs for the authenticated user
router.get('/', getJobs);

// GET /api/jobs/stats - Get job statistics
router.get('/stats', getJobStats);

// GET /api/jobs/:id - Get a single job
router.get('/:id', getJobById);

// POST /api/jobs - Create a new job
router.post('/', jobValidation, createJob);

// PUT /api/jobs/:id - Update a job
router.put('/:id', jobValidation, updateJob);

// PATCH /api/jobs/:id/status - Update only job status
router.patch('/:id/status', [
  body('status')
    .isIn(['Applied', 'Interview', 'Rejected', 'Hired'])
    .withMessage('Status must be one of: Applied, Interview, Rejected, Hired')
], updateJob);

// DELETE /api/jobs/:id - Delete a job
router.delete('/:id', deleteJob);

module.exports = router;
