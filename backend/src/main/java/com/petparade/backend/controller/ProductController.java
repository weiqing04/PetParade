package com.petparade.backend.controller;

import com.petparade.backend.dto.MessageResponse;
import com.petparade.backend.model.Product;
import com.petparade.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Required for file upload
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

    // GET /api/products (Unchanged)
    @GetMapping
    public List<Product> getAllProducts() {
        // NOTE: When retrieving all products, the image BLOB data will be included, 
        // which can be very large. Consider a DTO for lightweight lists.
        return productRepository.findAll();
    }

    // POST /api/products
    @PostMapping
    public Product addProduct(
        @RequestParam("name") String name,
        @RequestParam("price") Double price,
        @RequestParam("description") String description,
        @RequestParam("category") String category,
        @RequestParam(value = "image", required = false) MultipartFile imageFile // Accept the file
    ) throws IOException { // Add throws IOException for getBytes()
        
        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setDescription(description);
        product.setCategory(category);

        // [MODIFIED] Handle File Upload (BLOB storage)
        if (imageFile != null && !imageFile.isEmpty()) {
            // Convert the uploaded file into a byte array
            product.setImage(imageFile.getBytes()); 
            product.setImageType(imageFile.getContentType());
        } else {
            // Optional: Set a default empty byte array or handle error
            product.setImage(null); 
        }

        return productRepository.save(product);
    }

    // DELETE /api/products/{id} (Unchanged)
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteProduct(@PathVariable Integer id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok(new MessageResponse("Product removed"));
        }
        return ResponseEntity.status(404).body(new MessageResponse("Failed to remove product"));
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Integer id) {
        // 1. Find the product
        return productRepository.findById(id)
            .filter(product -> product.getImage() != null) // Only proceed if image data exists
            .map(product -> {
                // 2. Prepare headers
                HttpHeaders headers = new HttpHeaders();
                // We'll default to JPEG, but ideally, you'd store the image content type too
                headers.setContentType(MediaType.IMAGE_JPEG); 
                headers.setContentLength(product.getImage().length);
                
                // 3. Return the image bytes
                return new ResponseEntity<>(product.getImage(), headers, HttpStatus.OK);
            })
            .orElseGet(() -> ResponseEntity.notFound().build()); // Return 404 if product or image not found
    }
}