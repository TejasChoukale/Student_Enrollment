// Updated Controller - Remove manual CSRF handling
package com.example.student_enrollment.controller;

import com.example.student_enrollment.dto.CourseDTO;
import com.example.student_enrollment.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/courses")
public class CourseController {

    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public String getAllCourses(Model model) {
        List<CourseDTO> courses = courseService.getAllCourses();
        model.addAttribute("courses", courses);
        model.addAttribute("newCourse", new CourseDTO());

        // No need to manually add CSRF token - Spring Security handles this automatically
        return "list";
    }

    @GetMapping("/{id}")
    public String getCourseById(@PathVariable Long id, Model model) {
        CourseDTO course = courseService.getCourseById(id);
        model.addAttribute("course", course);
        return "detail";
    }

    @GetMapping("/create")
    public String showCreateCourseForm(Model model) {
        model.addAttribute("course", new CourseDTO());
        return "create";
    }

    @PostMapping
    public String createCourse(@ModelAttribute CourseDTO courseDTO) {
        courseService.createCourse(courseDTO);
        return "redirect:/courses";
    }

    @GetMapping("/edit/{id}")
    public String showEditCourseForm(@PathVariable Long id, Model model) {
        CourseDTO course = courseService.getCourseById(id);
        model.addAttribute("course", course);
        return "edit";
    }

    @PostMapping("/update/{id}")
    public String updateCourse(@PathVariable Long id, @ModelAttribute CourseDTO courseDTO) {
        courseService.updateCourse(id, courseDTO);
        return "redirect:/courses";
    }

    @PostMapping("/delete/{id}")
    public String deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return "redirect:/courses";
    }

    @GetMapping("/course")
    public String showPage(Model model) {
        if (!model.containsAttribute("course")) {
            model.addAttribute("course", new CourseDTO());
        }
        return "index";
    }

    @ModelAttribute
    public void addCourseToAllModels(Model model) {
        if (!model.containsAttribute("course")) {
            model.addAttribute("course", new CourseDTO());
        }
    }

    @GetMapping("/")
    public String home(Model model) {
        if (!model.containsAttribute("course")) {
            model.addAttribute("course", new CourseDTO());
        }
        return "index";
    }
}