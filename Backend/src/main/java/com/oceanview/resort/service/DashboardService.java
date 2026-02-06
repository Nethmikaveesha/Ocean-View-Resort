package com.oceanview.resort.service;

import com.oceanview.resort.dto.DashboardSummaryDto;
import com.oceanview.resort.model.Reservation;
import com.oceanview.resort.model.User;
import com.oceanview.resort.repository.ReservationRepository;
import com.oceanview.resort.repository.RoomRepository;
import com.oceanview.resort.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public DashboardService(UserRepository userRepository,
                            RoomRepository roomRepository,
                            ReservationRepository reservationRepository) {
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
    }

    public DashboardSummaryDto getDashboardForRole(String userId, User.Role requiredRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getRole() != requiredRole) {
            throw new SecurityException("Access denied for role: " + user.getRole());
        }

        List<User> allUsers = userRepository.findAll();
        long totalCustomers = allUsers.stream()
                .filter(u -> u.getRole() == User.Role.CUSTOMER)
                .count();
        long totalStaff = allUsers.stream()
                .filter(u -> u.getRole() == User.Role.ADMIN
                        || u.getRole() == User.Role.SUPER_ADMIN
                        || u.getRole() == User.Role.FRONT_OFFICER
                        || u.getRole() == User.Role.MANAGER)
                .count();

        long totalRooms = roomRepository.count();
        List<Reservation> reservations = reservationRepository.findAll();
        long totalReservations = reservations.size();

        LocalDate today = LocalDate.now();
        long todaysArrivals = reservations.stream()
                .filter(r -> r.getCheckInDateTime() != null
                        && r.getCheckInDateTime().toLocalDate().isEqual(today))
                .count();
        long todaysDepartures = reservations.stream()
                .filter(r -> r.getCheckOutDateTime() != null
                        && r.getCheckOutDateTime().toLocalDate().isEqual(today))
                .count();

        DashboardSummaryDto dto = new DashboardSummaryDto();
        dto.setRole(requiredRole.name());
        dto.setTotalCustomers(totalCustomers);
        dto.setTotalStaff(totalStaff);
        dto.setTotalRooms(totalRooms);
        dto.setTotalReservations(totalReservations);
        dto.setTodaysArrivals(todaysArrivals);
        dto.setTodaysDepartures(todaysDepartures);

        return dto;
    }
}

