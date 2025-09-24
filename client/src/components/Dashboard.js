import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import JobTracker from './JobTracker';
import AIAnalysis from './AIAnalysis';
import Analytics from './Analytics';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  if (currentView === 'job-tracker') {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="nav-section">
              <button 
                className="back-btn"
                onClick={handleBackToDashboard}
              >
                ← Back to Dashboard
              </button>
              <h1>Job Tracker</h1>
            </div>
            <div className="user-info">
              <span>Welcome, {user?.name}</span>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </header>
        <JobTracker />
      </div>
    );
  }

  if (currentView === 'ai-analysis') {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="nav-section">
              <button 
                className="back-btn"
                onClick={handleBackToDashboard}
              >
                ← Back to Dashboard
              </button>
              <h1>AI Resume Analysis</h1>
            </div>
            <div className="user-info">
              <span>Welcome, {user?.name}</span>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </header>
        <AIAnalysis />
      </div>
    );
  }

  if (currentView === 'analytics') {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="nav-section">
              <button 
                className="back-btn"
                onClick={handleBackToDashboard}
              >
                ← Back to Dashboard
              </button>
              <h1>Analytics Dashboard</h1>
            </div>
            <div className="user-info">
              <span>Welcome, {user?.name}</span>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </header>
        <Analytics />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>AI Resume Builder</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome to Your Dashboard</h2>
          <p>Start building your professional resume with AI assistance</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Resume Analysis</h3>
            <p>Analyze your resume with AI to get insights and improvements</p>
            <button 
              className="feature-btn"
              onClick={() => handleNavigation('ai-analysis')}
            >
              Analyze Resume
            </button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Job Tracker</h3>
            <p>Track your job applications and manage opportunities</p>
            <button 
              className="feature-btn"
              onClick={() => handleNavigation('job-tracker')}
            >
              View Jobs
            </button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>Get insights into your job search performance</p>
            <button 
              className="feature-btn"
              onClick={() => handleNavigation('analytics')}
            >
              View Analytics
            </button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Manage your account and preferences</p>
            <button className="feature-btn">Settings</button>
          </div>
        </div>

        <div className="user-details">
          <h3>Account Information</h3>
          <div className="user-details-grid">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{user?.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user?.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Role:</span>
              <span className="detail-value">{user?.role}</span>
            </div>
          </div>
          <div className="user-details-row">
            <div className="detail-item">
              <span className="detail-label">Last Login:</span>
              <span className="detail-value">
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
