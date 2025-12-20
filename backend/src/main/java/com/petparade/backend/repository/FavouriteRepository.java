package com.petparade.backend.repository;

import com.petparade.backend.model.Favourite;
import com.petparade.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional; // Import this

import java.util.List;
import java.util.Optional;

public interface FavouriteRepository extends JpaRepository<Favourite, Integer> {
    
    @Query("SELECT f.product FROM Favourite f WHERE f.user.username = :username")
    List<Product> findFavouriteProductsByUsername(@Param("username") String username);
    
    @Query("SELECT f FROM Favourite f WHERE f.user.id = :userId AND f.product.id = :productId")
    Optional<Favourite> findByUserIdAndProductId(@Param("userId") Integer userId, @Param("productId") Integer productId);

    @Query("SELECT (COUNT(f) > 0) FROM Favourite f WHERE f.user.id = :userId AND f.product.id = :productId")
    boolean existsByUserIdAndProductId(@Param("userId") Integer userId, @Param("productId") Integer productId);

    //Allow deleting favorites for a specific product
    @Transactional
    void deleteByProductId(Integer productId);
}