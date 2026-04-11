package com.example.r100.hop2school.dto;

import java.util.UUID;

public class CreateMessage {
    private UUID rideId;
    private String content;

    public UUID getRideId() {
        return rideId;
    }

    public void setRideId(UUID rideId) {
        this.rideId = rideId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
