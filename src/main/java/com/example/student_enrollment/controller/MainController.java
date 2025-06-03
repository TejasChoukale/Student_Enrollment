package com.example.student_enrollment.controller;

import com.example.student_enrollment.service.StudentService;
import com.example.student_enrollment.service.CourseService;
import com.example.student_enrollment.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.security.Principal;

@Controller
public class MainController {

    private final StudentService studentService;
    private final CourseService courseService;
    private final EnrollmentService enrollmentService;

    @Autowired
    public MainController(StudentService studentService,
                          CourseService courseService,
                          EnrollmentService enrollmentService) {
        this.studentService = studentService;
        this.courseService = courseService;
        this.enrollmentService = enrollmentService;
    }

    @GetMapping("/")
    public String index(Model model, Principal principal) {
        return loadDashboardData(model, principal);
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model, Principal principal) {
        return loadDashboardData(model, principal);
    }

    private String loadDashboardData(Model model, Principal principal) {
        try {
            // Add username to model for navbar
            if (principal != null) {
                model.addAttribute("username", principal.getName());
            }

            // Dashboard counts
            long studentCount = studentService.getStudentCount();
            long courseCount = courseService.getCourseCount();
            long enrollmentCount = enrollmentService.getEnrollmentCount();

            model.addAttribute("studentCount", studentCount);
            model.addAttribute("courseCount", courseCount);
            model.addAttribute("enrollmentCount", enrollmentCount);

            // Recent enrollments and popular courses
            model.addAttribute("recentEnrollments", enrollmentService.getRecentEnrollments());
            model.addAttribute("popularCourses", courseService.getPopularCourses(5));

            // All data for fragments
            model.addAttribute("students", studentService.getAllStudents());
            model.addAttribute("courses", courseService.getAllCourses());
            model.addAttribute("enrollments", enrollmentService.getAllEnrollments());

            // Debug logging
            System.out.println("=== DASHBOARD DATA DEBUG ===");
            System.out.println("Username: " + (principal != null ? principal.getName() : "Not logged in"));
            System.out.println("Student Count: " + studentCount);
            System.out.println("Course Count: " + courseCount);
            System.out.println("Enrollment Count: " + enrollmentCount);
            System.out.println("Recent Enrollments Size: " + enrollmentService.getRecentEnrollments().size());
            System.out.println("Popular Courses Size: " + courseService.getPopularCourses(5).size());
            System.out.println("Students Size: " + studentService.getAllStudents().size());
            System.out.println("============================");

        } catch (Exception e) {
            System.err.println("Error loading dashboard data: " + e.getMessage());
            e.printStackTrace();

            // Add username even if dashboard data fails
            if (principal != null) {
                model.addAttribute("username", principal.getName());
            }

            // Set safe defaults
            model.addAttribute("studentCount", 0);
            model.addAttribute("courseCount", 0);
            model.addAttribute("enrollmentCount", 0);
            model.addAttribute("recentEnrollments", java.util.Collections.emptyList());
            model.addAttribute("popularCourses", java.util.Collections.emptyList());
            model.addAttribute("students", java.util.Collections.emptyList());
            model.addAttribute("courses", java.util.Collections.emptyList());
            model.addAttribute("enrollments", java.util.Collections.emptyList());
        }

        return "index"; // Return index.html
    }
}