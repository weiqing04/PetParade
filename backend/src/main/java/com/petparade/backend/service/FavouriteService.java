package com.petparade.backend.service;

import com.petparade.backend.dto.MessageResponse;
import com.petparade.backend.model.Favourite;
import com.petparade.backend.model.Product;
import com.petparade.backend.model.User;
import com.petparade.backend.repository.FavouriteRepository;
import com.petparade.backend.repository.ProductRepository;
import com.petparade.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FavouriteService {

    @Autowired
    private FavouriteRepository favouriteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public ResponseEntity<?> getFavouritesByUsername(String username) {
        List<Product> products = favouriteRepository.findFavouriteProductsByUsername(username);
        return ResponseEntity.ok(products);
    }

    @Transactional
    public ResponseEntity<MessageResponse> addFavourite(String username, Integer productId) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Product> productOpt = productRepository.findById(productId);

        if (!userOpt.isPresent() || !productOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User or Product not found"));
        }

        User user = userOpt.get();
        Product product = productOpt.get();

        if (favouriteRepository.existsByUserIdAndProductId(user.getId(), product.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageResponse("Product already in favourites"));
        }

        Favourite favourite = new Favourite();
        favourite.setUser(user);
        favourite.setProduct(product);
        favouriteRepository.save(favourite);
        return ResponseEntity.ok(new MessageResponse("Added to favourites"));
    }

    @Transactional
    public ResponseEntity<MessageResponse> removeFavourite(String username, Integer productId) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Product> productOpt = productRepository.findById(productId);

        if (!userOpt.isPresent() || !productOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User or Product not found"));
        }

        User user = userOpt.get();
        Product product = productOpt.get();

        Optional<Favourite> fav = favouriteRepository.findByUserIdAndProductId(user.getId(), product.getId());
        if (fav.isPresent()) {
            favouriteRepository.delete(fav.get());
            return ResponseEntity.ok(new MessageResponse("Removed from favourites"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Favourite not found"));
    }
}


