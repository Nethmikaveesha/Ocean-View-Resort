package com.oceanview.resort.controller;

import com.oceanview.resort.dto.ReservationRequestDto;
import com.oceanview.resort.dto.ReservationResponseDto;
import com.oceanview.resort.model.Reservation;
import com.oceanview.resort.model.User;
import com.oceanview.resort.service.AuthService;
import com.oceanview.resort.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/reservations")
@CrossOrigin(origins = "*")
public class AdminReservationController {

    private final ReservationService reservationService;
    private final AuthService authService;

    public AdminReservationController(ReservationService reservationService, AuthService authService) {
        this.reservationService = reservationService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> listReservations(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        authService.requireRole(userId, User.Role.SUPER_ADMIN);
        List<ReservationResponseDto> list = reservationService.findAll().stream()
                .map(ReservationResponseDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservation(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable String id,
            @Valid @RequestBody ReservationRequestDto request) {
        authService.requireRole(userId, User.Role.SUPER_ADMIN);
        Reservation updated = reservationService.updateReservation(id, request);
        return ResponseEntity.ok(ReservationResponseDto.fromEntity(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable String id) {
        authService.requireRole(userId, User.Role.SUPER_ADMIN);
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}
