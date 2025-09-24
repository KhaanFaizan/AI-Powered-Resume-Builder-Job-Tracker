// Configuration for different environments
const config = {
  development: {
    API_URL: 'http://localhost:5000'
  },
  production: {
    // For single deployment, API and frontend are on same domain
    API_URL: process.env.REACT_APP_API_URL || window.location.origin
  }
};

const environment = process.env.NODE_ENV || 'development';
export default config[environment];
