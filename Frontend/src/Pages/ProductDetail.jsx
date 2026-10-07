import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';
import { useCart } from '../Context/CartContext.jsx';
import { API } from '../config';

const ProductDetail = () => {
  const { id } = useParams();
  // 1. New state variables for database fetching
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // 2. Fetch the specific product from Flask when the page loads
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Using the exact IPv4 address to avoid the connection error!
        const response = await fetch(`${API}/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found in database');
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // This re-runs if the URL ID changes

  // 3. Handle the loading screen while waiting for Flask
  if (loading) {
    return <h2 className="loading-msg" style={{ textAlign: 'center', padding: '50px' }}>Loading product details...</h2>;
  }

  // 4. Handle errors (like someone typing /product/999)
  if (error || !product) {
    return <h2 className="error-msg" style={{ textAlign: 'center', padding: '50px' }}>Product not found!</h2>;
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size.');
      return;
    }
    
    addToCart(product, selectedSize);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size.');
      return;
    }
    addToCart(product, selectedSize);
    navigate('/checkout');
  };

  return (
    <div className="product-detail-container">
      {/* Left Column: Image */}
      <div className="detail-image-box">
        {/* The database will send the image path here */}
        <img src={product.imageUrl} alt={product.name} />
      </div>

      {/* Right Column: Info & Actions */}
      <div className="detail-info-box">
        <h1 className="detail-title">{product.name}</h1>
        {/* Formatting the price just in case the database stores it as a raw number */}
        <p className="detail-price">
          {typeof product.price === 'number' ? `₹${product.price.toFixed(2)}` : product.price}
        </p>
        
        <div className="detail-description">
          <p>{product.description || 'Super soft, breathable, and perfect for everyday little adventures.'}</p>
        </div>

        {/* Size Selector */}
        <div className="size-selector">
          <h4>Select Size</h4>
          <div className="size-buttons">
            {(product.sizes || []).map((size) => (
              <button 
                key={size}
                className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="detail-actions">
          <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}>
            {product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
          </button>
          {product.stock !== 0 && (
            <button className="buy-now-btn" onClick={handleBuyNow}>Buy now</button>
          )}
        </div>
      </div>

      <div className={`toast-notification ${showToast ? 'show' : ''}`}>
        <span className="toast-icon">✓</span>
        <p>{product.name} ({selectedSize}) added to cart!</p>
      </div>
    </div>
  );
};

export default ProductDetail;