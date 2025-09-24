import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import AIResultCards from './AIResultCards';
import './AIAnalysis.css';

const AIAnalysis = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    resumeText: '',
    jobDescription: ''
  });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  // API configuration
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

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
    
    if (!formData.resumeText.trim() || !formData.jobDescription.trim()) {
      toast.error('Please fill in both resume text and job description');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/ai/analyze', {
        resumeText: formData.resumeText,
        jobDescription: formData.jobDescription
      });

      setAnalysisData(response.data);
      setShowResults(true);
      toast.success('AI analysis completed successfully!');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.error('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      resumeText: '',
      jobDescription: ''
    });
    setShowResults(false);
    setAnalysisData(null);
  };

  return (
    <div className="ai-analysis">
      <div className="ai-analysis-container">
        <div className="ai-analysis-header">
          <h2>AI Resume Analysis</h2>
          <p>Get AI-powered insights to improve your resume and match it with job requirements</p>
        </div>

        <div className="analysis-form-container">
          <form onSubmit={handleSubmit} className="analysis-form">
            <div className="form-group">
              <label htmlFor="resumeText">
                <span className="label-icon">📄</span>
                Resume Text
              </label>
              <textarea
                id="resumeText"
                name="resumeText"
                value={formData.resumeText}
                onChange={handleInputChange}
                placeholder="Paste your resume content here... Include your experience, skills, education, and achievements."
                rows="8"
                required
                className="resume-textarea"
              />
              <small className="form-help">
                Include your work experience, skills, education, and key achievements
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="jobDescription">
                <span className="label-icon">🎯</span>
                Job Description
              </label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                placeholder="Paste the job description you want to match your resume against..."
                rows="6"
                required
                className="job-textarea"
              />
              <small className="form-help">
                Include the complete job posting with requirements, responsibilities, and qualifications
              </small>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="reset-btn"
                onClick={resetForm}
                disabled={loading}
              >
                Reset
              </button>
              <button 
                type="submit" 
                className="analyze-btn"
                disabled={loading || !formData.resumeText.trim() || !formData.jobDescription.trim()}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    🤖 Analyze Resume
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* AI Results Modal */}
        {showResults && analysisData && (
          <AIResultCards
            analysisData={analysisData}
            onClose={() => setShowResults(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;
