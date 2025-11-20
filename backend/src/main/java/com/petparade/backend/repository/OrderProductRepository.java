package com.petparade.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.petparade.backend.model.OrderProduct;


public interface OrderProductRepository extends JpaRepository<OrderProduct, Integer> {}
