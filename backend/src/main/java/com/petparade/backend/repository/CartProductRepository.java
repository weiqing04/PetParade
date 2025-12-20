package com.petparade.backend.repository;

import com.petparade.backend.model.CartProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional; // Import this

public interface CartProductRepository extends JpaRepository<CartProduct, Integer> {
    
    // Allow deleting all cart items for a specific product
    @Transactional
    void deleteByProductId(Integer productId);
}