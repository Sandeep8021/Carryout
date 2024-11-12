package com.example.signup.Signup.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.signup.Signup.Entity.Checkout;
import com.example.signup.Signup.Service.CheckoutService;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins="http:localhost/3000")
public class CheckoutController {

    @Autowired
    private CheckoutService checkoutService;

    @PostMapping("/process")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<String> processCheckout(@RequestBody Checkout checkoutRequest) {
        try {
            // Call the service to process the checkout
            checkoutService.processCheckout(checkoutRequest);
            System.out.println(checkoutRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body("Checkout processed successfully.");
        } catch (Exception e) {
            // Handle any exceptions that occur during checkout processing
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to process checkout: " + e.getMessage());
        }
    }
}
