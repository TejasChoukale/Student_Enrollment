// Authentication module loading
console.log('Authentication module loading...');

// Global namespace
window.StudentEnrollment = window.StudentEnrollment || {};

// Define auth constants globally under the namespace
window.StudentEnrollment.AUTH_TOKEN_KEY = 'auth_token';
window.StudentEnrollment.USERNAME_KEY = 'username';
window.StudentEnrollment.AUTH_HEADER_TYPE_KEY = 'auth_header_type';

// Auth module
(function () {
    function login(username, password, rememberMe = false) {
        console.log('Login attempt for user:', username);

        return new Promise((resolve, reject) => {
            if (!username || !password) {
                reject(new Error('Username and password are required'));
                return;
            }

            logout(false);

            // Dummy login logic
            if (username === 'admin' && password === 'admin123') {
                const mockToken = 'mock-jwt-token-' + Date.now();
                console.log('Login successful, generating token');

                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem(window.StudentEnrollment.AUTH_TOKEN_KEY, mockToken);
                storage.setItem(window.StudentEnrollment.USERNAME_KEY, username);
                storage.setItem(window.StudentEnrollment.AUTH_HEADER_TYPE_KEY, 'bearer');

                updateAuthUI(username);
                showAlert('Login successful!', 'success');
                resolve({ success: true, username });
            } else {
                console.log('Login failed: Invalid credentials');
                reject(new Error('Invalid username or password'));
            }
        });
    }

    function logout(showNotification = true) {
        console.log('Logging out user');

        localStorage.removeItem(window.StudentEnrollment.AUTH_TOKEN_KEY);
        localStorage.removeItem(window.StudentEnrollment.USERNAME_KEY);
        localStorage.removeItem(window.StudentEnrollment.AUTH_HEADER_TYPE_KEY);
        sessionStorage.removeItem(window.StudentEnrollment.AUTH_TOKEN_KEY);
        sessionStorage.removeItem(window.StudentEnrollment.USERNAME_KEY);
        sessionStorage.removeItem(window.StudentEnrollment.AUTH_HEADER_TYPE_KEY);

        updateAuthUI(null);
        if (showNotification) showAlert('You have been logged out.', 'info');
    }

    function isAuthenticated() {
        const token = localStorage.getItem(window.StudentEnrollment.AUTH_TOKEN_KEY) ||
            sessionStorage.getItem(window.StudentEnrollment.AUTH_TOKEN_KEY);
        return !!token;
    }

    function getCurrentUsername() {
        if (!isAuthenticated()) return null;
        return localStorage.getItem(window.StudentEnrollment.USERNAME_KEY) ||
            sessionStorage.getItem(window.StudentEnrollment.USERNAME_KEY);
    }

    window.updateAuthUI = function (username) {
        const navLoginBtn = document.getElementById('nav-login-btn');
        const navLogoutBtn = document.getElementById('nav-logout-btn');
        const usernameSpan = document.getElementById('username-span');

        if (username) {
            if (navLoginBtn) navLoginBtn.style.display = 'none';
            if (navLogoutBtn) navLogoutBtn.style.display = 'inline-block';
            if (usernameSpan) usernameSpan.textContent = username;
        } else {
            if (navLoginBtn) navLoginBtn.style.display = 'inline-block';
            if (navLogoutBtn) navLogoutBtn.style.display = 'none';
        }
    };

    window.showAlert = function (message, type = 'success') {
        const alertContainer = document.getElementById('alert-container');
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('alert', `alert-${type}`);
        alertDiv.textContent = message;
        alertContainer.appendChild(alertDiv);

        setTimeout(() => {
            alertContainer.removeChild(alertDiv);
        }, 5000);
    };

    window.StudentEnrollment.auth = { login, logout, isAuthenticated, getCurrentUsername };
})();
