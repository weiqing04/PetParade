package com.petparade.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "favourites", uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "productId"}))
public class Favourite {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne @JoinColumn(name = "userId")
    private User user;
    
    @ManyToOne @JoinColumn(name = "productId")
    private Product product;

    // Getters and Setters...
    public Integer getId() { return id; }
    public User getUser() { return user; }
    public Product getProduct() { return product; }

    public void setUser(User user) { this.user = user; }
    public void setProduct(Product product) { this.product = product; }
}