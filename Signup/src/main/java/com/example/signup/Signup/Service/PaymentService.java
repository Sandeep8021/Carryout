package com.example.signup.Signup.Service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@JsonIgnoreProperties({"lastResponse"})
public class PaymentService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;
    @JsonIgnoreProperties(ignoreUnknown = true)
    public PaymentIntent createPaymentIntent(Long amount) throws StripeException {
        Stripe.apiKey = stripeApiKey;
        System.out.println(Stripe.apiKey);

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency("usd")
                .build();
        System.out.println(params.toString());
        System.out.println(PaymentIntent.create(params));

        return PaymentIntent.create(params);
    }
}
