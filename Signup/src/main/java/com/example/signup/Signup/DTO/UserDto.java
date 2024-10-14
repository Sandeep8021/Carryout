package com.example.signup.Signup.DTO;

public class UserDto {
    private String username;
    private String email;
    private String phone;
    private String password;
    private String confirmPassword; // Added for confirmation
    private String Salt;
    // Getters and Setters

    public String getSalt() {
		return Salt;
	}

	public void setSalt(String salt) {
		Salt = salt;
	}

	public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}
