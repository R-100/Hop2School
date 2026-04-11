package com.example.r100.hop2school.service;


import com.example.r100.hop2school.dto.CreateReported;
import com.example.r100.hop2school.dto.Report;

import java.util.List;

public interface ReportService {

    List<Report> getAllReports();

    void reported(CreateReported command);
}
