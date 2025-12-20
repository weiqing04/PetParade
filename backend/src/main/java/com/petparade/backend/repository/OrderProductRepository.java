package com.petparade.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.petparade.backend.model.OrderProduct;
import org.springframework.transaction.annotation.Transactional; // Import this

public interface OrderProductRepository extends JpaRepository<OrderProduct, Integer> {
    
    //Allow deleting order history items for a specific product
    @Transactional
    void deleteByProductId(Integer productId);
}