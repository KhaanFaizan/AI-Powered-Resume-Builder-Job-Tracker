const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Profile Settings
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500
    },
    website: {
      type: String,
      trim: true,
      maxlength: 200
    },
    linkedin: {
      type: String,
      trim: true,
      maxlength: 200
    },
    github: {
      type: String,
      trim: true,
      maxlength: 200
    }
  },

  // Notification Preferences
  notifications: {
    email: {
      jobAlerts: { type: Boolean, default: true },
      applicationUpdates: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    push: {
      jobAlerts: { type: Boolean, default: true },
      applicationUpdates: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true }
    }
  },

  // Privacy Settings
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'private', 'connections'],
      default: 'private'
    },
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false },
    allowMessages: { type: Boolean, default: true }
  },

  // Application Preferences
  preferences: {
    defaultJobStatus: {
      type: String,
      enum: ['Applied', 'Interview', 'Rejected', 'Hired'],
      default: 'Applied'
    },
    autoSave: { type: Boolean, default: true },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    dateFormat: {
      type: String,
      enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
      default: 'MM/DD/YYYY'
    }
  },

  // Security Settings
  security: {
    twoFactorEnabled: { type: Boolean, default: false },
    loginNotifications: { type: Boolean, default: true },
    sessionTimeout: {
      type: Number,
      default: 30, // minutes
      min: 5,
      max: 480
    }
  },

  // Data & Export
  data: {
    lastExport: Date,
    exportFormat: {
      type: String,
      enum: ['json', 'csv', 'pdf'],
      default: 'json'
    },
    autoBackup: { type: Boolean, default: false },
    retentionPeriod: {
      type: Number,
      default: 365, // days
      min: 30,
      max: 1095
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
userSettingsSchema.index({ user: 1 });

// Virtual for full name
userSettingsSchema.virtual('profile.fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.profile.firstName || this.profile.lastName || '';
});

// Ensure virtual fields are serialized
userSettingsSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('UserSettings', userSettingsSchema);
