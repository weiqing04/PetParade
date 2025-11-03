import React, { useState, useEffect } from "react";
import "./Admin.css";

const Admin = () => {
  const [products, setProducts] = useState([]);
  // [UPDATED] Changed 'image' to 'imageFile' to store the file object
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "", category: "", imageFile: null }); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all products (Unchanged)
  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch products");
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => setError("Failed to load products"));
  }, []);

  // [NEW] Handler to store the selected file object in state
  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, imageFile: e.target.files[0] });
  };

  // [UPDATED] Modified to use FormData for file upload
  const handleAddProduct = async () => {
    // Destructure imageFile from the rest of the product data
    const { imageFile, ...productData } = newProduct;

    if (!productData.name || !productData.price || !productData.category) {
        setError("Please fill out all fields");
        return;
    }

    setLoading(true);
    setError("");

    try {
        // 1. Create FormData
        const formData = new FormData();

        // 2. Append all text fields
        formData.append("name", productData.name);
        formData.append("price", productData.price);
        formData.append("description", productData.description);
        formData.append("category", productData.category);

        // 3. Append the file if one was selected
        if (imageFile) {
            // 'image' is the field name the backend will look for
            formData.append("image", imageFile); 
        }

        const response = await fetch("/api/products", {
            method: "POST",
            // [UPDATED] REMOVE the 'Content-Type': 'application/json' header.
            // The browser will automatically set the correct 'multipart/form-data' header.
            body: formData, // Send the FormData object
        });

        const result = await response.text(); 

        if (response.ok) {
            const createdProduct = JSON.parse(result);
            setProducts([...products, createdProduct]);
            // [UPDATED] Reset the form, including the imageFile state
            setNewProduct({ name: "", price: "", description: "", category: "", imageFile: null }); 
        } else {
            setError(result); 
        }
    } catch (err) {
        setError("Error adding product");
    } finally {
        setLoading(false);
    }
  };

  // Remove a product (Unchanged)
  const handleRemoveProduct = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedResponse = await fetch("/api/products");
        const updatedProducts = await updatedResponse.json();
        setProducts(updatedProducts);
      } else {
        setError("Failed to remove product");
      }
    } catch {
      setError("Error removing product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin - Manage Products</h1>

      {/* Add Product Section */}
      <div className="add-product">
        <h2>Add Product</h2>
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <select
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          className="category-select"
        >
          <option value="">Select Product Category</option>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
          <option value="small-pet">Small Pet</option>
        </select>
        
        {/* --- [NEW] Image Upload Section --- */}
        <label className="image-upload-label">
          Product Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {/* Show the selected file name */}
          {newProduct.imageFile && <span className="file-name">{newProduct.imageFile.name}</span>}
        </label>
        {/* ---------------------------------- */}
        
        <button className="add-btn" onClick={handleAddProduct} disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Product List (Unchanged) */}
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img 
              src={product.image ? `data:${product.imageType};base64,${product.image}` : "/default-image.png"} 
              alt={product.name} 
              className="product-image" 
            />
            <h3>{product.name}</h3>
            <p>Price: RM {product.price}</p>
            <p>{product.description}</p>
            <p>Category: {product.category}</p>
            <button
              className="remove-btn"
              onClick={() => handleRemoveProduct(product.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;