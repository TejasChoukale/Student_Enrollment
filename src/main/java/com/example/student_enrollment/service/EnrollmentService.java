// EnrollmentService.java
package com.example.student_enrollment.service;

import com.example.student_enrollment.dto.EnrollmentDTO;
import com.example.student_enrollment.dto.EnrollmentRequestDTO;
import com.example.student_enrollment.entity.Course;
import com.example.student_enrollment.entity.Enrollment;
import com.example.student_enrollment.entity.Student;
import com.example.student_enrollment.entity.Enrollment.EnrollmentStatus;
import com.example.student_enrollment.exception.ResourceNotFoundException;
import com.example.student_enrollment.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentService studentService;
    private final CourseService courseService;

    @Autowired
    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            StudentService studentService,
            CourseService courseService) {
        this.enrollmentRepository = enrollmentRepository;
        this.studentService = studentService;
        this.courseService = courseService;
    }

    public List<EnrollmentDTO> getAllEnrollments() {
        return enrollmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EnrollmentDTO> getEnrollmentsByStudentId(Long studentId) {
        Student student = studentService.getStudentEntityById(studentId);
        return enrollmentRepository.findByStudent(student).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EnrollmentDTO> getEnrollmentsByCourseId(Long courseId) {
        Course course = courseService.getCourseEntityById(courseId);
        return enrollmentRepository.findByCourse(course).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EnrollmentDTO getEnrollmentById(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + id));
        return convertToDTO(enrollment);
    }

    public EnrollmentDTO enrollStudentInCourse(EnrollmentRequestDTO requestDTO) {
        Student student = studentService.getStudentEntityById(requestDTO.getStudentId());
        Course course = courseService.getCourseEntityById(requestDTO.getCourseId());

        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByStudentAndCourse(student, course);
        if (existingEnrollment.isPresent()) {
            throw new IllegalArgumentException("Student is already enrolled in this course");
        }

        Long currentEnrollments = enrollmentRepository.countEnrollmentsByCourseId(course.getId());
        if (currentEnrollments >= course.getMaxCapacity()) {
            throw new IllegalArgumentException("Course has reached its maximum capacity");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(LocalDate.now());
        enrollment.setStatus(EnrollmentStatus.APPROVED);

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return convertToDTO(savedEnrollment);
    }

    public EnrollmentDTO updateEnrollmentStatus(Long id, EnrollmentStatus status) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + id));
        enrollment.setStatus(status);
        return convertToDTO(enrollmentRepository.save(enrollment));
    }

    public EnrollmentDTO assignGrade(Long id, String grade) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + id));
        enrollment.setGrade(grade);
        if (grade != null && !grade.isEmpty()) {
            enrollment.setStatus(EnrollmentStatus.COMPLETED);
        }
        return convertToDTO(enrollmentRepository.save(enrollment));
    }

    public void cancelEnrollment(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + id));
        enrollment.setStatus(EnrollmentStatus.DROPPED);
        enrollmentRepository.save(enrollment);
    }

    public long getEnrollmentCount() {
        return enrollmentRepository.count();
    }

    public List<EnrollmentDTO> getRecentEnrollments() {
        List<Enrollment> recentEnrollments = enrollmentRepository.findTop5ByOrderByEnrollmentDateDesc();
        return recentEnrollments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private EnrollmentDTO convertToDTO(Enrollment enrollment) {
        String studentName = enrollment.getStudent().getFirstName() + " " + enrollment.getStudent().getLastName();
        return new EnrollmentDTO(
                enrollment.getId(),
                enrollment.getStudent().getId(),
                studentName,
                enrollment.getCourse().getId(),
                enrollment.getCourse().getTitle(),
                enrollment.getEnrollmentDate(),
                enrollment.getGrade(),
                enrollment.getStatus()
        );
    }
}
