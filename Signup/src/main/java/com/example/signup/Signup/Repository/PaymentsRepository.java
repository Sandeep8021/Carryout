package com.example.signup.Signup.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.signup.Signup.Entity.Checkout;

@Repository
public interface PaymentsRepository extends MongoRepository<Checkout, String> {

	List<Checkout> findByEmail(String email);
    // You can add custom query methods here if needed
}