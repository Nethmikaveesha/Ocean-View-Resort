package com.oceanview.resort.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "rooms")
public class Room {

    @Id
    private String id;

    private String roomNumber;
    private String roomType;
    private String description;
    private int capacity;
    private double ratePerNight;
    private Status status = Status.AVAILABLE;
    private String imageUrl;

    public enum Status {
        AVAILABLE,
        OCCUPIED,
        MAINTENANCE
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public double getRatePerNight() {
        return ratePerNight;
    }

    public void setRatePerNight(double ratePerNight) {
        this.ratePerNight = ratePerNight;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}

