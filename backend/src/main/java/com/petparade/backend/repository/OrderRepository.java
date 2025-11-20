package com.petparade.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.petparade.backend.model.Order;

public interface OrderRepository extends JpaRepository<Order, Integer> {}
