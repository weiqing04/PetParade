import React, { useState, useEffect } from "react";
import "./Admin.css";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    id: null,
    name: "",
    price: "",
    description: "",
    category: "",
    quantity: "",
    imageFile: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setError("Failed to load products"));
  };

  const handleImageChange = (e) => {
    setProductForm({ ...productForm, imageFile: e.target.files[0] });
  };

  const handleEditClick = (product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      quantity: product.quantity || 0,
      imageFile: null
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setProductForm({ id: null, name: "", price: "", description: "", category: "", quantity: "", imageFile: null });
  };

  const handleSubmit = async () => {
    const { id, imageFile, ...data } = productForm;
    if (!data.name || !data.price || !data.category || !data.quantity) {
      setError("Please fill out all fields");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("quantity", data.quantity);
    if (imageFile) formData.append("image", imageFile);

    try {
      const url = id ? `/api/products/${id}` : "/api/products";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        alert(id ? "Product Updated!" : "Product Added!");
        fetchProducts();
        handleCancelEdit();
      } else {
        const msg = await response.text();
        setError(msg);
      }
    } catch (err) {
      setError("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (id) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <div className="admin-card form-section">
        <h2 className="form-title">{productForm.id ? "Edit Product" : "Add New Product"}</h2>
        
        <div className="form-group">
            <input
              type="text" 
              placeholder="Product Name" 
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="admin-input"
            />
        </div>

        <div className="form-row">
            <input
                type="number" 
                placeholder="Price (RM)" 
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                className="admin-input"
            />
            <input
                type="number" 
                placeholder="Quantity" 
                value={productForm.quantity}
                onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                className="admin-input"
            />
        </div>

        <textarea
          placeholder="Product Description" 
          value={productForm.description}
          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
          className="admin-input admin-textarea"
        />

        <div className="form-group">
            <select
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              className="admin-input category-select"
            >
              <option value="">Select Category</option>
              <option value="cat">Cat Products</option>
              <option value="dog">Dog Products</option>
              <option value="small-pet">Small Pet Products</option>
            </select>
        </div>

        <label className="image-upload-label">
          {productForm.id ? "Update Image (Optional):" : "Upload Image:"}
          <div className="file-input-wrapper">
             <input type="file" accept="image/*" onChange={handleImageChange} />
             <i className="fas fa-cloud-upload-alt"></i>
          </div>
        </label>

        <div className="button-group">
            <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : (productForm.id ? "Update Product" : "Add Product")}
            </button>
            {productForm.id && (
                <button className="cancel-btn" onClick={handleCancelEdit}>
                    Cancel
                </button>
            )}
        </div>
        
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="admin-divider">
        <span>Current Inventory</span>
      </div>

      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="admin-product-card">
             <div className="card-image-wrapper">
                 <img 
                  src={product.image ? `data:${product.imageType};base64,${product.image}` : "/default-image.png"} 
                  alt={product.name} 
                  className="product-image" 
                />
             </div>
            <div className="card-details">
                <h3>{product.name}</h3>
                <p className="card-meta">RM {product.price} • {product.quantity} in stock</p>
                
                <div className="card-actions">
                    <button className="edit-action-btn" onClick={() => handleEditClick(product)}>
                        <i className="fas fa-edit"></i> Edit
                    </button>
                    <button className="delete-action-btn" onClick={() => handleRemoveProduct(product.id)}>
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;