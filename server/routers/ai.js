const express = require('express');
const { body, validationResult } = require('express-validator');
const { analyzeResume, getAIStatus } = require('../controllers/aiController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules for AI analysis
const aiAnalysisValidation = [
  body('resumeText')
    .trim()
    .notEmpty()
    .withMessage('Resume text is required')
    .isLength({ min: 50, max: 5000 })
    .withMessage('Resume text must be between 50 and 5000 characters'),
  
  body('jobDescription')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 50, max: 3000 })
    .withMessage('Job description must be between 50 and 3000 characters')
];

// All routes are protected
router.use(auth);

// GET /api/ai/status - Check AI service status
router.get('/status', getAIStatus);

// POST /api/ai/analyze - Analyze resume against job description
router.post('/analyze', aiAnalysisValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  analyzeResume(req, res);
});

module.exports = router;
