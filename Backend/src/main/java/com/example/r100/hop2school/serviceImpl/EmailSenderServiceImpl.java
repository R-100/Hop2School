package com.example.r100.hop2school.serviceImpl;

import com.example.r100.hop2school.service.EmailSenderService;
import jakarta.activation.FileDataSource;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class EmailSenderServiceImpl implements EmailSenderService {

    @Value("${app.name}")
    private String appName;

    @Value("${app.mail}")
    private String mail;

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendEmail(String toEmail, String username, String subject, String body) throws MailException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(mail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            String htmlContent = "<html>"
                    + "<body>"
                    + "<h3>Hello "+ username + ",</h3><br>"
                    + body + "<br>"
                    + "<hr>"
                    + "<p>If you have any questions, our support team is here to help " + appName + " is always happy to help.</p>"
                    + "<hr>"
                    + "<img src='cid:logo' alt='" + appName +" Logo' width='150' height='150'>"
                    + "</body>"
                    + "</html>";
            helper.setText(htmlContent, true);
            File image = new File("src/main/resources/assets/img.png");
            FileDataSource fds = new FileDataSource(image);
            helper.addInline("logo", fds);
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
