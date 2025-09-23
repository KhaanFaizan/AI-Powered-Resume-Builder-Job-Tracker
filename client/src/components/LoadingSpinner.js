import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className={`spinner ${size}`}>
        <div className="spinner-inner"></div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
