const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Job role is required'],
    trim: true,
    maxlength: [100, 'Job role cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Rejected', 'Hired'],
    default: 'Applied',
    required: true
  },
  deadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  matchPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  salary: {
    type: String,
    trim: true,
    maxlength: [50, 'Salary cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  interviewDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  jobUrl: {
    type: String,
    trim: true
  },
  contactPerson: {
    type: String,
    trim: true,
    maxlength: [100, 'Contact person name cannot exceed 100 characters']
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  }
}, {
  timestamps: true
});

// Index for better query performance
jobSchema.index({ user: 1, status: 1 });
jobSchema.index({ user: 1, deadline: 1 });

// Virtual for days until deadline
jobSchema.virtual('daysUntilDeadline').get(function() {
  const now = new Date();
  const deadline = new Date(this.deadline);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure virtual fields are serialized
jobSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
