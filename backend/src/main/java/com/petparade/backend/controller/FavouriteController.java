package com.petparade.backend.controller;

import com.petparade.backend.dto.MessageResponse;
import com.petparade.backend.service.FavouriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/favourites")
public class FavouriteController {

    @Autowired
    private FavouriteService favouriteService;

    // GET /api/favourites?username=...
    @GetMapping
    public ResponseEntity<?> getFavourites(@RequestParam String username) {
        try {
            return favouriteService.getFavouritesByUsername(username);
        } catch (Exception e) {
            System.err.println("Error fetching favourites: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Server error: " + e.getMessage()));
        }
    }

    // POST /api/favourites
    @PostMapping
    public ResponseEntity<MessageResponse> handleFavouriteAction(@RequestParam String action,
                                                                 @RequestParam String username,
                                                                 @RequestParam Integer productId) {
        try {
            if ("add".equals(action)) {
                return favouriteService.addFavourite(username, productId);
            } else if ("remove".equals(action)) {
                return favouriteService.removeFavourite(username, productId);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Invalid action"));
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error handling favourite action: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Server error: " + e.getMessage()));
        }
    }
}