package com.example.r100.hop2school.service;

import org.springframework.mail.MailException;

public interface EmailSenderService {

    void sendEmail(String toEmail, String username, String subject, String body) throws MailException;
}
