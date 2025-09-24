import React from 'react';
import './AIResultCards.css';

const AIResultCards = ({ analysisData, onClose }) => {
  const results = analysisData;

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  if (!results) {
    return null;
  }

  return (
    <div className="ai-analysis-modal">
      <div className="ai-modal-content">
        <div className="ai-modal-header">
          <h2>🤖 AI Resume Analysis Results</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="ai-modal-body">
          <div className="ai-results-section">
            <div className="results-grid">
              {/* Resume Summary Card */}
              <div className="result-card summary-card">
                <div className="card-header">
                  <div className="card-icon">📄</div>
                  <h4>Resume Summary</h4>
                </div>
                <div className="card-content">
                  <p>{results.summary}</p>
                </div>
              </div>

              {/* Missing Keywords Card */}
              <div className="result-card keywords-card">
                <div className="card-header">
                  <div className="card-icon">🏷️</div>
                  <h4>Missing Keywords</h4>
                </div>
                <div className="card-content">
                  <div className="keywords-container">
                    {results.missingKeywords.map((keyword, index) => (
                      <span key={index} className="keyword-badge">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Match Score Card */}
              <div className="result-card score-card">
                <div className="card-header">
                  <div className="card-icon">🎯</div>
                  <h4>Match Score</h4>
                </div>
                <div className="card-content">
                  <div className="score-display">
                    <div 
                      className="score-circle"
                      style={{ 
                        background: `conic-gradient(${getScoreColor(results.matchScore)} ${results.matchScore * 3.6}deg, #e5e7eb 0deg)` 
                      }}
                    >
                      <div className="score-inner">
                        <span className="score-number">{results.matchScore}</span>
                        <span className="score-percent">%</span>
                      </div>
                    </div>
                    <div className="score-label">{getScoreLabel(results.matchScore)}</div>
                  </div>
                </div>
              </div>

              {/* Improvement Suggestions Card */}
              <div className="result-card suggestions-card">
                <div className="card-header">
                  <div className="card-icon">💡</div>
                  <h4>Improvement Suggestions</h4>
                </div>
                <div className="card-content">
                  <p>{results.improvementSuggestions}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResultCards;
