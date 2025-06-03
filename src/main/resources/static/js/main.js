/**
 * Student Enrollment System - Main JavaScript
 * Core functionality and navigation handling
 */

// API Base URL - Replace with your actual backend URL
const API_BASE_URL = 'http://localhost:8080/api';

// Page navigation
document.addEventListener('DOMContentLoaded', function() {
    // Navigation links
    const dashboardLink = document.getElementById('dashboard-link');
    const studentsLink = document.getElementById('students-link');
    const coursesLink = document.getElementById('courses-link');
    const enrollmentsLink = document.getElementById('enrollments-link');

    // Dashboard action buttons
    const manageStudentsBtn = document.getElementById('manage-students-btn');
    const manageCoursesBtn = document.getElementById('manage-courses-btn');
    const manageEnrollmentsBtn = document.getElementById('manage-enrollments-btn');

    // Sections
    const dashboardSection = document.getElementById('dashboard');
    const studentsSection = document.getElementById('students');
    const coursesSection = document.getElementById('courses');
    const enrollmentsSection = document.getElementById('enrollments');

    // Breadcrumb
    const breadcrumb = document.getElementById('breadcrumb');

    // Navigation event listeners
    dashboardLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSection('dashboard');
        updateBreadcrumb('Dashboard');
        updateNavActive(this);
        loadDashboardData();
    });

    studentsLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSection('students');
        updateBreadcrumb('Students');
        updateNavActive(this);
        loadStudents();
    });

    coursesLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSection('courses');
        updateBreadcrumb('Courses');
        updateNavActive(this);
        loadCourses();
    });

    enrollmentsLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSection('enrollments');
        updateBreadcrumb('Enrollments');
        updateNavActive(this);
        loadEnrollments();
    });

    // Dashboard buttons
    manageStudentsBtn.addEventListener('click', function() {
        studentsLink.click();
    });

    manageCoursesBtn.addEventListener('click', function() {
        coursesLink.click();
    });

    manageEnrollmentsBtn.addEventListener('click', function() {
        enrollmentsLink.click();
    });

    // Load dashboard data on page load
    loadDashboardData();
});

/**
 * Shows a specific section and hides others
 * @param {string} sectionId - ID of the section to show
 */
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

/**
 * Updates the active state of navigation links
 * @param {HTMLElement} activeLink - Active navigation link
 */
function updateNavActive(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

/**
 * Updates the breadcrumb
 * @param {string} pageName - Name of the current page
 */
function updateBreadcrumb(pageName) {
    const breadcrumb = document.getElementById('breadcrumb');
    breadcrumb.innerHTML = `<li class="breadcrumb-item active" aria-current="page">${pageName}</li>`;
}

/**
 * Loads data for the dashboard
 */
function loadDashboardData() {
    // Load counts
    fetchStudentCount();
    fetchCourseCount();
    fetchEnrollmentCount();

    // Load recent enrollments
    fetchRecentEnrollments();

    // Load popular courses
    fetchPopularCourses();
}

/**
 * Fetches the total student count
 */
function fetchStudentCount() {
    fetch(`${API_BASE_URL}/students/count`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('student-count').textContent = data;
        })
        .catch(error => {
            console.error('Error fetching student count:', error);
            document.getElementById('student-count').textContent = '0';
        });
}

/**
 * Fetches the total course count
 */
function fetchCourseCount() {
    fetch(`${API_BASE_URL}/courses/count`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('course-count').textContent = data;
        })
        .catch(error => {
            console.error('Error fetching course count:', error);
            document.getElementById('course-count').textContent = '0';
        });
}

/**
 * Fetches the total enrollment count
 */
function fetchEnrollmentCount() {
    fetch(`${API_BASE_URL}/enrollments/count`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('enrollment-count').textContent = data;
        })
        .catch(error => {
            console.error('Error fetching enrollment count:', error);
            document.getElementById('enrollment-count').textContent = '0';
        });
}

/**
 * Fetches recent enrollments for dashboard
 */
function fetchRecentEnrollments() {
    fetch(`${API_BASE_URL}/enrollments/recent`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const recentEnrollmentsTable = document.getElementById('recent-enrollments');

            if (data.length === 0) {
                recentEnrollmentsTable.innerHTML = '<tr><td colspan="4" class="text-center">No recent enrollments</td></tr>';
                return;
            }

            let html = '';
            data.forEach(enrollment => {
                html += `
                <tr>
                    <td>${enrollment.studentName}</td>
                    <td>${enrollment.courseTitle}</td>
                    <td>${formatDate(enrollment.enrollmentDate)}</td>
                    <td><span class="badge badge-${enrollment.status.toLowerCase()}">${enrollment.status}</span></td>
                </tr>`;
            });

            recentEnrollmentsTable.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching recent enrollments:', error);
            document.getElementById('recent-enrollments').innerHTML =
                '<tr><td colspan="4" class="text-center">Failed to load enrollments</td></tr>';
        });
}

/**
 * Fetches popular courses for dashboard
 */
function fetchPopularCourses() {
    fetch(`${API_BASE_URL}/courses/popular`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const popularCoursesTable = document.getElementById('popular-courses');

            if (data.length === 0) {
                popularCoursesTable.innerHTML = '<tr><td colspan="4" class="text-center">No courses available</td></tr>';
                return;
            }

            let html = '';
            data.forEach(course => {
                html += `
                <tr>
                    <td>${course.title}</td>
                    <td>${course.code}</td>
                    <td>${course.maxCapacity}</td>
                    <td>${course.enrolled}</td>
                </tr>`;
            });

            popularCoursesTable.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching popular courses:', error);
            document.getElementById('popular-courses').innerHTML =
                '<tr><td colspan="4" class="text-center">Failed to load courses</td></tr>';
        });
}

/**
 * Shows a notification alert
 * @param {string} message - Alert message
 * @param {string} type - Alert type (success, danger, warning, info)
 * @param {number} timeout - Time in milliseconds before alert disappears (0 for no auto-dismiss)
 */
function showAlert(message, type = 'success', timeout = 3000) {
    const alertContainer = document.getElementById('alert-container');

    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.role = 'alert';

    // Add alert content
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Add to container
    alertContainer.appendChild(alertElement);

    // Auto dismiss if timeout > 0
    if (timeout > 0) {
        setTimeout(() => {
            alertElement.classList.remove('show');
            setTimeout(() => {
                alertContainer.removeChild(alertElement);
            }, 150);
        }, timeout);
    }
}

/**
 * Format date string to a more readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}