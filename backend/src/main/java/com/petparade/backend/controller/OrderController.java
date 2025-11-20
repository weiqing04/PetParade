package com.petparade.backend.controller;

import com.petparade.backend.dto.MessageResponse;
import com.petparade.backend.model.*;
import com.petparade.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private OrderProductRepository orderProductRepository;

    // DTO Class for the request body
    public static class CheckoutRequest {
        public String username;
        public List<CartItemDto> items;
        public String paymentMethod;
    }

    public static class CartItemDto {
        public Integer productId;
        public Integer quantity;
    }

    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request) {
        User user = userRepository.findByUsername(request.username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(new Date());
        order.setPaymentStatus("PAID"); // Simplified for assignment
        order.setPaymentMethod(request.paymentMethod);
        
        double total = 0.0;

        // Save order first to get an ID
        order = orderRepository.save(order);

        for (CartItemDto item : request.items) {
            Product product = productRepository.findById(item.productId)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.productId));

            // Check stock (Optional improvement)
             if (product.getQuantity() < item.quantity) {
                 throw new RuntimeException("Not enough stock for " + product.getName());
             }

            // Deduct stock
            product.setQuantity(product.getQuantity() - item.quantity);
            productRepository.save(product);

            // Create OrderProduct entry
            OrderProduct op = new OrderProduct();
            op.setOrder(order);
            op.setProduct(product);
            op.setQuantity(item.quantity);
            op.setPrice(product.getPrice());
            orderProductRepository.save(op);

            total += product.getPrice() * item.quantity;
        }

        order.setTotalPrice(total);
        orderRepository.save(order); // Update total price

        return ResponseEntity.ok(new MessageResponse("Order placed successfully!"));
    }
}