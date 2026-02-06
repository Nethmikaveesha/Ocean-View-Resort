package com.oceanview.resort.controller;

import com.oceanview.resort.dto.ReservationRequestDto;
import com.oceanview.resort.dto.ReservationResponseDto;
import com.oceanview.resort.model.Reservation;
import com.oceanview.resort.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<ReservationResponseDto> createReservation(@Valid @RequestBody ReservationRequestDto requestDto) {
        Reservation reservation = reservationService.createReservation(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ReservationResponseDto.fromEntity(reservation));
    }

    @GetMapping("/{reservationNumber}")
    public ResponseEntity<ReservationResponseDto> getReservation(@PathVariable String reservationNumber) {
        return reservationService.getByReservationNumber(reservationNumber)
                .map(reservation -> ResponseEntity.ok(ReservationResponseDto.fromEntity(reservation)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

