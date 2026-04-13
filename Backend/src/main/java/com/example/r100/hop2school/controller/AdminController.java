package com.example.r100.hop2school.controller;

import com.example.r100.hop2school.dto.Report;
import com.example.r100.hop2school.dto.UpdatePassword;
import com.example.r100.hop2school.dto.User;
import com.example.r100.hop2school.dto.UserForAdmin;
import com.example.r100.hop2school.service.AdminService;
import com.example.r100.hop2school.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/getAllUsers")
    public List<UserForAdmin> getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/getUserReports/{id}")
    public List<Report> getUserReports(@PathVariable UUID id) {
        return adminService.getReportsByUserId(id);
    }

    @GetMapping("/getUserById/{id}")
    public UserForAdmin getUserById(@PathVariable UUID id) {
        return adminService.getUserById(id);
    }

    @PostMapping("/reportDisable/{id}")
    public void reportDisable(@PathVariable UUID id,@RequestBody String message) {
        adminService.reportDisable(id, message);
    }
}
