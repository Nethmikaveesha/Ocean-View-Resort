package com.oceanview.resort.dto;

public class DashboardSummaryDto {

    private String role;
    private long totalCustomers;
    private long totalStaff;
    private long totalRooms;
    private long totalReservations;
    private long todaysArrivals;
    private long todaysDepartures;

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalStaff() {
        return totalStaff;
    }

    public void setTotalStaff(long totalStaff) {
        this.totalStaff = totalStaff;
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(long totalRooms) {
        this.totalRooms = totalRooms;
    }

    public long getTotalReservations() {
        return totalReservations;
    }

    public void setTotalReservations(long totalReservations) {
        this.totalReservations = totalReservations;
    }

    public long getTodaysArrivals() {
        return todaysArrivals;
    }

    public void setTodaysArrivals(long todaysArrivals) {
        this.todaysArrivals = todaysArrivals;
    }

    public long getTodaysDepartures() {
        return todaysDepartures;
    }

    public void setTodaysDepartures(long todaysDepartures) {
        this.todaysDepartures = todaysDepartures;
    }
}

