// Configuration for different environments
const config = {
  development: {
    API_URL: 'http://localhost:5000'
  },
  production: {
    // Your deployed backend URL
    API_URL: process.env.REACT_APP_API_URL || 'https://ai-powered-resume-builder-job-tracker.onrender.com'
  }
};

const environment = process.env.NODE_ENV || 'development';
export default config[environment];
