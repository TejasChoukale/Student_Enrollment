document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Handle Add Student button
    const addStudentBtn = document.getElementById('add-student-btn');
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', function() {
            // Reset form for new student
            document.getElementById('studentForm').reset();
            document.getElementById('studentId').value = '';
            document.getElementById('studentModalLabel').textContent = 'Add New Student';
            document.getElementById('saveStudentBtn').textContent = 'Save Student';
        });
    }

    // Handle Edit Student buttons
    document.querySelectorAll('.edit-student-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Populate form with student data
            const id = this.getAttribute('data-id');
            const firstName = this.getAttribute('data-firstname');
            const lastName = this.getAttribute('data-lastname');
            const email = this.getAttribute('data-email');
            const dateOfBirth = this.getAttribute('data-dateofbirth');

            document.getElementById('studentId').value = id || '';
            document.getElementById('firstName').value = firstName || '';
            document.getElementById('lastName').value = lastName || '';
            document.getElementById('email').value = email || '';
            document.getElementById('dateOfBirth').value = dateOfBirth || '';

            document.getElementById('studentModalLabel').textContent = 'Edit Student';
            document.getElementById('saveStudentBtn').textContent = 'Update Student';
        });
    });

    // Handle Delete Student buttons
    document.querySelectorAll('.delete-student-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');

            document.getElementById('deleteStudentId').value = id;
            document.getElementById('deleteStudentName').textContent = name;
            document.getElementById('deleteConfirmMessage').innerHTML =
                `Are you sure you want to delete student <strong>${name}</strong>?`;
        });
    });

    // Reset modal when closed
    const studentModal = document.getElementById('studentModal');
    if (studentModal) {
        studentModal.addEventListener('hidden.bs.modal', function() {
            document.getElementById('studentForm').reset();
            document.getElementById('studentId').value = '';
            document.getElementById('studentModalLabel').textContent = 'Add New Student';
            document.getElementById('saveStudentBtn').textContent = 'Save Student';
        });
    }

    // Handle delete confirmation
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            const studentId = document.getElementById('deleteItemId').value;
            const itemType = document.getElementById('deleteItemType').value;

            if (itemType === 'student' && studentId) {
                // Create a form and submit it
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = '/students/delete';

                const idInput = document.createElement('input');
                idInput.type = 'hidden';
                idInput.name = 'id';
                idInput.value = studentId;

                form.appendChild(idInput);
                document.body.appendChild(form);
                form.submit();
            }
        });
    }
});