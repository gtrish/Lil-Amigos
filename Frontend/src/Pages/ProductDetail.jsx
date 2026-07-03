import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { newArrivalsData } from '../mockData';
import './ProductDetail.css';
import { useCart } from '../Context/CartContext.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const product = newArrivalsData.find((item) => item.id === parseInt(id));

  const [selectedSize, setSelectedSize] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { addToCart } = useCart();

  if (!product) {
    return <h2 className="error-msg">Product not found!</h2>;
  }

  // 1. FIX: Properly separated and closed this function!
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

  // 2. FIX: The main return statement is now safely outside the function above
  return (
    <div className="product-detail-container">
      {/* Left Column: Image */}
      <div className="detail-image-box">
        <img src={product.image} alt={product.name} />
      </div>

      {/* Right Column: Info & Actions */}
      <div className="detail-info-box">
        <h1 className="detail-title">{product.name}</h1>
        <p className="detail-price">{product.price}</p>
        
        <div className="detail-description">
          <p>Super soft, breathable, and perfect for everyday little adventures. Made with premium materials to keep your little one comfortable all day long.</p>
        </div>

        {/* Size Selector */}
        <div className="size-selector">
          <h4>Select Size</h4>
          <div className="size-buttons">
            {['0-3M', '3-6M', '6-12M', '1-2Y'].map((size) => (
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

        {/* 3. FIX: Cleaned up the button to just call our function */}
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>

      {/* 4. FIX: Added the actual Toast UI at the bottom so it has something to show! */}
      <div className={`toast-notification ${showToast ? 'show' : ''}`}>
        <span className="toast-icon">✓</span>
        <p>{product.name} ({selectedSize}) added to cart!</p>
      </div>
    </div>
  );
};

export default ProductDetail;