package com.oceanview.resort.dto;

import com.oceanview.resort.model.Reservation;

import java.time.LocalDateTime;

public class ReservationResponseDto {

    private String reservationNumber;
    private String guestName;
    private String address;
    private String nicNumber;
    private String contactNumber;
    private String roomId;
    private String roomType;
    private LocalDateTime checkInDateTime;
    private LocalDateTime checkOutDateTime;
    private int nights;
    private double ratePerNight;
    private double totalAmount;
    private Reservation.Status status;

    public static ReservationResponseDto fromEntity(Reservation reservation) {
        ReservationResponseDto dto = new ReservationResponseDto();
        dto.setReservationNumber(reservation.getReservationNumber());
        dto.setGuestName(reservation.getGuestName());
        dto.setAddress(reservation.getAddress());
        dto.setNicNumber(reservation.getNicNumber());
        dto.setContactNumber(reservation.getContactNumber());
        dto.setRoomId(reservation.getRoomId());
        dto.setRoomType(reservation.getRoomType());
        dto.setCheckInDateTime(reservation.getCheckInDateTime());
        dto.setCheckOutDateTime(reservation.getCheckOutDateTime());
        dto.setNights(reservation.getNights());
        dto.setRatePerNight(reservation.getRatePerNight());
        dto.setTotalAmount(reservation.getTotalAmount());
        dto.setStatus(reservation.getStatus());
        return dto;
    }

    public String getReservationNumber() {
        return reservationNumber;
    }

    public void setReservationNumber(String reservationNumber) {
        this.reservationNumber = reservationNumber;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNicNumber() {
        return nicNumber;
    }

    public void setNicNumber(String nicNumber) {
        this.nicNumber = nicNumber;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public LocalDateTime getCheckInDateTime() {
        return checkInDateTime;
    }

    public void setCheckInDateTime(LocalDateTime checkInDateTime) {
        this.checkInDateTime = checkInDateTime;
    }

    public LocalDateTime getCheckOutDateTime() {
        return checkOutDateTime;
    }

    public void setCheckOutDateTime(LocalDateTime checkOutDateTime) {
        this.checkOutDateTime = checkOutDateTime;
    }

    public int getNights() {
        return nights;
    }

    public void setNights(int nights) {
        this.nights = nights;
    }

    public double getRatePerNight() {
        return ratePerNight;
    }

    public void setRatePerNight(double ratePerNight) {
        this.ratePerNight = ratePerNight;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Reservation.Status getStatus() {
        return status;
    }

    public void setStatus(Reservation.Status status) {
        this.status = status;
    }
}

