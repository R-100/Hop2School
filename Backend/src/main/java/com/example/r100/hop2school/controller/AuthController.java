package com.example.r100.hop2school.controller;

import com.example.r100.hop2school.config.JwtTokenUtil;
import com.example.r100.hop2school.dto.*;
import com.example.r100.hop2school.entity.UserEntity;
import com.example.r100.hop2school.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;

    public AuthController(UserService userService, JwtTokenUtil jwtTokenUtil) {
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<UserEntity> registerUser(@RequestBody Registration registration) {
        if (userService.findByMail(registration.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(userService.saveUser(registration));
    }

    @PostMapping("/login")
    public String login(@RequestBody Login login) {
        return userService.login(login);
    }

    @GetMapping("/isActiveAccount")
    public boolean isActiveAccount(@RequestParam String username) {
        return userService.findByMail(username).map(UserEntity::isActive).orElse(false);
    }

    @PostMapping("/isActiveAccount")
    public ResponseEntity<?> isActiveAccount(@RequestBody AccountActive accountActive) {
        userService.activeAccount(accountActive);
        boolean authenticated = userService.authenticate(accountActive.getEmail(),
                accountActive.getPassword());
        if (authenticated) {
            return userService.findByMail(accountActive.getEmail()).map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.badRequest().build());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect login");
        }
    }

    @PostMapping("/refreshMail")
    public void refreshMail(@RequestBody String email) {
        userService.refreshMail(email);
    }

    @GetMapping("/validateToken/{token}")
    public boolean validateToken(@PathVariable String token) {
        try {
            return jwtTokenUtil.validateToken(token);
        } catch (Exception e) {
            return false;
        }
    }

    @GetMapping("/getAuthUser/{token}")
    public User getAuthUser(@PathVariable String token) {
        return userService.getUserFromToken(token);
    }

    @PostMapping("/sendUpdatePasswordCodeAnonymous")
    public void updatePassword(@RequestBody String mail) {
        userService.sendUpdatePasswordCodeAnonymous(mail);
    }

    @PostMapping("/updatePassword")
    public void updatePassword(@RequestBody UpdatePasswordAnonymous command) {
        userService.updatePasswordAnonymous(command);
    }
}