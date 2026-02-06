package com.oceanview.resort.controller;

import com.oceanview.resort.dto.DashboardSummaryDto;
import com.oceanview.resort.model.User;
import com.oceanview.resort.service.DashboardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/super-admin")
    public ResponseEntity<?> superAdminDashboard(@RequestParam String userId) {
        return buildResponse(userId, User.Role.SUPER_ADMIN);
    }

    @GetMapping("/admin")
    public ResponseEntity<?> adminDashboard(@RequestParam String userId) {
        return buildResponse(userId, User.Role.ADMIN);
    }

    @GetMapping("/front-officer")
    public ResponseEntity<?> frontOfficerDashboard(@RequestParam String userId) {
        return buildResponse(userId, User.Role.FRONT_OFFICER);
    }

    @GetMapping("/manager")
    public ResponseEntity<?> managerDashboard(@RequestParam String userId) {
        return buildResponse(userId, User.Role.MANAGER);
    }

    private ResponseEntity<?> buildResponse(String userId, User.Role role) {
        try {
            DashboardSummaryDto dto = dashboardService.getDashboardForRole(userId, role);
            return ResponseEntity.ok(dto);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

