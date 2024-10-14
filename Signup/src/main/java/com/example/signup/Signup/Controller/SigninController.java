package com.example.signup.Signup.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.signup.Signup.Entity.User;
import com.example.signup.Signup.Service.SignInVerificationService;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "http://localhost:3000")
public class SigninController {
	
	@Autowired
	private SignInVerificationService signInVerification;
	@PostMapping("/login")
	@CrossOrigin(origins = "http://localhost:3000")
	public ResponseEntity<String> authenticateUser(@RequestBody User user){
		System.out.println("In Login");
		System.out.println(user.getEmail()+"->"+user.getPassword());
		if (signInVerification.verifyUser(user.getEmail(), user.getPassword())) {
			return ResponseEntity.ok("Authenticated");
		}
		return ResponseEntity.ok("Bad Credentials");
		
	}

}
