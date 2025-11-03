import React, { useState, useEffect } from "react";
import "./Product.css";
import { useLocation } from "react-router-dom";
import { useCart } from "../CartContext"; // Import CartContext for cart state
import { useFavourites } from "../Favourite"; // Import FavouriteContext

const ProductCard = ({ product, openModal }) => {
  const { favourites = [], addToFavourites, removeFromFavourites } = useFavourites();
  const [statusMessage, setStatusMessage] = useState("");

  // Check if the product is in the favorites list
  const isFavorited = Array.isArray(favourites) && favourites.some((fav) => fav.id === product.id);

  const handleFavoriteClick = () => {
    if (isFavorited) {
      removeFromFavourites(product.id);
      setStatusMessage(`Removed ${product.name} from favorites`);
    } else {
      addToFavourites(product);
      setStatusMessage(`Added ${product.name} to favorites`);
    }

    setTimeout(() => setStatusMessage(""), 3000); // Clear the status message after 3 seconds
  };

  return (
    <div className="product-card">
      {/* [MODIFIED] This img tag now displays the Base64 image from the backend */}
      <img 
        src={product.image ? `data:${product.imageType};base64,${product.image}` : "/default-image.png"} 
        alt={product.name} 
        className="product-image" 
      />
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">RM {product.price}</p>
      <p className="product-description">{product.description}</p>
      <div className="button-container">
        <button className="add-to-cart" onClick={() => openModal(product)}>
          Add to Cart
        </button>
        <div
          className={`love-btn ${isFavorited ? "favorited" : ""}`}
          onClick={handleFavoriteClick}
        >
          <i className="fas fa-heart"></i>
        </div>
      </div>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
};

const Modal = ({ product, closeModal, addToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (action) => {
    setQuantity((prev) =>
      action === "increment" ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-btn" onClick={closeModal}>
          X
        </button>
        {/* [MODIFIED] This img tag also displays the Base64 image */}
        <img 
          src={product.image ? `data:${product.imageType};base64,${product.image}` : "/default-image.png"} 
          alt={product.name} 
          className="modal-product-image" 
        />
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Price: RM {(product.price * quantity).toFixed(2)}</p>

        <div className="quantity-wrapper">
          <button
            className="quantity-btn"
            onClick={() => handleQuantityChange("decrement")}
          >
            −
          </button>
          <input type="number" value={quantity} readOnly className="quantity-input" />
          <button
            className="quantity-btn"
            onClick={() => handleQuantityChange("increment")}
          >
            +
          </button>
        </div>

        <button className="add-to-cart" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// [UNMODIFIED] This is the ProductSection you asked about.
// It doesn't need changes because its child (ProductCard) was modified.
const ProductSection = ({ title, products, openModal }) => (
  <div className="product-section">
    <h2>{title}</h2>
    <div className="product-list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          openModal={openModal} // Pass openModal to ProductCard
        />
      ))}
    </div>
  </div>
);

const Product = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch products");
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      });
  }, []);

  const openModal = (product) => {
    setModalProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalProduct(null);
    setIsModalOpen(false);
  };

  const catProducts = products.filter((product) => product.category === "cat");
  const dogProducts = products.filter((product) => product.category === "dog");
  const smallPetProducts = products.filter(
    (product) => product.category === "small-pet"
  );

  const location = useLocation();
  const { state } = location;
  const preselectedProduct = state?.product;

  useEffect(() => {
    if (preselectedProduct) openModal(preselectedProduct);
  }, [preselectedProduct]);

  return (
    <div className="product-page">
      <h1>Our Products</h1>

      {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          <ProductSection
            title="Cat Products"
            products={catProducts}
            openModal={openModal}
          />
          <ProductSection
            title="Dog Products"
            products={dogProducts}
            openModal={openModal}
          />
          <ProductSection
            title="Small Pet Products"
            products={smallPetProducts}
            openModal={openModal}
          />
        </>
      )}

      {isModalOpen && modalProduct && (
        <Modal
          product={modalProduct}
          closeModal={closeModal}
          addToCart={addToCart}
        />
      )}
    </div>
  );
};

export default Product;