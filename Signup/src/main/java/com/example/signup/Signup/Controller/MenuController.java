package com.example.signup.Signup.Controller;
 
import com.example.signup.Signup.Entity.MenuItem;
import com.example.signup.Signup.Service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "http://localhost:3000")
public class MenuController {
/*
    @Autowired
    private MenuService menuService;

    // Endpoint to get the menu items of a specific restaurant
    @GetMapping("/{restaurantId}/menu")
    public ResponseEntity<List<MenuItem>> getMenuByRestaurantId(@PathVariable String restaurantId) {
        List<MenuItem> menuItems = menuService.getMenuItemsByRestaurantId(restaurantId);

        if (menuItems.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(menuItems);
    }

    // Endpoint to add a list of menu items for a specific restaurant
    @PostMapping("/{restaurantId}/menu")
    public ResponseEntity<List<MenuItem>> addMenuItems(@PathVariable String restaurantId, @RequestBody List<MenuItem> menuItems) {
        // Set restaurantId for each menu item before saving
        for (MenuItem item : menuItems) {
            item.setRestaurantId(restaurantId);
        }
        List<MenuItem> savedItems = menuService.saveMenuItems(menuItems);
        return ResponseEntity.ok(savedItems);
    }*/
}

