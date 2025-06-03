package com.example.student_enrollment.exception;

import com.example.student_enrollment.entity.Course;
import com.example.student_enrollment.repository.CourseRepository;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToCourseConverter implements Converter<String, Course> {

    private final CourseRepository courseRepository;

    public StringToCourseConverter(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public Course convert(String source) {
        if (source == null || source.isEmpty()) {
            return null;
        }
        try {
            Long id = Long.valueOf(source);
            return courseRepository.findById(id).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
