package com.oceanview.resort.service;

import com.oceanview.resort.dto.LoginRequest;
import com.oceanview.resort.dto.LoginResponse;
import com.oceanview.resort.dto.RegisterRequest;
import com.oceanview.resort.model.User;
import com.oceanview.resort.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User registerCustomer(RegisterRequest request) {
        userRepository.findByUsername(request.getUsername()).ifPresent(u -> {
            throw new IllegalArgumentException("Username already exists");
        });

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setNicNumber(request.getNicNumber());
        user.setRole(User.Role.CUSTOMER);

        return userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getRole() != null ? user.getRole().name() : null
        );
    }

    /**
     * Ensures the user exists and has one of the allowed roles. Throws if not.
     */
    public User requireRole(String userId, User.Role... allowedRoles) {
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("X-User-Id header is required");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (allowedRoles != null && allowedRoles.length > 0) {
            for (User.Role r : allowedRoles) {
                if (r == user.getRole()) {
                    return user;
                }
            }
            throw new SecurityException("Access denied: required role not held");
        }
        return user;
    }
}

