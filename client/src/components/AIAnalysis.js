import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';
import AIResultCards from './AIResultCards';
import './AIAnalysis.css';

const AIAnalysis = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    resumeText: 'John Doe\nFull-Stack Developer\n\nExperience:\n- 5+ years developing web applications using React, Node.js, and JavaScript\n- Led development of e-commerce platform serving 10,000+ users\n- Experience with SQL databases and RESTful API design\n- Strong problem-solving skills and team collaboration\n\nEducation:\n- Bachelor of Computer Science, University of Technology\n\nSkills:\n- JavaScript, React, Node.js, SQL, Git',
    jobDescription: 'Senior Full-Stack Developer\n\nRequirements:\n- 5+ years experience with modern JavaScript frameworks (React, Vue, Angular)\n- Strong backend development skills (Node.js, Python, or Java)\n- Experience with cloud platforms (AWS, Azure, GCP)\n- Knowledge of containerization (Docker, Kubernetes)\n- TypeScript experience preferred\n- Experience with microservices architecture\n- Strong communication and leadership skills\n\nResponsibilities:\n- Design and develop scalable web applications\n- Lead technical decisions and mentor junior developers\n- Collaborate with cross-functional teams\n- Implement best practices for code quality and testing'
  });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  // API configuration
  // API is now imported from config/api.js

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission with demo data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.resumeText.trim() || !formData.jobDescription.trim()) {
      toast.error('Please fill in both resume text and job description');
      return;
    }

    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Demo analysis data
      const demoAnalysisData = {
        summary: "Experienced Full-Stack Developer with 5+ years of expertise in React, Node.js, and cloud technologies. Proven track record of delivering scalable web applications and leading development teams. Strong background in modern JavaScript frameworks, database design, and DevOps practices.",
        missingKeywords: [
          "TypeScript",
          "Docker",
          "Kubernetes", 
          "AWS",
          "Microservices",
          "GraphQL",
          "Redis",
          "MongoDB",
          "Jest",
          "CI/CD"
        ],
        matchScore: 78,
        improvementSuggestions: "To improve your match score, consider adding experience with TypeScript for better code quality, Docker for containerization, and AWS for cloud deployment. Highlight your experience with testing frameworks like Jest and include specific metrics about project impact and team leadership. Consider adding a projects section showcasing your technical skills with live demos or GitHub links."
      };

      setAnalysisData(demoAnalysisData);
      setShowResults(true);
      toast.success('Resume analysis completed successfully! (Demo Mode)');
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
                placeholder="Paste your resume content here... Include your experience, skills, education, and achievements. (Sample text is pre-filled for demo)"
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
                placeholder="Paste the job description you want to match your resume against... (Sample job description is pre-filled for demo)"
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
