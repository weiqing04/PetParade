import React, { useState, useEffect } from "react";
import "./Admin.css";

const Admin = () => {
  const [products, setProducts] = useState([]);
  // [UPDATED] Added 'quantity' and 'id' to state
  const [productForm, setProductForm] = useState({
    id: null, // null means adding, value means editing
    name: "",
    price: "",
    description: "",
    category: "",
    quantity: "", // New field
    imageFile: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch products
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

  // [NEW] Populate form for editing
  const handleEditClick = (product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      quantity: product.quantity || 0,
      imageFile: null // Keep null unless they want to change it
    });
    window.scrollTo(0, 0); // Scroll to form
  };

  // [NEW] Cancel Edit
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
      // [UPDATED] Logic to switch between POST (Add) and PUT (Update)
      const url = id ? `/api/products/${id}` : "/api/products";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        alert(id ? "Product Updated!" : "Product Added!");
        fetchProducts(); // Refresh list
        handleCancelEdit(); // Reset form
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
    if(!window.confirm("Are you sure?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <div className="add-product">
        <h2>{productForm.id ? "Edit Product" : "Add New Product"}</h2>
        
        <input
          type="text" placeholder="Name" value={productForm.name}
          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
        />
        <div style={{display: 'flex', gap: '10px', width: '50%'}}>
            <input
            type="number" placeholder="Price" value={productForm.price}
            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
            />
            {/* [NEW] Quantity Input */}
            <input
            type="number" placeholder="Qty" value={productForm.quantity}
            onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
            />
        </div>
        <textarea
          placeholder="Description" value={productForm.description}
          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
        />
        <select
          value={productForm.category}
          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
          className="category-select"
        >
          <option value="">Select Category</option>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
          <option value="small-pet">Small Pet</option>
        </select>

        <label className="image-upload-label">
          {productForm.id ? "Change Image (Optional):" : "Product Image:"}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        <div style={{display: 'flex', gap: '10px', justifyContent: 'center', width: '100%'}}>
            <button className="add-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : (productForm.id ? "Update Product" : "Add Product")}
            </button>
            {productForm.id && (
                <button className="remove-btn" onClick={handleCancelEdit} style={{backgroundColor: '#666', marginTop: 0}}>
                    Cancel
                </button>
            )}
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
             <img 
              src={product.image ? `data:${product.imageType};base64,${product.image}` : "/default-image.png"} 
              alt={product.name} 
              className="product-image" 
            />
            <h3>{product.name}</h3>
            <p>RM {product.price} | Stock: {product.quantity}</p>
            
            {/* [NEW] Edit Button */}
            <button className="view-product-button" style={{marginTop: '10px'}} onClick={() => handleEditClick(product)}>
                Edit
            </button>
            <button className="remove-btn" onClick={() => handleRemoveProduct(product.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;