package com.oceanview.resort.controller;

import com.oceanview.resort.dto.LoginRequest;
import com.oceanview.resort.dto.LoginResponse;
import com.oceanview.resort.dto.RegisterRequest;
import com.oceanview.resort.model.User;
import com.oceanview.resort.service.AuthService;
import com.oceanview.resort.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final RoomService roomService;

    public AuthController(AuthService authService, RoomService roomService) {
        this.authService = authService;
        this.roomService = roomService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (!roomService.hasAvailableRooms()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No rooms are currently available. Registration is temporarily disabled.");
        }
        User user = authService.registerCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User registered with id: " + user.getId());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        if ("CUSTOMER".equals(response.getRole()) && !roomService.hasAvailableRooms()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No rooms are currently available. Login is temporarily disabled.");
        }
        return ResponseEntity.ok(response);
    }
}

