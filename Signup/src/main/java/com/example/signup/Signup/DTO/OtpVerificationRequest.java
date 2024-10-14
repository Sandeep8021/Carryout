package com.example.signup.Signup.DTO;

public class OtpVerificationRequest {
    private String email;      // Add email field

    private String emailOtp;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getEmailOtp() {
		return emailOtp;
	}

	public void setEmailOtp(String emailOtp) {
		this.emailOtp = emailOtp;
	}

    // Getters and Setters

    
}
