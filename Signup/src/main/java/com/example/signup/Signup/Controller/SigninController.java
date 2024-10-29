package com.example.signup.Signup.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.signup.Signup.Entity.User;
import com.example.signup.Signup.Security.JwtTokenProvider;
import com.example.signup.Signup.Service.SignInVerificationService;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "http://localhost:3000")
public class SigninController {
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider; 

    @Autowired
    private SignInVerificationService signInVerification;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User user) {
        System.out.println("In Login");
        Map<String, Object> response = new HashMap<>();
        System.out.println(user.getEmail() + "->" + user.getPassword());

        if (signInVerification.verifyUser(user.getEmail(), user.getPassword())) {
            String jwtToken = jwtTokenProvider.generateToken(user.getEmail());

            // Prepare response with token
            response.put("message", "User logged in successfully");
            response.put("token", jwtToken);
            return ResponseEntity.ok(response);  // Correct return type
        }

        response.put("message", "Invalid email or password");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);  // Include custom message with NOT_FOUND
    }
}
