package com.example.signup.Signup.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.signup.Signup.Entity.Restaurant;

import java.util.List;

public interface RestaurantRepository extends MongoRepository<Restaurant, String> {
    List<Restaurant> findByNameContainingIgnoreCase(String name);
}
