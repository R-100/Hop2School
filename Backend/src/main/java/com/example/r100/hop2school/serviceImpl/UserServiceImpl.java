package com.example.r100.hop2school.serviceImpl;

import com.example.r100.hop2school.config.JwtTokenUtil;
import com.example.r100.hop2school.dto.*;
import com.example.r100.hop2school.entity.UserEntity;
import com.example.r100.hop2school.repository.UserRepository;
import com.example.r100.hop2school.service.EmailSenderService;
import com.example.r100.hop2school.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    @Value("${app.name}")
    private String appName;

    @Value("${api.key.geocoding}")
    private String geoCodingApiKey;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailSenderService senderService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailSenderService senderService, @Lazy AuthenticationManager authenticationManager, JwtTokenUtil jwtTokenUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.senderService = senderService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public UserEntity saveUser(RegistrationDto registiterungDto) {
        int activeCode = generatorRandomActiveCode();
        UserEntity user = new UserEntity();
        user.setPassword(passwordEncoder.encode(registiterungDto.getPassword()));
        user.setPassword(passwordEncoder.encode(registiterungDto.getPassword()));
        user.setUsername(registiterungDto.getUsername());
        user.setLastname(registiterungDto.getLastname());
        user.setClazz(registiterungDto.getClazz());
        user.setPhoneNumber(registiterungDto.getPhoneNumber());
        user.setReportStatus(false);
        user.setReportCount(0);
        user.setActive(false);
        user.setEmail(registiterungDto.getEmail());
        user.setActiveCode(activeCode);
        user.setWhiteMode(true);
        user.setLanguage("en");
        sendRegisterCodeByMail(user, activeCode);
        return userRepository.save(user);
    }

    @Override
    public Optional<UserEntity> findByMail(String mail) {
        return userRepository.findByEmail(mail);
    }

    public int generatorRandomActiveCode() {
        Random random = new Random();
        return 100000 + random.nextInt(900000);
    }

    @Override
    public void activeAccount(AccountActiveDto accountActiveDto) {
        UserEntity userEntity = findByMail(accountActiveDto.getEmail()).get();
        if (userEntity.getActiveCode() == Integer.parseInt(accountActiveDto.getCode())) {
            userEntity.setActive(true);
            userEntity.setActiveCode(0);
            userRepository.save(userEntity);
        }
    }

    @Override
    public void refreshMail(String mail) {
        UserEntity userEntity = findByMail(mail).get();
        if (!userEntity.isActive()) {
            int activeCode = generatorRandomActiveCode();
            userEntity.setActiveCode(activeCode);
            userRepository.save(userEntity);
            sendRegisterCodeByMail(userEntity, activeCode);
        }
    }

    private void sendRegisterCodeByMail(UserEntity userEntity, int acitveCode) {
        String subject = "Confirmation of your registration with " + appName;
        String body = "Thank you for registering! To activate your account, please enter the following confirmation code:<br><br>" +
                "<strong>Verification code: " + acitveCode + "</strong><br><br>" +
                "If you haven't completed this registration, you can simply ignore this email.";
        senderService.sendEmail(userEntity.getEmail(), userEntity.getUsername(), subject, body);
    }

    @Override
    public UserEntity getByUserId(UUID id) {
        return userRepository.findById(id).get();
    }

    @Override
    public String login(LoginDto loginDto) {
        Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));
        return jwtTokenUtil.generateToken(authenticate.getName(), findByMail(authenticate.getName()).get().getId().toString());
    }

    @Override
    public boolean authenticate(String email, String password) {
        UserEntity user = userRepository.findByEmail(email).get();
        return passwordEncoder.matches(password, user.getPassword());
    }

    @Override
    public User getUserFromToken(String token) {
        return map(getByUserId(UUID.fromString(jwtTokenUtil.getUserIdFromToken(token))));
    }

    private User map(UserEntity entity) {
        User user = new User();
        user.setId(entity.getId());
        user.setUsername(entity.getUsername());
        user.setLastname(entity.getLastname());
        user.setEmail(entity.getEmail());
        user.setClazz(entity.getClazz());
        user.setPhoneNumber(entity.getPhoneNumber());
        return user;
    }

    @Override
    public UserEntity getAuthenticationUserEntity() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserEntity) {
                return (UserEntity) principal;
            } else if (principal instanceof UserDetails userDetails) {
                return userRepository.findByEmail(userDetails.getUsername()).get();
            }
        }
        return null;
    }

    @Override
    public void addReportCounter(UserEntity entity) {
        entity.setReportCount(entity.getReportCount() + 1);
        if (entity.getReportCount() < 5) {
            entity.setReportStatus(true);
            String subject = "Your account at " + appName + " was blocked";
            String body = "We regret to inform you that your account has been temporarily suspended for certain reasons.<br>" +
                    "If you have any questions or need further information, please contact our " + appName + " support team.<br>" +
                    "We hope to resolve the issue quickly so that you can access your account again soon.";
            senderService.sendEmail(entity.getEmail(), entity.getUsername(), subject, body);
        }
        userRepository.save(entity);
    }

    @Override
    public void reportDisable(UserEntity entity, String message) {
        entity.setReportStatus(false);
        entity.setReportCount(0);
        userRepository.save(entity);
        String subject = "Confirmation of your registration with " + appName;
        String body = "We are pleased to inform you that your account has been successfully unlocked.<br>" +
                "However, there is an important message from the " + appName + " support team that you should please take note of:<br><br>" +
                "<strong>Important message:</strong><br>" + message + "<br><br>" +
                "Please take a moment to read the message and take further action if necessary.";
        senderService.sendEmail(entity.getEmail(), entity.getUsername(), subject, body);
    }

    @Override
    public void updateLanguage(String command) {
        UserEntity userEntity = getAuthenticationUserEntity();
        userEntity.setLanguage(command);
        userRepository.save(userEntity);
    }

    @Override
    public void updateMode(boolean command) {
        UserEntity userEntity = getAuthenticationUserEntity();
        userEntity.setWhiteMode(command);
        userRepository.save(userEntity);
    }

    @Override
    public void updatePhoneNumber(String command) {
        UserEntity userEntity = getAuthenticationUserEntity();
        userEntity.setPhoneNumber(command);
        userRepository.save(userEntity);
    }

    @Override
    public void updateClazz(String command) {
        UserEntity userEntity = getAuthenticationUserEntity();
        userEntity.setClazz(command);
        userRepository.save(userEntity);
    }

    @Override
    public void updateLastname(String command) {
        UserEntity userEntity = getAuthenticationUserEntity();
        userEntity.setLastname(command);
        userRepository.save(userEntity);
    }

    @Override
    public void updateUsername(String command) {
        UserEntity userEntity = getAuthenticationUserEntity();
        userEntity.setUsername(command);
        userRepository.save(userEntity);
    }

    @Override
    public void sendUpdatePasswordCode() {
        int activeCode = generatorRandomActiveCode();
        UserEntity userEntity = getAuthenticationUserEntity();
        userEntity.setActiveCode(activeCode);
        userRepository.save(userEntity);
        String subject = "Confirmation code to change password at " + appName;
        String body = "To change your password, we have provided you with a security code:<br><br>" +
                "<strong>Your password reset code:</strong><br>" +
                "<h3>" + activeCode + "</h3><br>" +
                "Please enter this code on the appropriate page to securely change your password.";
        senderService.sendEmail(userEntity.getEmail(), userEntity.getUsername(), subject, body);
    }

    @Override
    public void updatePassword(UpdatePassword command) {
        UserEntity userEntity = getAuthenticationUserEntity();
        if (userEntity.getActiveCode() == Integer.parseInt(command.getActiveCode())) {
            userEntity.setPassword(passwordEncoder.encode(command.getPassword()));
            userEntity.setActiveCode(0);
            userRepository.save(userEntity);
        }
    }

    @Override
    public String getLanguage() {
        return getAuthenticationUserEntity().getLanguage();
    }

    @Override
    public boolean getMode() {
        return getAuthenticationUserEntity().isWhiteMode();
    }

    @Override
    public void sendUpdatePasswordCodeAnonymous(String mail) {
        int activeCode = generatorRandomActiveCode();
        UserEntity userEntity = userRepository.findByEmail(mail).get();
        userEntity.setActiveCode(activeCode);
        userRepository.save(userEntity);
        String subject = "Confirmation code to reset your password at " + appName;
        String body = "To change your password, we have provided you with a security code:<br><br>" +
                "<strong>Your password reset code:</strong><br>" +
                "<h3>" + activeCode + "</h3><br>" +
                "Please enter this code on the appropriate page to securely change your password. If you do not wish to change it, simply ignore the message.";
        senderService.sendEmail(userEntity.getEmail(), userEntity.getUsername(), subject, body);
    }

    @Override
    public void updatePasswordAnonymous(UpdatePasswordAnonymous command) {
        UserEntity userEntity = userRepository.findByEmail(command.getEmail()).get();
        if (userEntity.getActiveCode() == Integer.parseInt(command.getActiveCode())) {
            userEntity.setPassword(passwordEncoder.encode(command.getPassword()));
            userEntity.setActiveCode(0);
            userRepository.save(userEntity);
        }
    }

    @Override
    public String getGeoCodingApiKey() {
        return geoCodingApiKey;
    }
}
