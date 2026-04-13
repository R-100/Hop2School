package com.example.r100.hop2school.service;


import com.example.r100.hop2school.dto.CreateReported;
import com.example.r100.hop2school.dto.Report;

import java.util.List;
import java.util.UUID;

public interface ReportService {

    List<Report> getAllReports();

    List<Report> getAllReportsByUserId(UUID userId);

    void reported(CreateReported command);
}
