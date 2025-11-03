package com.petparade.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private Double price;
    private String description;
    private String category;
    
    // [MODIFIED] Use byte[] for BLOB storage and add @Lob
    @Lob 
    private byte[] image; 
    private String imageType;

    // Getters and Setters...
    public Integer getId() { return id; }
    public String getName() { return name; }
    public Double getPrice() { return price; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    
    // [MODIFIED] Getter returns byte[]
    public byte[] getImage() { return image; }

    // --- Add/Modify Setters ---
    public void setName(String name) { this.name = name; }
    public void setPrice(Double price) { this.price = price; }
    public void setDescription(String description) { this.description = description; }
    public void setCategory(String category) { this.category = category; }
    
    // [MODIFIED] Setter accepts byte[]
    public void setImage(byte[] image) { this.image = image; }

    public String getImageType() { return imageType; }
public void setImageType(String imageType) { this.imageType = imageType; }
}