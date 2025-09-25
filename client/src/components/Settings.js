import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import './Settings.css';

const Settings = () => {
  const { refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    bio: '',
    website: '',
    linkedin: '',
    github: ''
  });

  const [notifications, setNotifications] = useState({
    email: {
      jobAlerts: true,
      applicationUpdates: true,
      weeklyReports: true,
      marketing: false
    },
    push: {
      jobAlerts: true,
      applicationUpdates: true,
      reminders: true
    }
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    showEmail: false,
    showPhone: false,
    allowMessages: true
  });

  const [preferences, setPreferences] = useState({
    defaultJobStatus: 'Applied',
    autoSave: true,
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY'
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings');
      const data = response.data;
      
      setSettings(data.data);
      
      // Populate form states
      if (data.data.profile) {
        setProfile(data.data.profile);
      }
      if (data.data.notifications) {
        setNotifications(data.data.notifications);
      }
      if (data.data.privacy) {
        setPrivacy(data.data.privacy);
      }
      if (data.data.preferences) {
        setPreferences(data.data.preferences);
      }
      if (data.data.security) {
        setSecurity(data.data.security);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      showMessage('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSave = async (section) => {
    try {
      setLoading(true);
      let endpoint = '/settings';
      let data = {};

      switch (section) {
        case 'profile':
          endpoint = '/settings/profile';
          data = profile;
          break;
        case 'notifications':
          endpoint = '/settings/notifications';
          data = notifications;
          break;
        case 'privacy':
          endpoint = '/settings/privacy';
          data = privacy;
          break;
        case 'preferences':
          endpoint = '/settings/preferences';
          data = preferences;
          break;
        case 'security':
          endpoint = '/settings/security';
          data = security;
          break;
        default:
          return;
      }

      const response = await api.put(endpoint, data);

      showMessage('success', `${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully`);
      
      // If profile was updated, refresh user data in context
      if (section === 'profile') {
        const refreshResult = await refreshUser();
        if (refreshResult.success) {
          console.log('User data refreshed successfully');
        } else {
          console.error('Failed to refresh user data:', refreshResult.error);
        }
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save settings';
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!passwordForm.currentPassword) {
      showMessage('error', 'Current password is required');
      return;
    }
    
    if (!passwordForm.newPassword) {
      showMessage('error', 'New password is required');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      showMessage('error', 'New password must be at least 6 characters long');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(passwordForm.newPassword);
    const hasLowerCase = /[a-z]/.test(passwordForm.newPassword);
    const hasNumbers = /\d/.test(passwordForm.newPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      showMessage('error', 'New password must contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    try {
      setLoading(true);
      const response = await api.put('/settings/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      showMessage('success', 'Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await api.get('/settings/export', {
        responseType: 'blob'
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showMessage('success', 'Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      showMessage('error', 'Failed to export data');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'data', label: 'Data & Export', icon: '📊' }
  ];

  if (loading && !settings) {
    return (
      <div className="settings">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings">
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <div className="header-title-section">
            <div className="header-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1>Settings</h1>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="settings-content">
          {/* Sidebar */}
          <div className="settings-sidebar">
            <nav className="settings-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="nav-icon">{tab.icon}</span>
                  <span className="nav-label">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="settings-main">
            {activeTab === 'profile' && (
              <ProfileSection 
                profile={profile} 
                setProfile={setProfile} 
                onSave={() => handleSave('profile')}
                loading={loading}
              />
            )}
            
            {activeTab === 'notifications' && (
              <NotificationsSection 
                notifications={notifications} 
                setNotifications={setNotifications} 
                onSave={() => handleSave('notifications')}
                loading={loading}
              />
            )}
            
            {activeTab === 'privacy' && (
              <PrivacySection 
                privacy={privacy} 
                setPrivacy={setPrivacy} 
                onSave={() => handleSave('privacy')}
                loading={loading}
              />
            )}
            
            {activeTab === 'preferences' && (
              <PreferencesSection 
                preferences={preferences} 
                setPreferences={setPreferences} 
                onSave={() => handleSave('preferences')}
                loading={loading}
              />
            )}
            
            {activeTab === 'security' && (
              <SecuritySection 
                security={security} 
                setSecurity={setSecurity} 
                passwordForm={passwordForm}
                setPasswordForm={setPasswordForm}
                onPasswordChange={handlePasswordChange}
                loading={loading}
              />
            )}
            
            {activeTab === 'data' && (
              <DataSection 
                onExport={handleExportData}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Section Component
const ProfileSection = ({ profile, setProfile, onSave, loading }) => (
  <div className="settings-section">
    <div className="section-header">
      <h2>Profile Information</h2>
      <p>Update your personal information and contact details</p>
    </div>
    
    <form className="settings-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={profile.firstName}
            onChange={(e) => setProfile({...profile, firstName: e.target.value})}
            placeholder="Enter your first name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={profile.lastName}
            onChange={(e) => setProfile({...profile, lastName: e.target.value})}
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={profile.phone}
            onChange={(e) => setProfile({...profile, phone: e.target.value})}
            placeholder="Enter your phone number"
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={profile.location}
            onChange={(e) => setProfile({...profile, location: e.target.value})}
            placeholder="Enter your location"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          value={profile.bio}
          onChange={(e) => setProfile({...profile, bio: e.target.value})}
          placeholder="Tell us about yourself"
          rows="4"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            type="url"
            id="website"
            value={profile.website}
            onChange={(e) => setProfile({...profile, website: e.target.value})}
            placeholder="https://yourwebsite.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="linkedin">LinkedIn</label>
          <input
            type="url"
            id="linkedin"
            value={profile.linkedin}
            onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="github">GitHub</label>
        <input
          type="url"
          id="github"
          value={profile.github}
          onChange={(e) => setProfile({...profile, github: e.target.value})}
          placeholder="https://github.com/yourusername"
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onSave} disabled={loading} className="save-btn">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  </div>
);

// Notifications Section Component
const NotificationsSection = ({ notifications, setNotifications, onSave, loading }) => (
  <div className="settings-section">
    <div className="section-header">
      <h2>Notification Preferences</h2>
      <p>Choose how you want to be notified about updates</p>
    </div>
    
    <div className="settings-form">
      <div className="notification-group">
        <h3>Email Notifications</h3>
        <div className="toggle-group">
          <div className="toggle-item">
            <label>Job Alerts</label>
            <input
              type="checkbox"
              checked={notifications.email.jobAlerts}
              onChange={(e) => setNotifications({
                ...notifications,
                email: {...notifications.email, jobAlerts: e.target.checked}
              })}
            />
          </div>
          <div className="toggle-item">
            <label>Application Updates</label>
            <input
              type="checkbox"
              checked={notifications.email.applicationUpdates}
              onChange={(e) => setNotifications({
                ...notifications,
                email: {...notifications.email, applicationUpdates: e.target.checked}
              })}
            />
          </div>
          <div className="toggle-item">
            <label>Weekly Reports</label>
            <input
              type="checkbox"
              checked={notifications.email.weeklyReports}
              onChange={(e) => setNotifications({
                ...notifications,
                email: {...notifications.email, weeklyReports: e.target.checked}
              })}
            />
          </div>
          <div className="toggle-item">
            <label>Marketing Emails</label>
            <input
              type="checkbox"
              checked={notifications.email.marketing}
              onChange={(e) => setNotifications({
                ...notifications,
                email: {...notifications.email, marketing: e.target.checked}
              })}
            />
          </div>
        </div>
      </div>

      <div className="notification-group">
        <h3>Push Notifications</h3>
        <div className="toggle-group">
          <div className="toggle-item">
            <label>Job Alerts</label>
            <input
              type="checkbox"
              checked={notifications.push.jobAlerts}
              onChange={(e) => setNotifications({
                ...notifications,
                push: {...notifications.push, jobAlerts: e.target.checked}
              })}
            />
          </div>
          <div className="toggle-item">
            <label>Application Updates</label>
            <input
              type="checkbox"
              checked={notifications.push.applicationUpdates}
              onChange={(e) => setNotifications({
                ...notifications,
                push: {...notifications.push, applicationUpdates: e.target.checked}
              })}
            />
          </div>
          <div className="toggle-item">
            <label>Reminders</label>
            <input
              type="checkbox"
              checked={notifications.push.reminders}
              onChange={(e) => setNotifications({
                ...notifications,
                push: {...notifications.push, reminders: e.target.checked}
              })}
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onSave} disabled={loading} className="save-btn">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  </div>
);

// Privacy Section Component
const PrivacySection = ({ privacy, setPrivacy, onSave, loading }) => (
  <div className="settings-section">
    <div className="section-header">
      <h2>Privacy Settings</h2>
      <p>Control who can see your information</p>
    </div>
    
    <div className="settings-form">
      <div className="form-group">
        <label htmlFor="profileVisibility">Profile Visibility</label>
        <select
          id="profileVisibility"
          value={privacy.profileVisibility}
          onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="connections">Connections Only</option>
        </select>
      </div>

      <div className="toggle-group">
        <div className="toggle-item">
          <label>Show Email Address</label>
          <input
            type="checkbox"
            checked={privacy.showEmail}
            onChange={(e) => setPrivacy({...privacy, showEmail: e.target.checked})}
          />
        </div>
        <div className="toggle-item">
          <label>Show Phone Number</label>
          <input
            type="checkbox"
            checked={privacy.showPhone}
            onChange={(e) => setPrivacy({...privacy, showPhone: e.target.checked})}
          />
        </div>
        <div className="toggle-item">
          <label>Allow Messages</label>
          <input
            type="checkbox"
            checked={privacy.allowMessages}
            onChange={(e) => setPrivacy({...privacy, allowMessages: e.target.checked})}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onSave} disabled={loading} className="save-btn">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  </div>
);

// Preferences Section Component
const PreferencesSection = ({ preferences, setPreferences, onSave, loading }) => (
  <div className="settings-section">
    <div className="section-header">
      <h2>Application Preferences</h2>
      <p>Customize your application experience</p>
    </div>
    
    <div className="settings-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="defaultJobStatus">Default Job Status</label>
          <select
            id="defaultJobStatus"
            value={preferences.defaultJobStatus}
            onChange={(e) => setPreferences({...preferences, defaultJobStatus: e.target.value})}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Hired">Hired</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            value={preferences.theme}
            onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="language">Language</label>
          <select
            id="language"
            value={preferences.language}
            onChange={(e) => setPreferences({...preferences, language: e.target.value})}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="timezone">Timezone</label>
          <select
            id="timezone"
            value={preferences.timezone}
            onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="dateFormat">Date Format</label>
        <select
          id="dateFormat"
          value={preferences.dateFormat}
          onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
        >
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>

      <div className="toggle-group">
        <div className="toggle-item">
          <label>Auto Save</label>
          <input
            type="checkbox"
            checked={preferences.autoSave}
            onChange={(e) => setPreferences({...preferences, autoSave: e.target.checked})}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onSave} disabled={loading} className="save-btn">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  </div>
);

// Security Section Component
const SecuritySection = ({ security, setSecurity, passwordForm, setPasswordForm, onPasswordChange, loading }) => (
  <div className="settings-section">
    <div className="section-header">
      <h2>Security Settings</h2>
      <p>Manage your account security and password</p>
    </div>
    
    <div className="settings-form">
      <div className="security-group">
        <h3>Password</h3>
        <form onSubmit={onPasswordChange}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
              placeholder="Enter current password"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                placeholder="Enter new password"
                required
              />
              <div className="password-requirements">
                <small>Password must contain:</small>
                <ul>
                  <li>At least 6 characters</li>
                  <li>One uppercase letter (A-Z)</li>
                  <li>One lowercase letter (a-z)</li>
                  <li>One number (0-9)</li>
                </ul>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" disabled={loading} className="save-btn">
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

      <div className="security-group">
        <h3>Security Options</h3>
        <div className="toggle-group">
          <div className="toggle-item">
            <label>Two-Factor Authentication</label>
            <input
              type="checkbox"
              checked={security.twoFactorEnabled}
              onChange={(e) => setSecurity({...security, twoFactorEnabled: e.target.checked})}
            />
          </div>
          <div className="toggle-item">
            <label>Login Notifications</label>
            <input
              type="checkbox"
              checked={security.loginNotifications}
              onChange={(e) => setSecurity({...security, loginNotifications: e.target.checked})}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
          <input
            type="number"
            id="sessionTimeout"
            value={security.sessionTimeout}
            onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value)})}
            min="5"
            max="480"
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => {/* Handle security save */}} disabled={loading} className="save-btn">
            {loading ? 'Saving...' : 'Save Security Settings'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Data Section Component
const DataSection = ({ onExport, loading }) => (
  <div className="settings-section">
    <div className="section-header">
      <h2>Data & Export</h2>
      <p>Manage your data and export options</p>
    </div>
    
    <div className="settings-form">
      <div className="data-group">
        <h3>Export Data</h3>
        <p>Download a copy of all your data including jobs, settings, and profile information.</p>
        <div className="form-actions">
          <button type="button" onClick={onExport} disabled={loading} className="export-btn">
            {loading ? 'Exporting...' : 'Export My Data'}
          </button>
        </div>
      </div>

      <div className="data-group">
        <h3>Account Deletion</h3>
        <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
        <div className="form-actions">
          <button type="button" className="delete-btn">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Settings;
