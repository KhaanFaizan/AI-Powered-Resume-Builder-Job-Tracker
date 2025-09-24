import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';
import './Analytics.css';

const Analytics = () => {
  const { token } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('applications');

  // API configuration
  // API is now imported from config/api.js

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs/stats');
      const jobsResponse = await api.get('/jobs');
      
      const stats = response.data.data;
      const jobs = jobsResponse.data.data;
      
      // Calculate additional analytics
      const analytics = {
        ...stats,
        jobs: jobs,
        trends: calculateTrends(jobs),
        performance: calculatePerformance(jobs),
        insights: generateInsights(jobs, stats)
      };
      
      setAnalyticsData(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate trends over time
  const calculateTrends = (jobs) => {
    const last30Days = jobs.filter(job => {
      const jobDate = new Date(job.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return jobDate >= thirtyDaysAgo;
    });

    const weeklyData = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - i * 7);
      
      const weekJobs = last30Days.filter(job => {
        const jobDate = new Date(job.createdAt);
        return jobDate >= weekStart && jobDate < weekEnd;
      });
      
      weeklyData.push({
        week: `Week ${4 - i}`,
        applications: weekJobs.length,
        interviews: weekJobs.filter(job => job.status === 'Interview').length,
        hired: weekJobs.filter(job => job.status === 'Hired').length
      });
    }

    return weeklyData;
  };

  // Calculate performance metrics
  const calculatePerformance = (jobs) => {
    const totalJobs = jobs.length;
    const hiredJobs = jobs.filter(job => job.status === 'Hired').length;
    const interviewJobs = jobs.filter(job => job.status === 'Interview').length;
    const rejectedJobs = jobs.filter(job => job.status === 'Rejected').length;
    
    return {
      hireRate: totalJobs > 0 ? Math.round((hiredJobs / totalJobs) * 100) : 0,
      interviewRate: totalJobs > 0 ? Math.round((interviewJobs / totalJobs) * 100) : 0,
      rejectionRate: totalJobs > 0 ? Math.round((rejectedJobs / totalJobs) * 100) : 0,
      avgMatchScore: jobs.length > 0 ? Math.round(jobs.reduce((sum, job) => sum + job.matchPercentage, 0) / jobs.length) : 0
    };
  };

  // Generate insights
  const generateInsights = (jobs, stats) => {
    const insights = [];
    
    if (stats.totalJobs === 0) {
      insights.push({
        type: 'info',
        title: 'Get Started',
        message: 'Start applying to jobs to see your analytics and insights!'
      });
      return insights;
    }

    // Performance insights
    const performance = calculatePerformance(jobs);
    
    if (performance.hireRate > 20) {
      insights.push({
        type: 'success',
        title: 'Excellent Performance!',
        message: `You have a ${performance.hireRate}% hire rate. Keep up the great work!`
      });
    } else if (performance.hireRate < 5) {
      insights.push({
        type: 'warning',
        title: 'Improve Your Applications',
        message: 'Consider tailoring your resume better to job requirements to increase your hire rate.'
      });
    }

    // Match score insights
    if (performance.avgMatchScore < 60) {
      insights.push({
        type: 'warning',
        title: 'Low Match Scores',
        message: `Your average match score is ${performance.avgMatchScore}%. Try using the AI Resume Analysis to improve your applications.`
      });
    }

    // Application frequency insights
    const last7Days = jobs.filter(job => {
      const jobDate = new Date(job.createdAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return jobDate >= sevenDaysAgo;
    }).length;

    if (last7Days === 0) {
      insights.push({
        type: 'info',
        title: 'Stay Active',
        message: 'You haven\'t applied to any jobs in the last 7 days. Consider applying to more positions!'
      });
    } else if (last7Days >= 5) {
      insights.push({
        type: 'success',
        title: 'Great Activity!',
        message: `You've applied to ${last7Days} jobs this week. Keep up the momentum!`
      });
    }

    return insights;
  };

  useEffect(() => {
    if (token) {
      fetchAnalyticsData();
    }
  }, [token, timeRange]);

  if (loading) {
    return (
      <div className="analytics">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="analytics">
        <div className="error-state">
          <div className="error-icon">📊</div>
          <h3>No Data Available</h3>
          <p>Start applying to jobs to see your analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics">
      <div className="analytics-container">
        {/* Header */}
        <div className="analytics-header">
          <div className="header-content">
            <div className="header-title-section">
              <div className="header-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9L12 6L16 10L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="6" r="2" fill="currentColor"/>
                  <circle cx="16" cy="10" r="2" fill="currentColor"/>
                  <path d="M3 13H21" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
                  <path d="M3 17H21" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
                </svg>
              </div>
              <h1>Analytics Dashboard</h1>
            </div>
            <div className="header-controls">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="time-range-select"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="metrics-grid">
          <div className="metric-card applications">
            <div className="metric-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9H15V15H9V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="metric-content">
              <h3>{analyticsData.totalJobs}</h3>
              <p>Total Applications</p>
              <div className="metric-trend positive">
                <span>+12%</span>
                <span>vs last month</span>
              </div>
            </div>
          </div>

          <div className="metric-card interviews">
            <div className="metric-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>
            </div>
            <div className="metric-content">
              <h3>{analyticsData.jobs.filter(job => job.status === 'Interview').length}</h3>
              <p>Interviews</p>
              <div className="metric-trend positive">
                <span>+8%</span>
                <span>vs last month</span>
              </div>
            </div>
          </div>

          <div className="metric-card hired">
            <div className="metric-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="metric-content">
              <h3>{analyticsData.jobs.filter(job => job.status === 'Hired').length}</h3>
              <p>Hired</p>
              <div className="metric-trend positive">
                <span>+15%</span>
                <span>vs last month</span>
              </div>
            </div>
          </div>

          <div className="metric-card match-score">
            <div className="metric-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9L12 6L16 10L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="6" r="2" fill="currentColor"/>
                <circle cx="16" cy="10" r="2" fill="currentColor"/>
              </svg>
            </div>
            <div className="metric-content">
              <h3>{analyticsData.performance.avgMatchScore}%</h3>
              <p>Avg Match Score</p>
              <div className="metric-trend neutral">
                <span>+3%</span>
                <span>vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            <div className="chart-header">
              <h3>Application Trends</h3>
              <div className="chart-controls">
                <button 
                  className={`chart-btn ${selectedMetric === 'applications' ? 'active' : ''}`}
                  onClick={() => setSelectedMetric('applications')}
                >
                  Applications
                </button>
                <button 
                  className={`chart-btn ${selectedMetric === 'interviews' ? 'active' : ''}`}
                  onClick={() => setSelectedMetric('interviews')}
                >
                  Interviews
                </button>
                <button 
                  className={`chart-btn ${selectedMetric === 'hired' ? 'active' : ''}`}
                  onClick={() => setSelectedMetric('hired')}
                >
                  Hired
                </button>
              </div>
            </div>
            <div className="chart-content">
              <div className="bar-chart">
                {analyticsData.trends.map((week, index) => (
                  <div key={index} className="bar-item">
                    <div className="bar-container">
                      <div 
                        className="bar-fill"
                        style={{ 
                          height: `${Math.max((week[selectedMetric] / Math.max(...analyticsData.trends.map(w => w[selectedMetric]))) * 100, 5)}%`,
                          animationDelay: `${index * 0.2}s`
                        }}
                      ></div>
                    </div>
                    <div className="bar-label">{week.week}</div>
                    <div className="bar-value">{week[selectedMetric]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-header">
              <h3>Status Distribution</h3>
            </div>
            <div className="chart-content">
              <div className="pie-chart">
                <div className="pie-slice applied">
                  <div className="slice-fill"></div>
                  <div className="slice-label">Applied</div>
                  <div className="slice-value">{analyticsData.jobs.filter(job => job.status === 'Applied').length}</div>
                </div>
                <div className="pie-slice interview">
                  <div className="slice-fill"></div>
                  <div className="slice-label">Interview</div>
                  <div className="slice-value">{analyticsData.jobs.filter(job => job.status === 'Interview').length}</div>
                </div>
                <div className="pie-slice rejected">
                  <div className="slice-fill"></div>
                  <div className="slice-label">Rejected</div>
                  <div className="slice-value">{analyticsData.jobs.filter(job => job.status === 'Rejected').length}</div>
                </div>
                <div className="pie-slice hired">
                  <div className="slice-fill"></div>
                  <div className="slice-label">Hired</div>
                  <div className="slice-value">{analyticsData.jobs.filter(job => job.status === 'Hired').length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="performance-section">
          <h3>Performance Metrics</h3>
          <div className="performance-grid">
            <div className="performance-card">
              <div className="performance-icon">🎯</div>
              <div className="performance-content">
                <h4>Hire Rate</h4>
                <div className="performance-value">{analyticsData.performance.hireRate}%</div>
                <div className="performance-bar">
                  <div 
                    className="performance-fill"
                    style={{ width: `${analyticsData.performance.hireRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="performance-card">
              <div className="performance-icon">📞</div>
              <div className="performance-content">
                <h4>Interview Rate</h4>
                <div className="performance-value">{analyticsData.performance.interviewRate}%</div>
                <div className="performance-bar">
                  <div 
                    className="performance-fill"
                    style={{ width: `${analyticsData.performance.interviewRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="performance-card">
              <div className="performance-icon">📊</div>
              <div className="performance-content">
                <h4>Match Score</h4>
                <div className="performance-value">{analyticsData.performance.avgMatchScore}%</div>
                <div className="performance-bar">
                  <div 
                    className="performance-fill"
                    style={{ width: `${analyticsData.performance.avgMatchScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="insights-section">
          <h3>💡 AI Insights & Recommendations</h3>
          <div className="insights-grid">
            {analyticsData.insights.map((insight, index) => (
              <div key={index} className={`insight-card ${insight.type}`}>
                <div className="insight-icon">
                  {insight.type === 'success' ? '✅' : 
                   insight.type === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div className="insight-content">
                  <h4>{insight.title}</h4>
                  <p>{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {analyticsData.jobs.slice(0, 5).map((job, index) => (
              <div key={job._id} className="activity-item">
                <div className="activity-icon">
                  {job.status === 'Applied' ? '📝' :
                   job.status === 'Interview' ? '🎯' :
                   job.status === 'Hired' ? '🎉' : '❌'}
                </div>
                <div className="activity-content">
                  <div className="activity-title">
                    {job.role} at {job.company}
                  </div>
                  <div className="activity-meta">
                    <span className={`status-badge ${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                    <span className="activity-date">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="activity-score">
                  {job.matchPercentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
