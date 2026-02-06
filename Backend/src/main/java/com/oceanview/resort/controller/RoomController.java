package com.oceanview.resort.controller;

import com.oceanview.resort.model.Room;
import com.oceanview.resort.model.User;
import com.oceanview.resort.service.AuthService;
import com.oceanview.resort.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;
    private final AuthService authService;

    public RoomController(RoomService roomService, AuthService authService) {
        this.roomService = roomService;
        this.authService = authService;
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @PostMapping
    public ResponseEntity<?> createRoom(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @Valid @RequestBody Room room) {
        authService.requireRole(userId, User.Role.SUPER_ADMIN, User.Role.ADMIN);
        Room created = roomService.createRoom(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable String id,
            @Valid @RequestBody Room room) {
        authService.requireRole(userId, User.Role.SUPER_ADMIN, User.Role.ADMIN);
        Room updated = roomService.updateRoom(id, room);
        return ResponseEntity.ok(updated);
    }
}

