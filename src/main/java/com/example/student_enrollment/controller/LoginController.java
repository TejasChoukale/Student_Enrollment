// LoginController.java
package com.example.student_enrollment.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.security.Principal;

@Controller
public class LoginController {

    @GetMapping("/index")
    public String indexPage(Model model, Principal principal) {
        model.addAttribute("username", principal.getName());
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login"; // Return the login page from templates
    }

    @GetMapping("/home")
    public String homePage() {
        return "home"; // Return the home page from templates
    }
}