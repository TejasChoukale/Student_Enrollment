document.getElementById("manage-enrollments-btn").addEventListener("click", () => {
    document.getElementById("enrollments-link").click();
});

document.getElementById("create-enrollment-btn").addEventListener("click", () => {
    // Open enrollment creation modal
});

function loadEnrollments() {
    const tbody = document.getElementById("enrollments-table-body");

    // Clear any existing rows
    tbody.innerHTML = '';

    // Fetch enrollment data from the backend
    fetch('/api/enrollments')
        .then(response => response.json()) // Parse JSON data
        .then(data => {
            // Check if data is not empty
            if (data && data.length > 0) {
                // Loop through the data and add each enrollment as a row
                data.forEach(enrollment => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${enrollment.id}</td>
                        <td>${enrollment.studentName}</td>
                        <td>${enrollment.courseTitle}</td>
                        <td>${enrollment.enrollmentDate}</td>
                        <td><span class="badge bg-${getStatusBadgeClass(enrollment.status)}">${enrollment.status}</span></td>
                        <td>${enrollment.grade}</td>
                        <td><button class="btn btn-sm btn-primary">Edit</button></td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                // Display a message if no enrollments exist
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="7" class="text-center">No enrollments found</td>`;
                tbody.appendChild(row);
            }
        })
        .catch(error => {
            console.error('Error fetching enrollments:', error);
        });
}

// Utility function to get the badge class based on enrollment status
function getStatusBadgeClass(status) {
    switch(status) {
        case 'APPROVED': return 'success';
        case 'PENDING': return 'warning';
        case 'REJECTED': return 'danger';
        default: return 'secondary';
    }
}
