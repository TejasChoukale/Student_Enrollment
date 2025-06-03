package com.example.student_enrollment.dto;

public class CourseDTO {
    private Long id;  // Corrected back to Long
    private String code;
    private String title;
    private String description;
    private Integer credits;
    private Integer maxCapacity;
    private Integer currentEnrollment;

    // Constructors, getters, and setters
    public CourseDTO() {}

    public CourseDTO(Long id, String code, String title, String description, Integer credits, Integer maxCapacity, Integer currentEnrollment) {
        this.id = id;
        this.code = code;
        this.title = title;
        this.description = description;
        this.credits = credits;
        this.maxCapacity = maxCapacity;
        this.currentEnrollment = currentEnrollment;
    }

    // Getters and Setters
    public Long getId() {  // Corrected back to Long
        return id;
    }

    public void setId(Long id) {  // Corrected back to Long
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public Integer getCurrentEnrollment() {
        return currentEnrollment;
    }

    public void setCurrentEnrollment(Integer currentEnrollment) {
        this.currentEnrollment = currentEnrollment;
    }
}
