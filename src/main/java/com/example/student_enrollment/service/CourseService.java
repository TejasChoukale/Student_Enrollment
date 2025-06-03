package com.example.student_enrollment.service;

import com.example.student_enrollment.dto.CourseDTO;
import com.example.student_enrollment.entity.Course;
import com.example.student_enrollment.exception.ResourceNotFoundException;
import com.example.student_enrollment.repository.CourseRepository;
import com.example.student_enrollment.repository.EnrollmentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Autowired
    public CourseService(CourseRepository courseRepository, EnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> getAvailableCourses() {
        return courseRepository.findAvailableCourses().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return convertToDTO(course);
    }

    public CourseDTO createCourse(CourseDTO courseDTO) {
        if (courseRepository.existsByCode(courseDTO.getCode())) {
            throw new IllegalArgumentException("Course code already exists: " + courseDTO.getCode());
        }

        Course course = new Course();
        course.setCode(courseDTO.getCode());
        course.setTitle(courseDTO.getTitle());
        course.setDescription(courseDTO.getDescription());
        course.setCredits(courseDTO.getCredits());
        course.setMaxCapacity(courseDTO.getMaxCapacity());

        Course savedCourse = courseRepository.save(course);
        return convertToDTO(savedCourse);
    }

    public CourseDTO updateCourse(Long id, CourseDTO courseDTO) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        if (!course.getCode().equals(courseDTO.getCode()) &&
                courseRepository.existsByCode(courseDTO.getCode())) {
            throw new IllegalArgumentException("Course code already exists: " + courseDTO.getCode());
        }

        course.setCode(courseDTO.getCode());
        course.setTitle(courseDTO.getTitle());
        course.setDescription(courseDTO.getDescription());
        course.setCredits(courseDTO.getCredits());
        course.setMaxCapacity(courseDTO.getMaxCapacity());

        Course updatedCourse = courseRepository.save(course);
        return convertToDTO(updatedCourse);
    }

    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }

    // Helper method to convert Entity to DTO
    private CourseDTO convertToDTO(Course course) {
        Long courseId = course.getId();
        Long currentEnrollment = courseId != null ?
                enrollmentRepository.countEnrollmentsByCourseId(courseId) : 0L;

        return new CourseDTO(
                course.getId(),
                course.getCode(),
                course.getTitle(),
                course.getDescription(),
                course.getCredits(),
                course.getMaxCapacity(),
                currentEnrollment.intValue()  // safely convert Long to int
        );
    }

    public Course getCourseEntityById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
    }

    public long getCourseCount() {
        return courseRepository.count();
    }

    public List<Map<String, Object>> getPopularCourses(int limit) {
        return courseRepository.findAll().stream()
                .map(course -> {
                    Map<String, Object> courseMap = new HashMap<>();
                    courseMap.put("title", course.getTitle());
                    courseMap.put("code", course.getCode());
                    courseMap.put("maxCapacity", course.getMaxCapacity());
                    courseMap.put("enrolled", enrollmentRepository.countEnrollmentsByCourseId(course.getId()));
                    return courseMap;
                })
                .sorted((c1, c2) -> {
                    Number enrolled1 = (Number) c1.get("enrolled");
                    Number enrolled2 = (Number) c2.get("enrolled");
                    return Long.compare(enrolled2.longValue(), enrolled1.longValue());  // descending order
                })
                .limit(limit)
                .collect(Collectors.toList());
    }
}
