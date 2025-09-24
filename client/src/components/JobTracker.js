import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './JobTracker.css';

const JobTracker = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Form state
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    deadline: '',
    matchPercentage: 0,
    location: '',
    salary: '',
    description: '',
    interviewDate: '',
    notes: '',
    jobUrl: '',
    contactPerson: '',
    contactEmail: ''
  });

  // API configuration
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // Fetch jobs and stats
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching with params:', { filter, sortBy, sortOrder });
      
      const [jobsResponse, statsResponse] = await Promise.all([
        api.get(`/jobs?status=${filter}&sortBy=${sortBy}&sortOrder=${sortOrder}`),
        api.get('/jobs/stats')
      ]);

      console.log('Jobs response:', jobsResponse.data);
      setJobs(jobsResponse.data.data);
      setStats(statsResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch job data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, filter, sortBy, sortOrder]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await api.put(`/jobs/${editingJob._id}`, formData);
        toast.success('Job application updated successfully');
      } else {
        await api.post('/jobs', formData);
        toast.success('Job application added successfully');
      }
      
      setShowForm(false);
      setEditingJob(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job application');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      status: 'Applied',
      deadline: '',
      matchPercentage: 0,
      location: '',
      salary: '',
      description: '',
      interviewDate: '',
      notes: '',
      jobUrl: '',
      contactPerson: '',
      contactEmail: ''
    });
  };

  // Handle edit job
  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      company: job.company,
      role: job.role,
      status: job.status,
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
      matchPercentage: job.matchPercentage,
      location: job.location || '',
      salary: job.salary || '',
      description: job.description || '',
      interviewDate: job.interviewDate ? new Date(job.interviewDate).toISOString().split('T')[0] : '',
      notes: job.notes || '',
      jobUrl: job.jobUrl || '',
      contactPerson: job.contactPerson || '',
      contactEmail: job.contactEmail || ''
    });
    setShowForm(true);
  };

  // Handle delete job
  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        await api.delete(`/jobs/${jobId}`);
        toast.success('Job application deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Error deleting job:', error);
        toast.error('Failed to delete job application');
      }
    }
  };

  // Handle status update
  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      await api.patch(`/jobs/${jobId}/status`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };


  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'Applied': '#3b82f6',
      'Interview': '#f59e0b',
      'Rejected': '#ef4444',
      'Hired': '#10b981'
    };
    return colors[status] || '#6b7280';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="job-tracker">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading job applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="job-tracker">
      {/* Header */}
      <div className="job-tracker-header">
        <div className="header-content">
          <h1>Job Tracker</h1>
          <button 
            className="add-job-btn"
            onClick={() => {
              setEditingJob(null);
              resetForm();
              setShowForm(true);
            }}
          >
            + Add Job Application
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9H15V15H9V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>{stats.totalJobs}</h3>
              <p>Total Applications</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>{stats.overallMatchPercentage}%</h3>
              <p>Avg Match Rate</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="2" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>{jobs.filter(job => job.daysUntilDeadline >= 0).length}</h3>
              <p>Active Applications</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="controls-container">
        <div className="filters">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Hired">Hired</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="deadline">Sort by Deadline</option>
            <option value="company">Sort by Company</option>
            <option value="matchPercentage">Sort by Match %</option>
          </select>
          
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-select"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="jobs-container">
        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No job applications found</h3>
            <p>Start by adding your first job application</p>
            <button 
              className="add-job-btn"
              onClick={() => {
                setEditingJob(null);
                resetForm();
                setShowForm(true);
              }}
            >
              Add Job Application
            </button>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div key={job._id} className="job-card">
                <div className="job-header">
                  <div className="job-title">
                    <h3>{job.role}</h3>
                    <p className="company">{job.company}</p>
                  </div>
                  <div className="job-status">
                    <select
                      value={job.status}
                      onChange={(e) => handleStatusUpdate(job._id, e.target.value)}
                      className="status-select"
                      style={{ borderColor: getStatusColor(job.status) }}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hired">Hired</option>
                    </select>
                  </div>
                </div>

                <div className="job-details">
                  {job.location && (
                    <div className="detail-item">
                      <span className="detail-label">📍</span>
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.salary && (
                    <div className="detail-item">
                      <span className="detail-label">💰</span>
                      <span>{job.salary}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">📅</span>
                    <span>Deadline: {formatDate(job.deadline)}</span>
                  </div>
                </div>

                <div className="job-progress">
                  <div className="progress-header">
                    <span>Match Percentage</span>
                    <span>{job.matchPercentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${job.matchPercentage}%`,
                        backgroundColor: job.matchPercentage >= 80 ? '#10b981' : 
                                       job.matchPercentage >= 60 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                  </div>
                </div>

                <div className="job-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(job)}
                  >
                    Edit
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Job Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingJob ? 'Edit Job Application' : 'Add Job Application'}</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingJob(null);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="job-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Company *</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role *</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Hired">Hired</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Deadline *</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Salary</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., $50,000 - $70,000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Match Percentage (%)</label>
                <input
                  type="number"
                  name="matchPercentage"
                  value={formData.matchPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label>Job Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Brief description of the role..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Interview Date</label>
                  <input
                    type="date"
                    name="interviewDate"
                    value={formData.interviewDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Job URL</label>
                  <input
                    type="url"
                    name="jobUrl"
                    value={formData.jobUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Person</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditingJob(null);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingJob ? 'Update Job' : 'Add Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTracker;
