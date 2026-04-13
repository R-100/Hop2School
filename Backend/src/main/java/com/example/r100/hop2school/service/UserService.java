package com.example.r100.hop2school.service;

import com.example.r100.hop2school.dto.*;
import com.example.r100.hop2school.entity.UserEntity;

import java.util.Optional;
import java.util.UUID;

public interface UserService {

    UserEntity saveUser(Registration registration);

    Optional<UserEntity> findByMail(String mail);

    void activeAccount(AccountActive accountActive);

    void refreshMail(String mail);

    UserEntity getByUserId(UUID id);

    String login(Login login);

    boolean authenticate(String email, String password);

    User getUserFromToken(String token);

    UserEntity getAuthenticationUserEntity();

    void addReportCounter(UserEntity entity);

    void updateLanguage(String command);

    void updateMode(boolean command);

    void updatePhoneNumber(String command);

    void updateClazz(String command);

    void updateLastname(String command);

    void updateUsername(String command);

    void sendUpdatePasswordCode();

    void updatePassword(UpdatePassword command);

    String getLanguage();

    boolean getMode();

    void sendUpdatePasswordCodeAnonymous(String mail);

    void updatePasswordAnonymous(UpdatePasswordAnonymous command);

    String getGeoCodingApiKey();
}
