import React from "react";
import "./Modal.css";
import { useCart } from "../CartContext";
import { useFavourites } from "../Favourite";
import { useNavigate } from "react-router-dom";

const Modal = ({ isOpen, onClose, content, handleLogout, userProfile }) => {
  const { cartItems, updateQuantity } = useCart();
  const { favourites, removeFromFavourites } = useFavourites();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDecrement = (id, quantity) => {
    if (quantity === 1) {
      const confirmRemoval = window.confirm("Do you want to remove this product from the cart?");
      if (confirmRemoval) {
        updateQuantity(id, -1);
      }
    } else {
      updateQuantity(id, -1);
    }
  };

  const renderContent = () => {
    switch (content) {
      case "Favorite Items":
        return (
          <>
            <h2>Your Favorites</h2>
            <table className="favorites-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(favourites) && favourites.length > 0 ? (
                  favourites.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="favorite-item">
                          {/* [MODIFIED] This img tag now displays the Base64 image */}
                          <img
                            src={item.image ? `data:${item.imageType};base64,${item.image}` : "/default-image.png"}
                            alt={item.name}
                            className="favorite-item-image"
                          />
                          <span className="item-name">{item.name}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          className="view-product-button"
                          onClick={() => {
                            onClose();
                            navigate("/product", { state: { product: item } });
                          }}
                        >
                          View Product
                        </button>
                        <button
                          className="unfavourite-button"
                          onClick={async () => {
                            await removeFromFavourites(item.id);
                          }}
                        >
                          Unfavourite
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No favorites yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        );
      case "Cart Items":
        return (
          <>
            <h2>Your Cart</h2>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="cart-item">
                        {/* [MODIFIED] This img tag now displays the Base64 image */}
                        <img 
                          src={item.image ? `data:${item.imageType};base64,${item.image}` : "/default-image.png"} 
                          alt={item.name} 
                          className="cart-item-image" 
                        />
                        <span className="item-name">{item.name}</span>
                      </div>
                    </td>
                    <td>${item.price}</td>
                    <td>
                      <button onClick={() => handleDecrement(item.id, item.quantity)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-summary">
              <span>
                Subtotal: $
                {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
              </span>
            </div>
          </>
        );
      case "User Profile":
        return (
          <div className="user-profile-modal">
            <h2>User Profile</h2>
            <div className="user-profile">
              <img
                src="/profile.png" // Hardcoded profile picture
                alt="Profile"
                className="profile-picture"
              />
              <div className="user-info">
                <p><strong>Name:</strong> {userProfile?.name || "Unknown"}</p>
                <p><strong>Email:</strong> {userProfile?.email || "Unknown"}</p>
              </div>
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
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default Modal;