/**
 * Script Loader for Student Enrollment System
 * Ensures proper loading of JavaScript dependencies
 */

// Create global namespace for the application
window.StudentEnrollment = window.StudentEnrollment || {};

/**
 * Script loading utility for ordered dependency loading
 */
(function() {
    // List of scripts to load in order
    const scripts = [
        '/js/authentication.js',
        '/js/api-config.js',
        '/js/login.js'
    ];

    let scriptIndex = 0;

    /**
     * Load a script and move to the next one when complete
     */
    function loadNextScript() {
        if (scriptIndex >= scripts.length) {
            console.log('All scripts loaded successfully!');
            // Initialize the application now that all scripts are loaded
            if (window.StudentEnrollment.init) {
                window.StudentEnrollment.init();
            }
            return;
        }

        const scriptPath = scripts[scriptIndex];
        const script = document.createElement('script');
        script.src = scriptPath;

        // Remove explicit type setting - browser will use default JavaScript MIME type
        // script.type = 'application/javascript';

        // Move to next script when this one loads
        script.unload = function() {
            console.log(`Script loaded: ${scriptPath}`);
            scriptIndex++;
            loadNextScript();
        };

        // Handle loading errors
        script.onerror = function(event) {
            console.error(`Failed to load script: ${scriptPath}`, event);
            let alertContainer = document.getElementById('alert-container');
            if (!alertContainer) {
                alertContainer = document.createElement('div');
                alertContainer.id = 'alert-container';
                alertContainer.className = 'container mt-3';
                document.body.insertBefore(alertContainer, document.body.firstChild);
            }

            alertContainer.innerHTML += `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Failed to load required script: ${scriptPath}. Please refresh or contact support.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        };

        document.body.appendChild(script);
    }

    // Start loading scripts when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM ready, loading scripts...');
        loadNextScript();
    });
})();

// Application initialization
window.StudentEnrollment.init = function() {
    console.log('Initializing Student Enrollment System...');

    // Check if Auth module is available
    if (window.Auth) {
        console.log('Auth module detected');

        // Check if user is authenticated
        if (window.Auth.isAuthenticated()) {
            console.log('User is authenticated');
        } else {
            console.log('User is not authenticated');
        }
    } else {
        console.error('Auth module not available!');
        showSystemAlert('Authentication module not loaded properly. Please contact support.', 'danger');
    }
};

/**
 * Show system alert
 * @param {string} message - Alert message
 * @param {string} type - Alert type (success, danger, warning, info)
 */
function showSystemAlert(message, type = 'info') {
    let alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        alertContainer.className = 'container mt-3';
        document.body.insertBefore(alertContainer, document.body.firstChild);
    }

    const alertId = 'alert-' + Date.now();
    const alertHtml = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    alertContainer.innerHTML += alertHtml;
}