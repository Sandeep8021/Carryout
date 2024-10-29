package com.example.signup.Signup.Repository;

import com.example.signup.Signup.Entity.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepo extends MongoRepository<MenuItem, String> {
	/*
    List<MenuItem> findByRestaurantId(String restaurantId);*/
}
