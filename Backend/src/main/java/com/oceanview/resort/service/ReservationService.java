package com.oceanview.resort.service;

import com.oceanview.resort.dto.ReservationRequestDto;
import com.oceanview.resort.model.Reservation;
import com.oceanview.resort.model.Room;
import com.oceanview.resort.repository.ReservationRepository;
import com.oceanview.resort.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
    }

    public Reservation createReservation(ReservationRequestDto request) {
        validateDates(request.getCheckInDateTime(), request.getCheckOutDateTime());

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        int nights = calculateNights(request.getCheckInDateTime(), request.getCheckOutDateTime());
        double ratePerNight = room.getRatePerNight();
        double total = nights * ratePerNight;

        Reservation reservation = new Reservation();
        reservation.setReservationNumber(generateReservationNumber());
        reservation.setCustomerId(request.getCustomerId());
        reservation.setCreatedByStaffId(request.getCreatedByStaffId());
        reservation.setGuestName(request.getGuestName());
        reservation.setAddress(request.getAddress());
        reservation.setNicNumber(request.getNicNumber());
        reservation.setContactNumber(request.getContactNumber());
        reservation.setRoomId(room.getId());
        reservation.setRoomType(room.getRoomType());
        reservation.setCheckInDateTime(request.getCheckInDateTime());
        reservation.setCheckOutDateTime(request.getCheckOutDateTime());
        reservation.setNights(nights);
        reservation.setRatePerNight(ratePerNight);
        reservation.setTotalAmount(total);

        return reservationRepository.save(reservation);
    }

    public Optional<Reservation> getByReservationNumber(String reservationNumber) {
        return reservationRepository.findByReservationNumber(reservationNumber);
    }

    public List<Reservation> findAll() {
        return reservationRepository.findAll();
    }

    public Optional<Reservation> findById(String id) {
        return reservationRepository.findById(id);
    }

    public Reservation updateReservation(String id, ReservationRequestDto request) {
        Reservation existing = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        validateDates(request.getCheckInDateTime(), request.getCheckOutDateTime());
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        int nights = calculateNights(request.getCheckInDateTime(), request.getCheckOutDateTime());
        double ratePerNight = room.getRatePerNight();
        double total = nights * ratePerNight;
        existing.setGuestName(request.getGuestName());
        existing.setAddress(request.getAddress());
        existing.setNicNumber(request.getNicNumber());
        existing.setContactNumber(request.getContactNumber());
        existing.setRoomId(room.getId());
        existing.setRoomType(room.getRoomType());
        existing.setCheckInDateTime(request.getCheckInDateTime());
        existing.setCheckOutDateTime(request.getCheckOutDateTime());
        existing.setNights(nights);
        existing.setRatePerNight(ratePerNight);
        existing.setTotalAmount(total);
        if (request.getCustomerId() != null) existing.setCustomerId(request.getCustomerId());
        if (request.getCreatedByStaffId() != null) existing.setCreatedByStaffId(request.getCreatedByStaffId());
        return reservationRepository.save(existing);
    }

    public void deleteReservation(String id) {
        if (!reservationRepository.existsById(id)) {
            throw new IllegalArgumentException("Reservation not found");
        }
        reservationRepository.deleteById(id);
    }

    private void validateDates(LocalDateTime checkIn, LocalDateTime checkOut) {
        Assert.notNull(checkIn, "Check-in date/time is required");
        Assert.notNull(checkOut, "Check-out date/time is required");
        if (!checkOut.isAfter(checkIn)) {
            throw new IllegalArgumentException("Check-out date/time must be after check-in date/time");
        }
    }

    private int calculateNights(LocalDateTime checkIn, LocalDateTime checkOut) {
        long hours = Duration.between(checkIn, checkOut).toHours();
        long nights = hours / 24;
        if (hours % 24 != 0) {
            nights++;
        }
        return (int) nights;
    }

    private String generateReservationNumber() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String randomPart = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "RES-" + datePart + "-" + randomPart;
    }
}

