package com.example.signup.Signup.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.example.signup.Signup.Entity.User;
import com.example.signup.Signup.Repository.UserRepository;

@Service
public class SignInVerificationService {
	
	@Autowired
    private UserRepository userRepository;
	
	public boolean verifyUser(String email, String password) {
		User user = userRepository.findByEmail(email);
		
		if(user != null) {
			System.out.println(user.toString()+"++++++"+user.getPassword());
			System.out.println(password+"++++"+BCrypt.hashpw(user.getPassword(),BCrypt.gensalt(12)));
			return true;
		}
		
		return false;
	}
}
