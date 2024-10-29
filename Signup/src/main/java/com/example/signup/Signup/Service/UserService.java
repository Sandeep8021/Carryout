package com.example.signup.Signup.Service;
/*
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.example.signup.Signup.Entity.User;
import com.example.signup.Signup.Repository.UserRepository;



@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public void saveUser(User user) {
    	user.setEmailVerified(true);
    	user.setPassword( BCrypt.hashpw(user.getPassword(), BCrypt.gensalt(12)));
    	user.setSalt(12);
        userRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByPhone(String phone) {
        return userRepository.existsByPhone(phone);
    }
}*/


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import com.example.signup.Signup.Entity.User;
import com.example.signup.Signup.Repository.UserRepository;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Save the user with hashed password
    public void saveUser(User user) {
        user.setEmailVerified(true);  // You might want to verify this via OTP/email
        System.out.println(user.getPassword());
        user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt(12)));  // Hash password
        user.setSalt(12);  // Optional, but not necessary for BCrypt
        userRepository.save(user);
    }

    // Check if user exists by email
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // Check if user exists by phone
    public boolean existsByPhone(String phone) {
        return userRepository.existsByPhone(phone);
    }

    // Fetch a user by email for authentication (this will be used by your custom user details service)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Fetch a user by phone, if needed for phone-based login later
    public Optional<User> findByPhone(String phone) {
        return userRepository.findByPhone(phone);
    }
}


