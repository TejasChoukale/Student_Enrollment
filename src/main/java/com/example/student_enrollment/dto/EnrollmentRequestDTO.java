package com.example.student_enrollment.dto;

public class EnrollmentRequestDTO {
    private Long studentId;
    private Long courseId;

    // Constructors, getters, and setters
    public EnrollmentRequestDTO() {}

    public EnrollmentRequestDTO(Long studentId, Long courseId) {
        this.studentId = studentId;
        this.courseId = courseId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}
