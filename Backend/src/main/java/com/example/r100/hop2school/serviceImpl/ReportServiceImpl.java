package com.example.r100.hop2school.serviceImpl;


import com.example.r100.hop2school.dto.CreateReported;
import com.example.r100.hop2school.dto.Report;
import com.example.r100.hop2school.entity.ReportEntity;
import com.example.r100.hop2school.repository.ReportRepository;
import com.example.r100.hop2school.service.ReportService;
import com.example.r100.hop2school.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    private final ReportRepository repository;
    private final UserService userService;

    public ReportServiceImpl(ReportRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }

    @Override
    public List<Report> getAllReports() {
        return repository.findAll().stream().map(this::map)
                .collect(Collectors.toList());
    }

    @Override
    public void reported(CreateReported command) {
        ReportEntity entity = new ReportEntity();
        entity.setSubject(command.getSubject());
        entity.setDescription(command.getDescription());
        entity.setReporter(userService.getAuthenticationUserEntity());
        entity.setReportedUser(userService.getByUserId(command.getUserId()));
        entity.setTimestamp(LocalDateTime.now());
        repository.save(entity);
        userService.addReportCounter(userService.getByUserId(command.getUserId()));
    }

    private Report map(ReportEntity entity) {
        Report dto = new Report();
        dto.setId(entity.getId());
        dto.setSubject(entity.getSubject());
        dto.setDescription(entity.getDescription());
        dto.setTimestamp(entity.getTimestamp());
        dto.setReporterUserId(entity.getReporter().getId());
        dto.setReporterUserName(entity.getReporter().getUsername());
        dto.setReportedUserId(entity.getReportedUser().getId());
        dto.setReportedUserName(entity.getReportedUser().getUsername());
        return dto;
    }
}
