import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  // FIX 1: Make the math robust so it works with numbers OR strings
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      let priceNumber = 0;
      
      // If it's a raw number from the database:
      if (typeof item.price === 'number') {
        priceNumber = item.price;
      } 
      // If it's a string from old mock data that might still be stuck in local storage:
      else if (typeof item.price === 'string') {
        priceNumber = parseFloat(item.price.replace('₹', '').replace(',', ''));
      }
      
      return total + (isNaN(priceNumber) ? 0 : priceNumber);
    }, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty!</h2>
        <p>Looks like you haven't added any little adventures yet.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title">Your Cart</h2>
      
      <div className="cart-content">
        <div className="cart-items-list">
          {cartItems.map((item, index) => (
            <div className="cart-item-row" key={index}>
              <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>Size: {item.size}</p>
              </div>
              
              {/* FIX 2: Format the raw database number to look like a price */}
              <p className="cart-item-price">
                {typeof item.price === 'number' ? `₹${item.price.toFixed(2)}` : item.price}
              </p>
            </div>
          ))}
        </div>

        <div className="cart-summary-box">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            {/* Added .toFixed(2) to make the total look professional */}
            <span>₹{calculateTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <button className="checkout-btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;