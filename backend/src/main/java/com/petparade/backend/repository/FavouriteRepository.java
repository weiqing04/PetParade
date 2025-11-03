package com.petparade.backend.repository;

import com.petparade.backend.model.Favourite;
import com.petparade.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // [NEW] Import this

import java.util.List;
import java.util.Optional;

public interface FavouriteRepository extends JpaRepository<Favourite, Integer> {
    
    // This query is correct and should not be changed.
    @Query("SELECT f.product FROM Favourite f WHERE f.user.username = :username")
    List<Product> findFavouriteProductsByUsername(@Param("username") String username);
    
    // [MODIFIED] We are replacing the derived query with an explicit one for clarity and reliability.
    // This tells JPA to find a Favourite 'f' where its 'user' object has an 'id' of :userId
    // AND its 'product' object has an 'id' of :productId.
    @Query("SELECT f FROM Favourite f WHERE f.user.id = :userId AND f.product.id = :productId")
    Optional<Favourite> findByUserIdAndProductId(@Param("userId") Integer userId, @Param("productId") Integer productId);

    @Query("SELECT (COUNT(f) > 0) FROM Favourite f WHERE f.user.id = :userId AND f.product.id = :productId")
    boolean existsByUserIdAndProductId(@Param("userId") Integer userId, @Param("productId") Integer productId);
}