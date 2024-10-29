package com.example.signup.Signup.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.example.signup.Signup.Entity.User;
import com.example.signup.Signup.Repository.UserRepository;
/*
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
}*/

import java.util.Optional;

@Service
public class SignInVerificationService {

    @Autowired
    private UserRepository userRepository;

    public boolean verifyUser(String email, String rawPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        System.out.println("In SignInVerificaitonService ->"+email+"pass:"+rawPassword);
        try {
        System.out.println("userOptional"+userOptional.get());
        }
        catch(Exception e){
        	System.out.println("Exception Caugh there");
        }
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            System.out.println("In userOptional"+user.toString() + "++++++" + user.getPassword());

            // Compare rawPassword with hashed password stored in the database
           
            if (BCrypt.checkpw(rawPassword,user.getPassword())) {
            	System.out.println("User matched");
                return true;  // Password matches, user is verified
            }
            else {
            	System.out.println("passwords not matched");
            }
        }
        
        return false;  // User not found or password does not match
    }
}

