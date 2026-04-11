package com.example.r100.hop2school.controller;

import com.example.r100.hop2school.dto.CreateReported;
import com.example.r100.hop2school.service.ReportService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/report")
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping()
    public void reported(@RequestBody CreateReported command) {
        reportService.reported(command);
    }
}
