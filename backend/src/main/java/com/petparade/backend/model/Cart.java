package com.petparade.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Double totalPrice = 0.0;

    // One User has One Cart
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    // One Cart has Many Items
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Prevents infinite recursion in JSON
    private List<CartProduct> cartProducts = new ArrayList<>();

    // --- Helper Methods ---
    public void calculateTotal() {
        this.totalPrice = cartProducts.stream()
                .mapToDouble(CartProduct::getTotalPrice)
                .sum();
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public List<CartProduct> getCartProducts() { return cartProducts; }
    public void setCartProducts(List<CartProduct> cartProducts) { this.cartProducts = cartProducts; }
}