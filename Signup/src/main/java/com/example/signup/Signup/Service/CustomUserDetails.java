package com.example.signup.Signup.Service;


import com.example.signup.Signup.Entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Since you're not implementing roles/authorities, return an empty list
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Customize this based on your requirements
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Customize this based on your requirements
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Customize this based on your requirements
    }

    @Override
    public boolean isEnabled() {
        // Here you can check if the user is verified or not, based on your database field
        return user.isEmailVerified();  // Assuming `isEmailVerified()` is a field in the User entity
    }

    public User getUser() {
        return user;
    }
}
