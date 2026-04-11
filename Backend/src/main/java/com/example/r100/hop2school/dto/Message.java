package com.example.r100.hop2school.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class Message {
    private UUID userId;
    private String username;
    private String content;
    private LocalDateTime timestamp;
    private boolean isAuthUser;

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isAuthUser() {
        return isAuthUser;
    }

    public void setAuthUser(boolean authUser) {
        isAuthUser = authUser;
    }
}
