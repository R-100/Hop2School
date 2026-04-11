package com.example.r100.hop2school.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class Report {
    private UUID id;
    private String subject;
    private String description;
    private LocalDateTime timestamp;
    private UUID reportedUserId;
    private String reportedUserName;
    private UUID reporterUserId;
    private String reporterUserName;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public UUID getReportedUserId() {
        return reportedUserId;
    }

    public void setReportedUserId(UUID reportedUserId) {
        this.reportedUserId = reportedUserId;
    }

    public String getReportedUserName() {
        return reportedUserName;
    }

    public void setReportedUserName(String reportedUserName) {
        this.reportedUserName = reportedUserName;
    }

    public UUID getReporterUserId() {
        return reporterUserId;
    }

    public void setReporterUserId(UUID reporterUserId) {
        this.reporterUserId = reporterUserId;
    }

    public String getReporterUserName() {
        return reporterUserName;
    }

    public void setReporterUserName(String reporterUserName) {
        this.reporterUserName = reporterUserName;
    }
}
