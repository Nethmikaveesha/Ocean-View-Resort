package com.oceanview.resort.controller;

import com.oceanview.resort.dto.LoginRequest;
import com.oceanview.resort.dto.LoginResponse;
import com.oceanview.resort.dto.RegisterRequest;
import com.oceanview.resort.model.User;
import com.oceanview.resort.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.registerCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User registered with id: " + user.getId());
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}

