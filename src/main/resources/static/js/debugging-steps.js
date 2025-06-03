// Add this debug code to your authentication.js file at the top
console.log('Authentication module loading...');

// Add this at the end of your authentication.js file
console.log('Authentication module loaded successfully!');
console.log('Auth object available:', !!window.Auth);

// Then add this to your login.js right after the DOMContentLoaded event
console.log('Login script running...');
console.log('Auth module available:', typeof window.Auth !== 'undefined');
console.log('Auth methods:', window.Auth ? Object.keys(window.Auth) : 'not available');