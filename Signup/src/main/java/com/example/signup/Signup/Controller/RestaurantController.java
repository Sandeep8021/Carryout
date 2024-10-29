package com.example.signup.Signup.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.signup.Signup.Entity.MenuItem;
import com.example.signup.Signup.Entity.Restaurant;
import com.example.signup.Signup.Service.RestaurantService;

@RestController
@RequestMapping("api/restaurants")
@CrossOrigin(origins = "http://localhost:3000")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping("/list")
    public List<Restaurant> listOfRestaurants() {
        System.out.println("List of restaurants are being shown");
        return restaurantService.getAllRestaurants();
    }

    @PostMapping("/add")
    public Restaurant addRestaurant(@RequestBody Restaurant restaurant) {
        return restaurantService.saveRestaurant(restaurant);
    }

    @GetMapping("/search")
    public List<Restaurant> searchRestaurants(@RequestParam("name") String name) {
        return restaurantService.searchRestaurants(name);
    }
    @GetMapping("/{restaurantId}/menu")
    public Restaurant getRestaurantById(@PathVariable String restaurantId) {
        return restaurantService.getRestaurantById(restaurantId);
    }

    @PostMapping("/{restaurantId}/menu")
    public Restaurant updateRestaurantMenu(@PathVariable String restaurantId, @RequestBody List<MenuItem> menu) {
        return restaurantService.updateRestaurantMenu(restaurantId, menu);
    }
}
