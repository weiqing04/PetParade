import React, { createContext, useState, useContext, useEffect } from "react";

const FavouriteContext = createContext();

export const FavouriteProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);

  // Helper function to fetch favourites
  const fetchFavourites = async (username) => {
    if (!username) {
      setFavourites([]);
      return;
    }

    try {
      const response = await fetch(`/api/favourites?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setFavourites(data); // Sync favourites with the backend
        } else {
          console.error("Invalid favourites format from backend");
          setFavourites([]); // Clear on invalid data
        }
      } else {
        console.error("Failed to fetch favourites");
        setFavourites([]); // Clear on failure
      }
    } catch (error) {
      console.error("Error fetching favourites:", error);
      setFavourites([]); // Clear on error
    }
  };

  // Fetch favourites for the logged-in user
  useEffect(() => {
    const username = localStorage.getItem("username");
    fetchFavourites(username);
  }, []);

  // Add product to favourites
  const addToFavourites = async (product) => {
    const username = localStorage.getItem("username");
    if (!username) {
      console.error("No username found in localStorage");
      return;
    }

    try {
      const response = await fetch("/api/favourites", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "add",
          username,
          productId: product.id,
        }),
      });

      if (response.ok) {
        // Refetch favourites from backend to ensure consistency
        await fetchFavourites(username);
      } else {
        let message = "Unknown error";
        try {
          const errorData = await response.json();
          message = errorData.message || message;
        } catch (_) {
          try {
            message = await response.text();
          } catch (_) {}
        }
        console.error("Failed to add to favourites:", message);
      }
    } catch (error) {
      console.error("Error adding to favourites:", error);
    }
  };

  // Remove product from favourites
  const removeFromFavourites = async (productId) => {
    const username = localStorage.getItem("username");
    if (!username) {
      console.error("No username found in localStorage");
      return;
    }

    try {
      const response = await fetch("/api/favourites", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "remove",
          username,
          productId,
        }),
      });

      if (response.ok) {
        // Refetch favourites from backend to ensure consistency
        await fetchFavourites(username);
      } else {
        let message = "Unknown error";
        try {
          const errorData = await response.json();
          message = errorData.message || message;
        } catch (_) {
          try {
            message = await response.text();
          } catch (_) {}
        }
        console.error("Failed to remove from favourites:", message);
      }
    } catch (error) {
      console.error("Error removing from favourites:", error);
    }
  };

  return (
    <FavouriteContext.Provider
      value={{
        favourites,
        setFavourites,
        addToFavourites,
        removeFromFavourites,
      }}
    >
      {children}
    </FavouriteContext.Provider>
  );
};

export const useFavourites = () => useContext(FavouriteContext);
