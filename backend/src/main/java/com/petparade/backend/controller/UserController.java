package com.petparade.backend.controller;

import com.petparade.backend.dto.LoginResponse;
import com.petparade.backend.dto.MessageResponse;
import com.petparade.backend.dto.UserProfileResponse;
import com.petparade.backend.model.User;
import com.petparade.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import java.io.IOException;

import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // Handles GET /api/user?username=...
    @GetMapping
    public ResponseEntity<?> getUserProfile(@RequestParam String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            User u = user.get();
            return ResponseEntity.ok(new UserProfileResponse(u.getUsername(), u.getEmail(), u.getRole()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User not found"));
    }

    // Handles POST /api/user with x-www-form-urlencoded data
    @PostMapping
    public ResponseEntity<?> handleUserAction(@RequestParam String action,
                                              @RequestParam String username,
                                              @RequestParam String password,
                                              @RequestParam(required = false) String email) {
        if ("register".equals(action)) {
            // Handles Signup.js
            if (userRepository.findByUsername(username).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Username or email already exists"));
            }
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setEmail(email);
            newUser.setPassword(passwordEncoder.encode(password));
            newUser.setRole("customer");
            userRepository.save(newUser);
            return ResponseEntity.ok(new MessageResponse("User registered successfully"));
            
        } else if ("login".equals(action)) {
            // Handles Login.js
            Optional<User> user = userRepository.findByUsername(username);

            // Use .matches(rawPassword, encodedPasswordFromDB)
            if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
                return ResponseEntity.ok(new LoginResponse("Login successful", user.get().getRole()));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Invalid username or password"));
        }
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Invalid action"));
    }

    // 1. Upload Profile Picture
    @PostMapping("/upload-photo")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("username") String username,
                                                  @RequestParam("image") MultipartFile file) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User not found"));
        }

        try {
            User user = userOptional.get();
            user.setProfilePicture(file.getBytes());
            user.setImageType(file.getContentType());
            userRepository.save(user); // Save to database
            
            return ResponseEntity.ok(new MessageResponse("Profile picture updated successfully"));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("Error uploading image"));
        }
    }

    // 2. View Profile Picture
    @GetMapping("/photo/{username}")
    public ResponseEntity<byte[]> getProfilePicture(@PathVariable String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent() && userOptional.get().getProfilePicture() != null) {
            User user = userOptional.get();
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, user.getImageType()) // e.g., image/jpeg
                    .body(user.getProfilePicture());
        }
        
        return ResponseEntity.notFound().build();
    }
}