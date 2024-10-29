package com.example.signup.Signup.Repository;


import com.example.signup.Signup.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);
    
    boolean existsByPhone(String phone);
    
    Optional<User> findByEmail(String email);  // For authentication during login
    
    Optional<User> findByPhone(String phone);  // If you want phone-based authentication
}
