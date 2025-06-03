// EnrollmentRepository.java
package com.example.student_enrollment.repository;

import com.example.student_enrollment.entity.Course;
import com.example.student_enrollment.entity.Enrollment;
import com.example.student_enrollment.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.student_enrollment.entity.Enrollment.EnrollmentStatus;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findTop5ByOrderByEnrollmentDateDesc();
    List<Enrollment> findByStudent(Student student);
    List<Enrollment> findByCourse(Course course);
    Optional<Enrollment> findByStudentAndCourse(Student student, Course course);

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId")
    Long countEnrollmentsByCourseId(Long courseId);

    List<Enrollment> findByStatus(Enrollment.EnrollmentStatus status);
}