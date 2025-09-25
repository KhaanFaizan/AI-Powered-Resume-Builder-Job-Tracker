import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // API configuration
  // API is now imported from config/api.js
  // Admin endpoints use /admin prefix

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
  }, [user]);

  // Fetch dashboard overview
  const fetchOverview = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard');
      setOverview(response.data.data);
    } catch (error) {
      console.error('Error fetching overview:', error);
      toast.error('Failed to fetch dashboard overview');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const params = { page, ...filters };
      const response = await api.get('/admin/users', { params });
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs
  const fetchJobs = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const params = { page, ...filters };
      const response = await api.get('/admin/jobs', { params });
      setJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async (timeRange = '30d') => {
    try {
      setLoading(true);
      const response = await api.get('/admin/analytics', { 
        params: { timeRange } 
      });
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  // Update user status
  const updateUserStatus = async (userId, isActive) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { isActive });
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  // Promote user to admin
  const promoteToAdmin = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/promote`);
      toast.success('User promoted to admin successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error(error.response?.data?.message || 'Failed to promote user');
    }
  };

  // Demote admin to user
  const demoteFromAdmin = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/demote`);
      toast.success('Admin demoted to user successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error demoting admin:', error);
      toast.error(error.response?.data?.message || 'Failed to demote admin');
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchOverview();
    }
  }, [user]);

  // Load data when tab changes
  useEffect(() => {
    if (user && user.role === 'admin') {
      switch (activeTab) {
        case 'users':
          fetchUsers();
          break;
        case 'jobs':
          fetchJobs();
          break;
        case 'analytics':
          fetchAnalytics();
          break;
        default:
          break;
      }
    }
  }, [activeTab, user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don&apos;t have admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'jobs', label: 'Jobs', icon: '💼' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'system', label: 'System', icon: '⚙️' }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div className="header-title-section">
            <div className="header-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1>Admin Dashboard</h1>
          </div>
          <div className="admin-info">
            <span>Welcome, {user.name}</span>
            <span className="admin-badge">ADMIN</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="admin-nav">
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
        </div>

        {/* Content */}
        <div className="admin-content">
          {activeTab === 'overview' && (
            <OverviewTab overview={overview} loading={loading} />
          )}
          
          {activeTab === 'users' && (
            <UsersTab 
              users={users} 
              loading={loading}
              onUpdateStatus={updateUserStatus}
              onPromote={promoteToAdmin}
              onDemote={demoteFromAdmin}
              onDelete={deleteUser}
              onRefresh={() => fetchUsers()}
            />
          )}
          
          {activeTab === 'jobs' && (
            <JobsTab jobs={jobs} loading={loading} onRefresh={() => fetchJobs()} />
          )}
          
          {activeTab === 'analytics' && (
            <AnalyticsTab analytics={analytics} loading={loading} onRefresh={() => fetchAnalytics()} />
          )}
          
          {activeTab === 'system' && (
            <SystemTab />
          )}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ overview, loading }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading overview...</p>
      </div>
    );
  }

  if (!overview) {
    return <div className="no-data">No data available</div>;
  }

  return (
    <div className="overview-tab">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{overview.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{overview.activeUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <h3>{overview.totalJobs}</h3>
            <p>Total Jobs</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>{Math.round(overview.systemHealth?.uptime / 3600)}h</h3>
            <p>System Uptime</p>
          </div>
        </div>
      </div>

      <div className="overview-sections">
        <div className="recent-section">
          <h3>Recent Users</h3>
          <div className="recent-list">
            {overview.recentUsers?.map(user => (
              <div key={user._id} className="recent-item">
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-email">{user.email}</span>
                </div>
                <span className="user-date">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-section">
          <h3>Recent Jobs</h3>
          <div className="recent-list">
            {overview.recentJobs?.map(job => (
              <div key={job._id} className="recent-item">
                <div className="job-info">
                  <span className="job-role">{job.role}</span>
                  <span className="job-company">{job.company}</span>
                </div>
                <span className="job-status">{job.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Users Tab Component
const UsersTab = ({ users, loading, onUpdateStatus, onPromote, onDemote, onDelete, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleSearch = () => {
    const filters = {};
    if (searchTerm) filters.search = searchTerm;
    if (roleFilter) filters.role = roleFilter;
    if (statusFilter) filters.isActive = statusFilter;
    onRefresh(1, filters);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="users-tab">
      <div className="users-header">
        <h2>User Management</h2>
        <button onClick={onRefresh} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.users?.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  {user.lastLogin 
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : 'Never'
                  }
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => onUpdateStatus(user._id, !user.isActive)}
                      className={`action-btn ${user.isActive ? 'deactivate' : 'activate'}`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    
                    {user.role === 'user' ? (
                      <button
                        onClick={() => onPromote(user._id)}
                        className="action-btn promote"
                      >
                        Promote
                      </button>
                    ) : (
                      <button
                        onClick={() => onDemote(user._id)}
                        className="action-btn demote"
                      >
                        Demote
                      </button>
                    )}
                    
                    <button
                      onClick={() => onDelete(user._id)}
                      className="action-btn delete"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.pagination && (
        <div className="pagination">
          <button 
            disabled={!users.pagination.hasPrev}
            onClick={() => onRefresh(users.pagination.currentPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {users.pagination.currentPage} of {users.pagination.totalPages}
          </span>
          <button 
            disabled={!users.pagination.hasNext}
            onClick={() => onRefresh(users.pagination.currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Jobs Tab Component
const JobsTab = ({ jobs, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="jobs-tab">
      <div className="jobs-header">
        <h2>Job Applications</h2>
        <button onClick={onRefresh} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      <div className="jobs-table">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>User</th>
              <th>Status</th>
              <th>Match %</th>
              <th>Applied Date</th>
            </tr>
          </thead>
          <tbody>
            {jobs.jobs?.map(job => (
              <tr key={job._id}>
                <td>{job.company}</td>
                <td>{job.role}</td>
                <td>{job.user?.name || 'Unknown'}</td>
                <td>
                  <span className={`status-badge ${job.status.toLowerCase()}`}>
                    {job.status}
                  </span>
                </td>
                <td>{job.matchPercentage}%</td>
                <td>{new Date(job.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab = ({ analytics, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return <div className="no-data">No analytics data available</div>;
  }

  return (
    <div className="analytics-tab">
      <div className="analytics-header">
        <h2>System Analytics</h2>
        <button onClick={onRefresh} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>User Statistics</h3>
          <div className="stat-item">
            <span>Total Users:</span>
            <span>{analytics.userStats?.total || 0}</span>
          </div>
          <div className="stat-item">
            <span>Active Users:</span>
            <span>{analytics.userStats?.active || 0}</span>
          </div>
          <div className="stat-item">
            <span>Admins:</span>
            <span>{analytics.userStats?.admins || 0}</span>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Job Statistics</h3>
          {analytics.jobStats?.map(stat => (
            <div key={stat._id} className="stat-item">
              <span>{stat._id}:</span>
              <span>{stat.count}</span>
            </div>
          ))}
        </div>

        <div className="analytics-card">
          <h3>System Health</h3>
          <div className="stat-item">
            <span>Uptime:</span>
            <span>{Math.round(analytics.systemHealth?.uptime / 3600)} hours</span>
          </div>
          <div className="stat-item">
            <span>Memory Usage:</span>
            <span>{Math.round(analytics.systemHealth?.memoryUsage?.heapUsed / 1024 / 1024)} MB</span>
          </div>
          <div className="stat-item">
            <span>Node Version:</span>
            <span>{analytics.systemHealth?.nodeVersion}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// System Tab Component
const SystemTab = () => {
  return (
    <div className="system-tab">
      <h2>System Management</h2>
      <div className="system-info">
        <div className="info-card">
          <h3>Server Status</h3>
          <p>✅ Online</p>
        </div>
        <div className="info-card">
          <h3>Database</h3>
          <p>✅ Connected</p>
        </div>
        <div className="info-card">
          <h3>API Status</h3>
          <p>✅ Operational</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
