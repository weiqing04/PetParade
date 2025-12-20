package com.petparade.backend.controller;

import com.petparade.backend.dto.MessageResponse;
import com.petparade.backend.model.Product;
import com.petparade.backend.repository.CartProductRepository; // Import
import com.petparade.backend.repository.FavouriteRepository;   // Import
import com.petparade.backend.repository.OrderProductRepository; // Import
import com.petparade.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; // Import
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // [NEW] Inject these repositories
    @Autowired
    private CartProductRepository cartProductRepository;
    
    @Autowired
    private FavouriteRepository favouriteRepository;

    @Autowired
    private OrderProductRepository orderProductRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping
    public Product addProduct(
        @RequestParam("name") String name,
        @RequestParam("price") Double price,
        @RequestParam("description") String description,
        @RequestParam("category") String category,
        @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {
        
        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setDescription(description);
        product.setCategory(category);
        // Default quantity if not provided?
        product.setQuantity(0); 

        if (imageFile != null && !imageFile.isEmpty()) {
            product.setImage(imageFile.getBytes()); 
            product.setImageType(imageFile.getContentType());
        } else {
            product.setImage(null); 
        }

        return productRepository.save(product);
    }

    //Force Delete
    @DeleteMapping("/{id}")
    @Transactional // Ensures all deletes happen together or fail together
    public ResponseEntity<MessageResponse> deleteProduct(@PathVariable Integer id) {
        if (productRepository.existsById(id)) {
            // 1. Remove from all Carts
            cartProductRepository.deleteByProductId(id);
            
            // 2. Remove from all Favorites
            favouriteRepository.deleteByProductId(id);

            // 3. Remove from all Orders (Warning: This modifies history)
            orderProductRepository.deleteByProductId(id);

            // 4. Finally, delete the Product
            productRepository.deleteById(id);
            
            return ResponseEntity.ok(new MessageResponse("Product and all its references were removed"));
        }
        return ResponseEntity.status(404).body(new MessageResponse("Failed to remove product"));
    }

    // ... (Keep existing getProductImage and updateProduct methods unchanged) ...
    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Integer id) {
        return productRepository.findById(id)
            .filter(product -> product.getImage() != null)
            .map(product -> {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.IMAGE_JPEG); 
                headers.setContentLength(product.getImage().length);
                return new ResponseEntity<>(product.getImage(), headers, HttpStatus.OK);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Integer id,
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("quantity") Integer quantity,
            @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {
        
        return productRepository.findById(id).map(product -> {
            product.setName(name);
            product.setPrice(price);
            product.setDescription(description);
            product.setCategory(category);
            product.setQuantity(quantity);

            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    product.setImage(imageFile.getBytes());
                    product.setImageType(imageFile.getContentType());
                } catch (IOException e) {
                    throw new RuntimeException("Error updating image", e);
                }
            }
            productRepository.save(product);
            return ResponseEntity.ok(new MessageResponse("Product updated successfully"));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Product not found")));
    }
}