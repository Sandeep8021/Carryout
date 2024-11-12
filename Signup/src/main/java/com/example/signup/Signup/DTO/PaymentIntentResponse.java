package com.example.signup.Signup.DTO;


public class PaymentIntentResponse {
 private String id;
 private Long amount;
 private String currency;
 private String clientSecret;
 private String status;

 // Getters and setters
 public String getId() {
     return id;
 }

 public void setId(String id) {
     this.id = id;
 }

 public Long getAmount() {
     return amount;
 }

 public void setAmount(Long amount) {
     this.amount = amount;
 }

 public String getCurrency() {
     return currency;
 }

 public void setCurrency(String currency) {
     this.currency = currency;
 }

 public String getClientSecret() {
     return clientSecret;
 }

 public void setClientSecret(String clientSecret) {
     this.clientSecret = clientSecret;
 }

 public String getStatus() {
     return status;
 }

 public void setStatus(String status) {
     this.status = status;
 }
}
