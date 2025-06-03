package com.example.student_enrollment.controller;

import com.example.student_enrollment.dto.EnrollmentDTO;
import com.example.student_enrollment.dto.EnrollmentRequestDTO;
import com.example.student_enrollment.entity.Enrollment.EnrollmentStatus;
import com.example.student_enrollment.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Controller
@RequestMapping("/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @Autowired
    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    // For the dedicated enrollments page
    @GetMapping
    public String getAllEnrollments(Model model) {
        List<EnrollmentDTO> enrollments = enrollmentService.getAllEnrollments();
        model.addAttribute("enrollments", enrollments);
        return "enrollments"; // This should be a separate enrollments.html template
    }

    // For AJAX requests (if you're using JavaScript to load data)
    @GetMapping("/api")
    @ResponseBody
    public ResponseEntity<List<EnrollmentDTO>> getAllEnrollmentsAPI() {
        List<EnrollmentDTO> enrollments = enrollmentService.getAllEnrollments();
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/{id}")
    public String getEnrollmentById(@PathVariable Long id, Model model) {
        EnrollmentDTO enrollment = enrollmentService.getEnrollmentById(id);
        model.addAttribute("enrollment", enrollment);
        return "enrollments/detail";
    }

    @GetMapping("/create")
    public String showCreateEnrollmentForm(Model model) {
        model.addAttribute("enrollment", new EnrollmentRequestDTO());
        return "enrollments/create";
    }

    @PostMapping
    public String enrollStudentInCourse(@ModelAttribute EnrollmentRequestDTO requestDTO) {
        enrollmentService.enrollStudentInCourse(requestDTO);
        return "redirect:/"; // Redirect to main dashboard
    }

    @PostMapping("/status/{id}")
    public String updateEnrollmentStatus(@PathVariable Long id, @RequestParam String status) {
        EnrollmentStatus statusEnum = EnrollmentStatus.valueOf(status.toUpperCase());
        enrollmentService.updateEnrollmentStatus(id, statusEnum);
        return "redirect:/"; // Redirect to main dashboard
    }

    @PostMapping("/grade/{id}")
    public String assignGrade(@PathVariable Long id, @RequestParam String grade) {
        enrollmentService.assignGrade(id, grade);
        return "redirect:/"; // Redirect to main dashboard
    }

    @PostMapping("/delete/{id}")
    public String cancelEnrollment(@PathVariable Long id) {
        enrollmentService.cancelEnrollment(id);
        return "redirect:/"; // Redirect to main dashboard
    }
}