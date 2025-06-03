// API Config
const API_BASE_URL = 'https://api.enrollmentsystem.example/v1';

const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    STUDENTS: `${API_BASE_URL}/students`,
    STUDENT: (id) => `${API_BASE_URL}/students/${id}`,
    COURSES: `${API_BASE_URL}/courses`,
    COURSE: (id) => `${API_BASE_URL}/courses/${id}`,
    ENROLLMENTS: `${API_BASE_URL}/enrollments`,
    ENROLLMENT: (id) => `${API_BASE_URL}/enrollments/${id}`,
};

window.API_CONFIG = {
    BASE_URL: API_BASE_URL,
    ENDPOINTS: API_ENDPOINTS
};
