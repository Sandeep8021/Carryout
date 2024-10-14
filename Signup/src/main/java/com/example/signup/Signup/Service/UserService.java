package com.example.signup.Signup.Service;

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
}

