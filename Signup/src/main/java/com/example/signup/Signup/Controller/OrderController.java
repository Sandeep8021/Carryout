package com.example.signup.Signup.Controller;

//OrderController.java
import org.springframework.web.bind.annotation.*;

import com.example.signup.Signup.Entity.Checkout;
import com.example.signup.Signup.Service.CheckoutService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins="http://localhost:3000")
public class OrderController {

private final CheckoutService orderService;

public OrderController(CheckoutService orderService) {
 this.orderService = orderService;
}

@GetMapping
public List<Checkout> getOrdersByEmail(@RequestParam String email) {
	System.out.println("email"+email);
 return orderService.findByEmail(email); // Fetch orders by email
}
}
