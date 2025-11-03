import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { useCart } from "../CartContext";
import { useFavourites } from "../Favourite";
import "./Navbar.css";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [products, setProducts] = useState([]); // Initialize products
  const [userProfile, setUserProfile] = useState(null);
  const [userRole, setUserRole] = useState(null); // State for user role

  const { cartItems } = useCart();
  const { favourites, setFavourites } = useFavourites();
  const navigate = useNavigate();

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data); // Set fetched products
        } else {
          console.error("Failed to fetch products");
          setProducts([]); // Set as empty array on failure
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]); // Set as empty array on error
      }
    };

    fetchProducts();
  }, []);

  // Fetch user role on component mount
  useEffect(() => {
    const fetchUserRole = async () => {
      const username = localStorage.getItem("username");
      if (!username) return;

      try {
        const response = await fetch(`/api/user?username=${username}`);
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role); // Set user role from API response
        } else {
          console.error("Failed to fetch user role");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  // Update search results based on search term
  useEffect(() => {
    if (searchTerm.trim() && Array.isArray(products)) {
      setSearchResults(
        products.filter((product) =>
          product.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
      );
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, products]);

  const handleProductSelect = (product) => {
    navigate("/product", { state: { product } });
    setSearchTerm("");
    setSearchResults([]);
  };

  const fetchUserProfile = async () => {
    const username = localStorage.getItem("username");
    if (!username) return;

    try {
      const response = await fetch(`/api/user?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        setUserProfile({
          name: data.username || "Unknown",
          email: data.email || "Unknown",
          profilePicture: data.profilePicture || "/default-profile.png",
        });
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const openModal = (content, product = null) => {
    setModalContent(content);
    setSelectedProduct(product);
    setIsModalOpen(true);

    if (content === "User Profile") {
      fetchUserProfile();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
    setSelectedProduct(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setFavourites([]); // Clear favourites on logout
    navigate("/login");
    closeModal();
    console.log("User logged out");
  };

  return (
    <>
      <nav className="navbar">
        <img src="/nav_logo.png" alt="Logo" className="nav-logo" />

        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/Home" className="nav-link">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/about" className="nav-link">
              About Us
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/product" className="nav-link">
              Product
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/FAQ" className="nav-link">
              FAQs
            </NavLink>
          </li>
        </ul>

        <div className="nav-tools">
          {/* Conditionally render search bar for non-admin users */}
          {userRole !== "admin" && (
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="button" className="search-button">
                <i className="fas fa-search"></i>
              </button>

              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="search-result-item"
                      onClick={() => handleProductSelect(product)}
                    >
                      {product.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="nav-icons">
            <div className="nav-icon" onClick={() => openModal("Favorite Items")}>
              <i className="fas fa-heart"></i>
              {Array.isArray(favourites) && favourites.length > 0 && (
                <span className="favorites-count">{favourites.length}</span>
              )}
            </div>
            <div className="nav-icon" onClick={() => openModal("Cart Items")}>
              <i className="fas fa-shopping-cart"></i>
              <span className="cart-count">{cartItems.length}</span>
            </div>
            <div className="nav-icon" onClick={() => openModal("User Profile")}>
              <img src="/cat_user.png" alt="User Icon" className="custom-user-icon" />
            </div>
          </div>
        </div>
      </nav>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        content={modalContent}
        selectedProduct={selectedProduct}
        handleLogout={handleLogout}
        userProfile={userProfile}
      />
    </>
  );
};

export default Navbar;
