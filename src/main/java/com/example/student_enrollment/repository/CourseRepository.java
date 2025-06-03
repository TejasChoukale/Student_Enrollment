// CourseRepository.java
package com.example.student_enrollment.repository;

import com.example.student_enrollment.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCode(String code);
    boolean existsByCode(String code);

    @Query("SELECT c FROM Course c WHERE SIZE(c.enrollments) < c.maxCapacity")
    List<Course> findAvailableCourses();
}