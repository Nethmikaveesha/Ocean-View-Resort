package com.oceanview.resort.repository;

import com.oceanview.resort.model.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ReservationRepository extends MongoRepository<Reservation, String> {

    Optional<Reservation> findByReservationNumber(String reservationNumber);
}

