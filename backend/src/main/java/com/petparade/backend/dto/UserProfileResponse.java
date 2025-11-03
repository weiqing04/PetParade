package com.petparade.backend.dto;

public class UserProfileResponse {
    private String username;
    private String email;
    private String role;
    
    public UserProfileResponse(String username, String email, String role) {
        this.username = username;
        this.email = email;
        this.role = role;
    }
    // Getters
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}