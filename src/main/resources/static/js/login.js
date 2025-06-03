document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const loginErrorMessage = document.getElementById('loginErrorMessage');

    if (typeof window.StudentEnrollment === 'undefined' || !window.StudentEnrollment.auth) {
        console.error('Auth module not found.');
        showAlert('Authentication module not loaded properly. Please contact support.', 'danger');
        return;
    }

    if (window.StudentEnrollment.auth.isAuthenticated()) {
        console.log('User already authenticated, redirecting to dashboard');
        window.location.href = 'dashboard.html';
        return;
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            if (loginButton) {
                loginButton.disabled = true;
                loginButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
            }

            const username = document.getElementById('username')?.value.trim();
            const password = document.getElementById('password')?.value.trim();
            const rememberMe = document.getElementById('rememberMe')?.checked;

            if (!username || !password) {
                showLoginError('Please enter both username and password.');
                resetLoginButton();
                return;
            }

            loginErrorMessage.style.display = 'none';

            window.StudentEnrollment.auth.login(username, password, rememberMe)
                .then(() => window.location.href = 'dashboard.html')
                .catch((error) => {
                    showLoginError(error.message);
                    resetLoginButton();
                });
        });
    }

    ['username', 'password'].forEach((id) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                if (loginErrorMessage) loginErrorMessage.style.display = 'none';
            });
        }
    });

    function showLoginError(message) {
        if (loginErrorMessage) {
            loginErrorMessage.textContent = message;
            loginErrorMessage.style.display = 'block';
        } else {
            showAlert(message, 'danger');
        }
    }

    function resetLoginButton() {
        if (loginButton) {
            loginButton.disabled = false;
            loginButton.innerHTML = 'Log In';
        }
    }

    function showAlert(message, type = 'info') {
        if (typeof window.showAlert === 'function') {
            window.showAlert(message, type);
            return;
        }

        let alertContainer = document.getElementById('alert-container');
        if (!alertContainer) {
            alertContainer = document.createElement('div');
            alertContainer.id = 'alert-container';
            alertContainer.className = 'position-fixed top-0 start-50 translate-middle-x p-3';
            alertContainer.style.zIndex = '1050';
            document.body.appendChild(alertContainer);
        }

        const alertId = 'alert-' + Date.now();
        const alertHtml = `
            <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        alertContainer.innerHTML += alertHtml;

        setTimeout(() => {
            const el = document.getElementById(alertId);
            if (el) el.remove();
        }, 5000);
    }
});
