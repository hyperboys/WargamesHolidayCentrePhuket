// Example configuration file
// Copy this to config.js and update with your production values
// Add config.js to .gitignore to keep credentials safe

const CONFIG = {
    // API Configuration
    API_URL: {
        development: 'http://localhost:3000',
        production: 'https://api.wargameshc.com' // Replace with your actual API domain
    },
    
    // Contact Information
    contact: {
        phone: '+66 (0) 92-721-9803',
        email: 'info@wargameshc.com'
    },
    
    // Feature Flags
    features: {
        enableBackendHealthCheck: true,
        enableAnalytics: false // Set to true when ready
    }
};

// Auto-detect environment
CONFIG.currentEnvironment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'development' 
    : 'production';

CONFIG.API_BASE_URL = CONFIG.API_URL[CONFIG.currentEnvironment];
