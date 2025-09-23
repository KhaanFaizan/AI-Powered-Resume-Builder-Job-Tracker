import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <nav className="nav">
          <div className="nav-brand">
            <h1>AI Resume Builder</h1>
          </div>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link nav-link-primary">Get Started</Link>
          </div>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Build Your Perfect Resume with
              <span className="gradient-text"> AI Power</span>
            </h1>
            <p className="hero-description">
              Create professional, ATS-friendly resumes in minutes. Our AI analyzes job descriptions 
              and optimizes your resume for maximum impact.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                Start Building
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="resume-preview">
              <div className="resume-header">
                <div className="avatar"></div>
                <div className="name-placeholder">John Doe</div>
                <div className="title-placeholder">Software Engineer</div>
              </div>
              <div className="resume-sections">
                <div className="section">
                  <div className="section-title">Experience</div>
                  <div className="section-content">
                    <div className="experience-item">
                      <div className="job-title">Senior Developer</div>
                      <div className="company">Tech Corp</div>
                    </div>
                  </div>
                </div>
                <div className="section">
                  <div className="section-title">Skills</div>
                  <div className="skills">
                    <span className="skill-tag">React</span>
                    <span className="skill-tag">Node.js</span>
                    <span className="skill-tag">Python</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2 className="section-title">Why Choose Our AI Resume Builder?</h2>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">🤖</div>
                <h3>AI-Powered</h3>
                <p>Our advanced AI analyzes job descriptions and optimizes your resume for maximum ATS compatibility.</p>
              </div>
              <div className="feature">
                <div className="feature-icon">⚡</div>
                <h3>Lightning Fast</h3>
                <p>Create professional resumes in minutes, not hours. Our streamlined process gets you results quickly.</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🎯</div>
                <h3>Targeted</h3>
                <p>Customize your resume for each job application with our intelligent keyword optimization.</p>
              </div>
              <div className="feature">
                <div className="feature-icon">📊</div>
                <h3>Analytics</h3>
                <p>Track your applications and get insights into your job search performance.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="container">
          <p>&copy; 2024 AI Resume Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
