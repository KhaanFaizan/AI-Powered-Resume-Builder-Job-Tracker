import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [backendData, setBackendData] = useState(null);

  useEffect(() => {
    // Test backend connection
    const testBackend = async () => {
      try {
        const response = await axios.get('/health');
        setBackendStatus('Connected ✅');
        setBackendData(response.data);
      } catch (error) {
        setBackendStatus('Disconnected ❌');
        console.error('Backend connection failed:', error);
      }
    };

    testBackend();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Resume Builder</h1>
        <p>Frontend and Backend Connection Test</p>
        
        <div className="status-container">
          <h2>Backend Status: {backendStatus}</h2>
          {backendData && (
            <div className="backend-info">
              <p><strong>Status:</strong> {backendData.status}</p>
              <p><strong>Timestamp:</strong> {new Date(backendData.timestamp).toLocaleString()}</p>
              <p><strong>Uptime:</strong> {Math.floor(backendData.uptime)} seconds</p>
              <p><strong>Database:</strong> {backendData.database}</p>
              <p><strong>MongoDB:</strong> {backendData.mongodb}</p>
            </div>
          )}
        </div>

        <div className="test-buttons">
          <button 
            onClick={() => window.location.reload()}
            className="test-btn"
          >
            Refresh Test
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
