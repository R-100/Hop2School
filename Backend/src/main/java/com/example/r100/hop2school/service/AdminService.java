package com.example.r100.hop2school.service;

import com.example.r100.hop2school.dto.Report;
import com.example.r100.hop2school.dto.User;
import com.example.r100.hop2school.dto.UserForAdmin;
import com.example.r100.hop2school.entity.UserEntity;

import java.util.List;
import java.util.UUID;

public interface AdminService {
    List<UserForAdmin> getAllUsers();

    List<Report> getReportsByUserId(UUID userId);

    void reportDisable(UUID userId, String message);

    UserForAdmin getUserById(UUID id);
}
