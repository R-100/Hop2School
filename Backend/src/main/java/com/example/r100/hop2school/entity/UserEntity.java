package com.example.r100.hop2school.entity;


import com.example.r100.hop2school.enums.Role;
import com.example.r100.hop2school.enums.Status;
import jakarta.persistence.*;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    @Enumerated(EnumType.ORDINAL)
    private Role role;
    private String username;
    private String lastname;
    private String password;
    private String email;
    private boolean isActive = false;
    private int activeCode = 0;
    private String phoneNumber;
    private boolean reportStatus = false;
    private int reportCount = 0;
    private String clazz;
    @ManyToMany(mappedBy = "passengers")
    private Set<RideEntity> rides;
    private boolean isWhiteMode = true;
    private String language = "de";

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public int getActiveCode() {
        return activeCode;
    }

    public void setActiveCode(int activeCode) {
        this.activeCode = activeCode;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public boolean isReportStatus() {
        return reportStatus;
    }

    public void setReportStatus(boolean reportStatus) {
        this.reportStatus = reportStatus;
    }

    public int getReportCount() {
        return reportCount;
    }

    public void setReportCount(int reportCount) {
        this.reportCount = reportCount;
    }

    public String getClazz() {
        return clazz;
    }

    public void setClazz(String clazz) {
        this.clazz = clazz;
    }

    public Set<RideEntity> getRides() {
        return rides;
    }

    public void setRides(Set<RideEntity> rides) {
        this.rides = rides;
    }

    public boolean isWhiteMode() {
        return isWhiteMode;
    }

    public void setWhiteMode(boolean whiteMode) {
        isWhiteMode = whiteMode;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
