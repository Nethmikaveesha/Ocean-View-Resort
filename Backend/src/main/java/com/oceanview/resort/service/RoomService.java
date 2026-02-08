package com.oceanview.resort.service;

import com.oceanview.resort.model.Room;
import com.oceanview.resort.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public boolean hasAvailableRooms() {
        return roomRepository.countByStatus(Room.Status.AVAILABLE) > 0;
    }

    public Room createRoom(Room room) {
        roomRepository.findByRoomNumber(room.getRoomNumber())
                .ifPresent(r -> {
                    throw new IllegalArgumentException("Room number already exists");
                });
        return roomRepository.save(room);
    }

    public Room updateRoom(String id, Room updated) {
        Room existing = roomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        existing.setRoomNumber(updated.getRoomNumber());
        existing.setRoomType(updated.getRoomType());
        existing.setDescription(updated.getDescription());
        existing.setCapacity(updated.getCapacity());
        existing.setRatePerNight(updated.getRatePerNight());
        existing.setStatus(updated.getStatus());
        existing.setImageUrl(updated.getImageUrl());

        return roomRepository.save(existing);
    }

    public void deleteRoom(String id) {
        if (!roomRepository.existsById(id)) {
            throw new IllegalArgumentException("Room not found");
        }
        roomRepository.deleteById(id);
    }
}

