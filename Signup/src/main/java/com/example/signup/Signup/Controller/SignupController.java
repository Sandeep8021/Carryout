package com.example.signup.Signup.Controller;

import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.signup.Signup.DTO.OtpRequest;
import com.example.signup.Signup.DTO.OtpVerificationRequest;
import com.example.signup.Signup.Entity.User;
import com.example.signup.Signup.Service.OtpService;
import com.example.signup.Signup.Service.UserService;

@RestController
@RequestMapping("/signup")
@CrossOrigin(origins = "http://localhost:3000")
public class SignupController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserService userService;
    
    //@Autowired
    //private JwtTokenProvider jwtTokenProvider; 

    @PostMapping("/send-otp")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest otpRequest) {
        if (userService.existsByEmail(otpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }
        otpService.sendOtp(otpRequest.getEmail());
        return ResponseEntity.ok("OTP Sent");
    }

    @PostMapping("/verify-otp")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerificationRequest verificationRequest) {
    	System.out.println("In verify OTP");
    	boolean isVerified = otpService.verifyOtp(verificationRequest.getEmail(), verificationRequest.getEmailOtp());
  
        return ResponseEntity.ok(Collections.singletonMap("verified", isVerified));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) throws Exception {
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }
        
        System.out.println("Decrypted:"+SignupController.decrypt(user.getPassword()));
       

        userService.saveUser(user);
        /*
        String jwtToken = jwtTokenProvider.generateToken(user.getEmail());

        // Prepare response with token
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User Registered Successfully");
        response.put("token", jwtToken);*/ 
        return ResponseEntity.ok("success");
    }
    
    private static final String SECRET_KEY = "youwillneverknow";

    public static String decrypt(String encryptedPassword) throws Exception {
        SecretKeySpec secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");
        System.out.println("enc password"+encryptedPassword);
        System.out.println("secret key"+secretKey);;
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedPassword));
        return new String(decryptedBytes);
    }
}
