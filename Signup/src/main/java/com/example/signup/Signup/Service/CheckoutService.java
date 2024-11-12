package com.example.signup.Signup.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.signup.Signup.Entity.Checkout;
import com.example.signup.Signup.Repository.PaymentsRepository;

@Service
public class CheckoutService {

    @Autowired
    private PaymentsRepository paymentRepository;
    @Autowired
    public CheckoutService(PaymentsRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    public void processCheckout(Checkout request) {
        Checkout checkout = new Checkout();
        checkout.setEmail(request.getEmail());
        checkout.setItems(request.getItems());
        checkout.setTotalAmount(request.getTotalAmount());
        checkout.setPaymentType(request.getPaymentType());
        checkout.setTimestamp(request.getTimestamp());

        // Save the checkout to the MongoDB collection
        paymentRepository.save(checkout);
        
        System.out.println("Checkout Details saved to MongoDB:");
        System.out.println("Email: " + checkout.getEmail());
        System.out.println("Total Amount: " + checkout.getTotalAmount());
        System.out.println("Payment Type: " + checkout.getPaymentType());
        System.out.println("Timestamp: " + checkout.getTimestamp());
    }

  

	public List<Checkout> findByEmail(String email) {
		// TODO Auto-generated method stub
		return paymentRepository.findByEmail(email);
	}
}
