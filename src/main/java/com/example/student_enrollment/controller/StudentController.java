package com.example.student_enrollment.controller;

import com.example.student_enrollment.dto.StudentDTO;
import com.example.student_enrollment.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@Controller
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }



    @GetMapping("/students")
    public String showStudentsPage(Model model) {
        try {
            List<StudentDTO> students = studentService.getAllStudents();
            model.addAttribute("students", students);
            model.addAttribute("totalStudents", students.size());
            return "students";
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Error loading students: " + e.getMessage());
            return "students";
        }
    }

    @PostMapping("/students/save")
    public String saveStudent(StudentDTO studentDTO, RedirectAttributes redirectAttributes) {
        try {
            if (studentDTO.getId() != null && studentDTO.getId() > 0) {
                studentService.updateStudent(studentDTO.getId(), studentDTO);
                redirectAttributes.addFlashAttribute("successMessage",
                        "Student '" + studentDTO.getFirstName() + " " + studentDTO.getLastName() + "' updated successfully!");
            } else {
                studentService.createStudent(studentDTO);
                redirectAttributes.addFlashAttribute("successMessage",
                        "Student '" + studentDTO.getFirstName() + " " + studentDTO.getLastName() + "' added successfully!");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error saving student: " + e.getMessage());
        }
        return "redirect:/students";
    }

    @PostMapping("/students/delete")
    public String deleteStudentForm(@RequestParam Long id, RedirectAttributes redirectAttributes) {
        try {
            StudentDTO student = studentService.getStudentById(id);
            studentService.deleteStudent(id);
            redirectAttributes.addFlashAttribute("successMessage",
                    "Student '" + student.getFirstName() + " " + student.getLastName() + "' deleted successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error deleting student: " + e.getMessage());
        }
        return "redirect:/students";
    }

    @GetMapping("/api/students")
    @ResponseBody
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        try {
            List<StudentDTO> students = studentService.getAllStudents();
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/api/students/count")
    @ResponseBody
    public ResponseEntity<Long> getStudentCount() {
        try {
            long count = studentService.getStudentCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/api/students/{id}")
    @ResponseBody
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        try {
            StudentDTO student = studentService.getStudentById(id);
            if (student != null) {
                return ResponseEntity.ok(student);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/api/students")
    @ResponseBody
    public ResponseEntity<StudentDTO> createStudent(@RequestBody StudentDTO studentDTO) {
        try {
            StudentDTO createdStudent = studentService.createStudent(studentDTO);
            return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/api/students/{id}")
    @ResponseBody
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id, @RequestBody StudentDTO studentDTO) {
        try {
            StudentDTO updatedStudent = studentService.updateStudent(id, studentDTO);
            if (updatedStudent != null) {
                return ResponseEntity.ok(updatedStudent);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/api/students/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/students/delete/{id}")
    public String deleteStudentFormWithPath(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            StudentDTO student = studentService.getStudentById(id);
            studentService.deleteStudent(id);
            redirectAttributes.addFlashAttribute("successMessage",
                    "Student '" + student.getFirstName() + " " + student.getLastName() + "' deleted successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error deleting student: " + e.getMessage());
        }
        return "redirect:/students";
    }
}
