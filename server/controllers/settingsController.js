const UserSettings = require('../models/UserSettings');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get user settings
const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let settings = await UserSettings.findOne({ user: userId });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new UserSettings({ user: userId });
      await settings.save();
    }
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message
    });
  }
};

// Update user settings
const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    
    // Remove any fields that shouldn't be updated directly
    delete updates.user;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;
    
    const settings = await UserSettings.findOneAndUpdate(
      { user: userId },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message
    });
  }
};

// Update profile information
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, location, bio, website, linkedin, github } = req.body;
    
    const settings = await UserSettings.findOneAndUpdate(
      { user: userId },
      { 
        $set: {
          'profile.firstName': firstName,
          'profile.lastName': lastName,
          'profile.phone': phone,
          'profile.location': location,
          'profile.bio': bio,
          'profile.website': website,
          'profile.linkedin': linkedin,
          'profile.github': github
        }
      },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: settings.profile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Update notification preferences
const updateNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, push } = req.body;
    
    const settings = await UserSettings.findOneAndUpdate(
      { user: userId },
      { 
        $set: {
          'notifications.email': email,
          'notifications.push': push
        }
      },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: settings.notifications
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification preferences',
      error: error.message
    });
  }
};

// Update privacy settings
const updatePrivacy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profileVisibility, showEmail, showPhone, allowMessages } = req.body;
    
    const settings = await UserSettings.findOneAndUpdate(
      { user: userId },
      { 
        $set: {
          'privacy.profileVisibility': profileVisibility,
          'privacy.showEmail': showEmail,
          'privacy.showPhone': showPhone,
          'privacy.allowMessages': allowMessages
        }
      },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Privacy settings updated successfully',
      data: settings.privacy
    });
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update privacy settings',
      error: error.message
    });
  }
};

// Update application preferences
const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { defaultJobStatus, autoSave, theme, language, timezone, dateFormat } = req.body;
    
    const settings = await UserSettings.findOneAndUpdate(
      { user: userId },
      { 
        $set: {
          'preferences.defaultJobStatus': defaultJobStatus,
          'preferences.autoSave': autoSave,
          'preferences.theme': theme,
          'preferences.language': language,
          'preferences.timezone': timezone,
          'preferences.dateFormat': dateFormat
        }
      },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: settings.preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: error.message
    });
  }
};

// Update security settings
const updateSecurity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { twoFactorEnabled, loginNotifications, sessionTimeout } = req.body;
    
    const settings = await UserSettings.findOneAndUpdate(
      { user: userId },
      { 
        $set: {
          'security.twoFactorEnabled': twoFactorEnabled,
          'security.loginNotifications': loginNotifications,
          'security.sessionTimeout': sessionTimeout
        }
      },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Security settings updated successfully',
      data: settings.security
    });
  } catch (error) {
    console.error('Error updating security settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update security settings',
      error: error.message
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Get user to verify current password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    user.password = hashedNewPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

// Export user data
const exportData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { format = 'json' } = req.query;
    
    // Get user settings and jobs
    const settings = await UserSettings.findOne({ user: userId });
    const Job = require('../models/Job');
    const jobs = await Job.find({ user: userId });
    
    const user = await User.findById(userId).select('-password');
    
    const exportData = {
      user: user,
      settings: settings,
      jobs: jobs,
      exportedAt: new Date(),
      version: '1.0'
    };
    
    // Update last export date
    if (settings) {
      settings.data.lastExport = new Date();
      await settings.save();
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="user-data-${Date.now()}.${format}"`);
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export data',
      error: error.message
    });
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;
    
    // Verify password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }
    
    // Delete user data
    await UserSettings.deleteOne({ user: userId });
    const Job = require('../models/Job');
    await Job.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);
    
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message
    });
  }
};

module.exports = {
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
};
