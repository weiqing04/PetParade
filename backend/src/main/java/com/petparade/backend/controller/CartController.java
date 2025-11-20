package com.petparade.backend.controller;

import com.petparade.backend.dto.MessageResponse;
import com.petparade.backend.model.*;
import com.petparade.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired private CartRepository cartRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    // Get User's Cart
    @GetMapping("/{username}")
    public ResponseEntity<?> getCart(@PathVariable String username) {
        Optional<Cart> cart = cartRepository.findByUser_Username(username);
        if (cart.isPresent()) {
            return ResponseEntity.ok(cart.get());
        }
        return ResponseEntity.ok(new MessageResponse("Cart is empty"));
    }

    // Add Item to Cart
    @PostMapping("/add")
    @Transactional
    public ResponseEntity<?> addToCart(@RequestParam String username, 
                                       @RequestParam Integer productId, 
                                       @RequestParam Integer quantity) {
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 1. Find or Create Cart for User
        Cart cart = cartRepository.findByUser_Username(username).orElse(new Cart());
        if (cart.getUser() == null) {
            cart.setUser(user);
        }

        // 2. Check if Product already exists in Cart
        Optional<CartProduct> existingItem = cart.getCartProducts().stream()
                .filter(cp -> cp.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            // Update existing item
            CartProduct cp = existingItem.get();
            cp.setQuantity(cp.getQuantity() + quantity);
            cp.updateTotalPrice();
        } else {
            // Create new item
            CartProduct cp = new CartProduct();
            cp.setCart(cart);
            cp.setProduct(product);
            cp.setQuantity(quantity);
            cp.setPrice(product.getPrice());
            cp.updateTotalPrice();
            cart.getCartProducts().add(cp);
        }

        // 3. Recalculate Cart Total and Save
        cart.calculateTotal();
        cartRepository.save(cart);

        return ResponseEntity.ok(new MessageResponse("Added to cart successfully"));
    }
}