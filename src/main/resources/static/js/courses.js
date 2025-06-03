/**
 * Student Enrollment System - Courses Module
 * Handles all course-related operations
 */

// Modal elements
const courseModal = document.getElementById('courseModal');
const courseModalTitle = document.getElementById('courseModalTitle');
const courseForm = document.getElementById('courseForm');
const courseIdInput = document.getElementById('courseId');
const courseCodeInput = document.getElementById('courseCode');
const courseTitleInput = document.getElementById('courseTitle');
const courseDescriptionInput = document.getElementById('courseDescription');
const creditsInput = document.getElementById('credits');
const maxCapacityInput = document.getElementById('maxCapacity');
const saveCourseBtn = document.getElementById('saveCourseBtn');

// Initialize Bootstrap modal
const courseModalInstance = new bootstrap.Modal(courseModal);

// Event listeners for course operations
document.addEventListener('DOMContentLoaded', function() {
    // Add course button
    const addCourseBtn = document.getElementById('add-course-btn');
    addCourseBtn.addEventListener('click', openAddCourseModal);

    // Save course button
    saveCourseBtn.addEventListener('click', saveCourse);
});

/**
 * Opens modal to add a new course
 */
function openAddCourseModal() {
    courseModalTitle.textContent = 'Add Course';
    courseForm.reset();
    courseIdInput.value = '';
    courseModalInstance.show();
}

/**
 * Opens modal to edit an existing course
 * @param {number} id - Course ID
 */
function openEditCourseModal(id) {
    courseModalTitle.textContent = 'Edit Course';
    courseForm.reset();

    // Fetch course data from API
    fetch(`${API_BASE_URL}/courses/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(course => {
            courseIdInput.value = course.id;
            courseCodeInput.value = course.code;
            courseTitleInput.value = course.title;
            courseDescriptionInput.value = course.description || '';
            creditsInput.value = course.credits;
            maxCapacityInput.value = course.maxCapacity;

            courseModalInstance.show();
        })
        .catch(error => {
            console.error('Error fetching course:', error);
            showAlert('Failed to load course data', 'danger');
        });
}

/**
 * Saves a course (create or update)
 */
function saveCourse() {
    // Form validation
    if (!courseForm.checkValidity()) {
        courseForm.reportValidity();
        return;
    }

    // Prepare data
    const courseData = {
        code: courseCodeInput.value.trim(),
        title: courseTitleInput.value.trim(),
        description: courseDescriptionInput.value.trim(),
        credits: parseInt(creditsInput.value),
        maxCapacity: parseInt(maxCapacityInput.value)
    };

    const isEditMode = courseIdInput.value !== '';
    const url = isEditMode
        ? `${API_BASE_URL}/courses/${courseIdInput.value}`
        : `${API_BASE_URL}/courses`;

    const method = isEditMode ? 'PUT' : 'POST';

    // Send request to API
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        courseModalInstance.hide();
        showAlert(`Course ${isEditMode ? 'updated' : 'added'} successfully`, 'success');
        loadCourses();
    })
    .catch(error => {
        console.error('Error saving course:', error);
        showAlert(`Failed to ${isEditMode ? 'update' : 'add'} course`, 'danger');
    });
}

/**
 * Loads all courses from API
 */
function loadCourses() {
    const coursesTableBody = document.getElementById('courses-table-body');
    coursesTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Loading courses...</td></tr>';

    fetch(`${API_BASE_URL}/courses`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(courses => {
            if (courses.length === 0) {
                coursesTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No courses found</td></tr>';
                return;
            }

            let html = '';
            courses.forEach(course => {
                html += `
                <tr>
                    <td>${course.id}</td>
                    <td>${course.code}</td>
                    <td>${course.title}</td>
                    <td>${course.credits}</td>
                    <td>${course.maxCapacity}</td>
                    <td>${course.enrolled || 0}</td>
                    <td>
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-sm btn-outline-primary action-btn" onclick="openEditCourseModal(${course.id})">
                                <i class="bi bi-pencil-square"></i> Edit
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger action-btn" onclick="openDeleteConfirmModal('course', ${course.id}, '${course.title}')">
                                <i class="bi bi-trash"></i> Delete
                            </button>
                        </div>
                    </td>
                </tr>`;
            });

            coursesTableBody.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
            coursesTableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error loading courses</td></tr>';
        });
}

/**
 * Handles delete confirmation for course
 */
function handleDeleteConfirm() {
    const type = deleteItemType.value;
    const id = deleteItemId.value;

    if (type !== 'course') return;

    // Delete course
    fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        deleteConfirmModalInstance.hide();
        showAlert('Course deleted successfully', 'success');
        loadCourses();
    })
    .catch(error => {
        console.error('Error deleting course:', error);
        deleteConfirmModalInstance.hide();
        showAlert('Failed to delete course. Make sure there are no active enrollments.', 'danger');
    });
}