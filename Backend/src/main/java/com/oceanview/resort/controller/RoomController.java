package com.oceanview.resort.controller;

import com.oceanview.resort.model.Room;
import com.oceanview.resort.model.User;
import com.oceanview.resort.service.AuthService;
import com.oceanview.resort.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;
    private final AuthService authService;

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

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
        authService.requireRole(userId, User.Role.SUPER_ADMIN);
        Room created = roomService.createRoom(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable String id) {
        authService.requireRole(userId, User.Role.SUPER_ADMIN);
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable String id,
            @Valid @RequestBody Room room) {
        authService.requireRole(userId, User.Role.SUPER_ADMIN);
        Room updated = roomService.updateRoom(id, room);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadRoomImage(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestParam("file") MultipartFile file) {
        authService.requireRole(userId, User.Role.SUPER_ADMIN);
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file provided");
        }
        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                : ".jpg";
        String filename = "room-" + UUID.randomUUID() + ext;
        try {
            Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(dir);
            Path target = dir.resolve(filename);
            file.transferTo(target.toFile());
            String imageUrl = "/uploads/" + filename;
            return ResponseEntity.ok(new java.util.Map.of("imageUrl", imageUrl));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save image: " + e.getMessage());
        }
    }
}

