package com.example.r100.hop2school.controller;

import com.example.r100.hop2school.dto.UpdatePassword;
import com.example.r100.hop2school.service.UserService;
import org.apache.commons.collections4.Get;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/language")
    public void updateLanguage(@RequestBody String command) {
        userService.updateLanguage(command);
    }

    @PostMapping("/mode")
    public void updateMode(@RequestBody boolean command) {
        userService.updateMode(command);
    }

    @PostMapping("/phoneNumber")
    public void updatePhoneNumber(@RequestBody String command) {
        userService.updatePhoneNumber(command);
    }

    @PostMapping("/clazz")
    public void updateClazz(@RequestBody String command) {
        userService.updateClazz(command);
    }

    @PostMapping("/lastname")
    public void updateLastname(@RequestBody String command) {
        userService.updateLastname(command);
    }

    @PostMapping("/username")
    public void updateUsername(@RequestBody String command) {
        userService.updateUsername(command);
    }

    @PostMapping("/sendUpdatePasswordCode")
    public void sendUpdatePasswordCode() {
        userService.sendUpdatePasswordCode();
    }

    @PostMapping("/password")
    public void updatePassword(@RequestBody UpdatePassword command) {
        userService.updatePassword(command);
    }

    @GetMapping("/language")
    public String getLanguage() {
        return userService.getLanguage();
    }

    @GetMapping("/mode")
    public boolean getMode() {
        return userService.getMode();
    }

    @GetMapping("/geoCodingApiKey")
    public String getGeoCodingApiKey() {
        return userService.getGeoCodingApiKey();
    }

}