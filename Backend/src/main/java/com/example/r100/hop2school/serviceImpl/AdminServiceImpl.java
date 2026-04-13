package com.example.r100.hop2school.serviceImpl;

import com.example.r100.hop2school.dto.Report;
import com.example.r100.hop2school.dto.User;
import com.example.r100.hop2school.dto.UserForAdmin;
import com.example.r100.hop2school.entity.UserEntity;
import com.example.r100.hop2school.repository.UserRepository;
import com.example.r100.hop2school.service.AdminService;
import com.example.r100.hop2school.service.EmailSenderService;
import com.example.r100.hop2school.service.ReportService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Value("${app.name}")
    private String appName;

    private final UserRepository repository;
    private final ReportService reportService;
    private final EmailSenderService senderService;

    public AdminServiceImpl(UserRepository repository, ReportService reportService, EmailSenderService senderService) {
        this.repository = repository;
        this.reportService = reportService;
        this.senderService = senderService;
    }

    @Override
    public List<UserForAdmin> getAllUsers() {
        return repository.findAll().stream().map(this::map)
                .collect(Collectors.toList());
    }

    @Override
    public List<Report> getReportsByUserId(UUID userId) {
        return reportService.getAllReportsByUserId(userId);
    }

    @Override
    public void reportDisable(UUID userId, String message) {
        UserEntity entity = repository.findById(userId).orElseThrow();
        entity.setReportStatus(false);
        entity.setReportCount(0);
        repository.save(entity);
        String subject = "Confirmation of your registration with " + appName;
        String body = "We are pleased to inform you that your account has been successfully unlocked.<br>" +
                "However, there is an important message from the " + appName + " support team that you should please take note of:<br><br>" +
                "<strong>Important message:</strong><br>" + message + "<br><br>" +
                "Please take a moment to read the message and take further action if necessary.";
        senderService.sendEmail(entity.getEmail(), entity.getUsername(), subject, body);
    }

    @Override
    public UserForAdmin getUserById(UUID id) {
        return map(repository.findById(id).get());
    }

    private UserForAdmin map(UserEntity entity) {
        UserForAdmin dto = new UserForAdmin();
        dto.setId(entity.getId());
        dto.setUsername(entity.getUsername());
        dto.setLastname(entity.getLastname());
        dto.setEmail(entity.getEmail());
        dto.setReportStatus(entity.isReportStatus());
        dto.setReportCount(entity.getReportCount());
        return dto;
    }
}
