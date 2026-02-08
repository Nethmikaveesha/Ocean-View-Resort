package com.oceanview.resort.controller;

import com.oceanview.resort.dto.CreateUserRequest;
import com.oceanview.resort.model.User;
import com.oceanview.resort.repository.UserRepository;
import com.oceanview.resort.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class AdminUserController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AdminUserController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> listUsers(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestParam(value = "role", required = false) String roleFilter) {
        authService.requireRole(userId, User.Role.SUPER_ADMIN);
        User.Role role = roleFilter != null ? User.Role.valueOf(roleFilter) : null;
        List<User> users = role != null
                ? userRepository.findByRole(role)
                : userRepository.findAll();
        List<UserSummary> list = users.stream()
                .map(u -> new UserSummary(u.getId(), u.getUsername(), u.getFullName(), u.getEmail(), u.getRole() != null ? u.getRole().name() : null))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<?> createUser(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @Valid @RequestBody CreateUserRequest request) {
        authService.requireRole(userId, User.Role.SUPER_ADMIN);
        User user = authService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable String id,
            @RequestBody CreateUserRequest request) {
        authService.requireRole(userId, User.Role.SUPER_ADMIN);
        User user = authService.updateUser(id, request);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable String id) {
        authService.requireRole(userId, User.Role.SUPER_ADMIN);
        authService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    public static class UserSummary {
        public String id;
        public String username;
        public String fullName;
        public String email;
        public String role;
        public UserSummary(String id, String username, String fullName, String email, String role) {
            this.id = id; this.username = username; this.fullName = fullName; this.email = email; this.role = role;
        }
    }
}
