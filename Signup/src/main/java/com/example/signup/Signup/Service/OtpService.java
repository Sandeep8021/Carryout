package com.example.signup.Signup.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender javaMailSender;

    private Map<String, String> otpStore = new HashMap<>(); // phone/email -> otp

    public void sendOtp(String email) {
        String emailOtp = generateOtp();

        otpStore.put(email, emailOtp);

        // Send email OTP
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(email);
        mailMessage.setSubject("Your Email OTP");
        mailMessage.setText("Your OTP for email verification is: " + emailOtp);
        javaMailSender.send(mailMessage);

    }

    public boolean verifyOtp( String email, String emailOtp) {
        return  otpStore.get(email).equals(emailOtp);
    }

    private String generateOtp() {
        return String.valueOf(new Random().nextInt(900000) + 100000); // Generates 6 digit OTP
    }
}
