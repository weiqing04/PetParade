import React, { useState, useEffect, useRef } from "react";
import "./Modal.css";
import { useCart } from "../CartContext";
import { useFavourites } from "../Favourite";
import { useNavigate } from "react-router-dom";

const Modal = ({ isOpen, onClose, content, handleLogout, userProfile }) => {
  const { cartItems, updateQuantity, clearCart } = useCart();
  const { favourites, addToFavourites, removeFromFavourites } = useFavourites();
  const navigate = useNavigate();

  // --- State for Profile Picture Upload ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [imageKey, setImageKey] = useState(Date.now()); // Forces image refresh

  // --- Ref for the hidden file input (for "Change Photo" button) ---
  const fileInputRef = useRef(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
        setSelectedFile(null);
        setPreview(null);
        setUploadStatus("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- Profile Picture Handlers ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Show immediate preview
    }
  };

  const handleUploadProfilePic = async () => {
    if (!selectedFile) return;
    if (!userProfile?.name) {
        setUploadStatus("Error: User not found");
        return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("username", userProfile.name);

    try {
      setUploadStatus("Uploading...");
      const response = await fetch("/api/user/upload-photo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("Success!");
        setImageKey(Date.now()); // Force re-render of the image
        
        // Reset selection immediately so "Change Photo" comes back
        setSelectedFile(null);
        setPreview(null);

        // Clear status message after 2 seconds
        setTimeout(() => setUploadStatus(""), 2000);
      } else {
        setUploadStatus("Failed to upload.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Error occurred.");
    }
  };

  // --- Helper Functions for Cart & Favorites ---
  const isFavorited = (productId) => {
    return Array.isArray(favourites) && favourites.some(fav => fav.id === productId);
  };

  const handleToggleFavorite = (item) => {
    if (isFavorited(item.id)) {
      removeFromFavourites(item.id);
    } else {
      addToFavourites(item);
    }
  };

  const handleDecrement = (id, quantity) => {
    if (quantity === 1) {
      if (window.confirm("Remove this item from cart?")) {
        updateQuantity(id, -1);
      }
    } else {
      updateQuantity(id, -1);
    }
  };

  const handleRemove = (id) => {
      const item = cartItems.find(i => i.id === id);
      if (item && window.confirm("Are you sure you want to remove this item?")) {
          updateQuantity(id, -item.quantity); 
      }
  };

  const handleCheckout = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
        alert("Please login to checkout");
        return;
    }
    if (cartItems.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const checkoutData = {
        username: username,
        paymentMethod: "Credit Card",
        items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }))
    };

    try {
        const response = await fetch("/api/orders/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(checkoutData)
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            clearCart();
            onClose();
        } else {
            alert("Checkout failed: " + data.message);
        }
    } catch (error) {
        console.error("Checkout error:", error);
        alert("Checkout failed. Check console.");
    }
  };

  // --- Render Content Switcher ---
  const renderContent = () => {
    switch (content) {
      case "Favorite Items":
        return (
          <div className="shopping-cart">
             <div className="title">Your Favorites</div>
             <div className="favorites-list">
                {Array.isArray(favourites) && favourites.length > 0 ? (
                  favourites.map((item) => (
                    <div className="item" key={item.id}>
                      <div className="image">
                        <img 
                            src={item.image ? `data:${item.imageType};base64,${item.image}` : "/default-image.png"} 
                            alt={item.name} 
                        />
                      </div>
                      <div className="description">
                        <span>{item.name}</span>
                        <span>{item.category || 'Pet Product'}</span>
                      </div>
                      <div className="actions">
                        <button 
                            className="btn-view"
                            onClick={() => {
                                onClose();
                                navigate("/product", { state: { product: item } });
                            }}
                        >
                            View
                        </button>
                        <button 
                            className="btn-remove"
                            onClick={() => removeFromFavourites(item.id)}
                        >
                            Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-msg">No favorites yet.</div>
                )}
             </div>
          </div>
        );

      case "Cart Items":
        return (
          <div className="shopping-cart">
            <div className="title">Shopping Bag</div>

            <div className="cart-items-container">
                {cartItems.length === 0 ? (
                    <div className="empty-msg">Your cart is empty.</div>
                ) : (
                    cartItems.map((item) => (
                    <div className="item" key={item.id}>
                        {/* Buttons (Delete & Like) */}
                        <div className="buttons">
                            <span className="delete-btn" onClick={() => handleRemove(item.id)}>
                                <i className="fas fa-times"></i>
                            </span>
                            <span 
                                className={`like-btn ${isFavorited(item.id) ? "is-active" : ""}`} 
                                onClick={() => handleToggleFavorite(item)}
                            >
                                <i className={`fas fa-heart ${isFavorited(item.id) ? "liked" : ""}`}></i>
                            </span>
                        </div>

                        {/* Image */}
                        <div className="image">
                            <img 
                                src={item.image ? `data:${item.imageType};base64,${item.image}` : "/default-image.png"} 
                                alt={item.name} 
                            />
                        </div>

                        {/* Description */}
                        <div className="description">
                            <span>{item.name}</span>
                            <span>{item.category || "General"}</span>
                            <span className="item-price-unit">RM {item.price}</span>
                        </div>

                        {/* Quantity */}
                        <div className="quantity">
                            <button 
                                className="plus-btn" 
                                type="button" 
                                onClick={() => updateQuantity(item.id, 1)}
                            >
                                <i className="fas fa-plus"></i>
                            </button>
                            <input type="text" value={item.quantity} readOnly />
                            <button 
                                className="minus-btn" 
                                type="button" 
                                onClick={() => handleDecrement(item.id, item.quantity)}
                            >
                                <i className="fas fa-minus"></i>
                            </button>
                        </div>

                        {/* Total Price for Item */}
                        <div className="total-price">
                            RM {(item.price * item.quantity).toFixed(2)}
                        </div>
                    </div>
                    ))
                )}
            </div>

            {/* Footer / Summary */}
            {cartItems.length > 0 && (
                <div className="cart-footer">
                    <div className="cart-summary">
                        <span>Total:</span>
                        <span className="grand-total">
                            RM {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
                        </span>
                    </div>
                    <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
                </div>
            )}
          </div>
        );

      case "User Profile":
        // Construct the image URL with timestamp to force refresh
        const profilePicUrl = userProfile?.name 
            ? `/api/user/photo/${userProfile.name}?t=${imageKey}`
            : "/profile.png";

        return (
          <div className="user-profile-modal">
            <h2>User Profile</h2>
            <div className="user-profile">
              
              {/* 1. Image Section (Top) */}
              <div className="profile-image-container">
                  <img 
                    src={preview || profilePicUrl} 
                    alt="Profile" 
                    className="profile-picture"
                    onError={(e) => { e.target.src = "/profile.png"; }} 
                  />
              </div>

              {/* 2. Info Section (Middle) */}
              <div className="user-info">
                <p><strong>Name:</strong> {userProfile?.name || "Unknown"}</p>
                <p><strong>Email:</strong> {userProfile?.email || "Unknown"}</p>
              </div>

              {/* 3. Action Buttons Section (Bottom) */}
              <div className="profile-actions">
                  {/* Hidden Input controlled by Ref */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: "none" }} 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  
                  {/* "Change Photo" Button -> Triggers Input Click */}
                  {!selectedFile && (
                    <button 
                        className="edit-profile-btn" 
                        onClick={() => fileInputRef.current.click()}
                    >
                        Change Photo
                    </button>
                  )}

                  {/* "Confirm Upload" Button -> Uploads File */}
                  {selectedFile && (
                      <button className="upload-confirm-btn" onClick={handleUploadProfilePic}>
                          Confirm Upload
                      </button>
                  )}

                  {/* Status Message */}
                  {uploadStatus && <div className="upload-status">{uploadStatus}</div>}
              </div>

              {/* 4. Logout Button (Footer) */}
              <div className="button-container">
                <button className="logout-button" onClick={handleLogout}>Log out</button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        {renderContent()}
      </div>
    </div>
  );
};

export default Modal;