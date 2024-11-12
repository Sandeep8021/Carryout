package com.example.signup.Signup.Controller;

import com.example.signup.Signup.DTO.PaymentIntentResponse;
import com.example.signup.Signup.DTO.PaymentRequest;
import com.example.signup.Signup.Service.PaymentService;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

 // PaymentController.java
    @PostMapping("/create")
    @CrossOrigin(origins="http://localhost:3000")
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(@RequestBody PaymentRequest paymentRequest) {
        Long amount = paymentRequest.getAmount();
        try {
            PaymentIntent paymentIntent = paymentService.createPaymentIntent(amount);

            PaymentIntentResponse response = new PaymentIntentResponse();
            response.setId(paymentIntent.getId());
            response.setAmount(paymentIntent.getAmount());
            response.setCurrency(paymentIntent.getCurrency());
            response.setClientSecret(paymentIntent.getClientSecret());
            response.setStatus(paymentIntent.getStatus());

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            System.out.println(e);
            return ResponseEntity.status(500).body(null);
        }
    }

}
