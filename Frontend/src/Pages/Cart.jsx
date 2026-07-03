import React from 'react';
import { useCart } from '../Context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems } = useCart();

  // Helper to turn "₹800" into a real number for math
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const priceNumber = parseInt(item.price.replace('₹', '').replace(',', ''));
      return total + (isNaN(priceNumber) ? 0 : priceNumber);
    }, 0);
  };

  // The "Empty State" UI
  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty!</h2>
        <p>Looks like you haven't added any little adventures yet.</p>
      </div>
    );
  }

  // The Populated Cart UI
  return (
    <div className="cart-page">
      <h2 className="cart-title">Your Cart</h2>
      
      <div className="cart-content">
        <div className="cart-items-list">
          {cartItems.map((item, index) => (
            <div className="cart-item-row" key={index}>
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>Size: {item.size}</p>
              </div>
              <p className="cart-item-price">{item.price}</p>
            </div>
          ))}
        </div>

        <div className="cart-summary-box">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{calculateTotal()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;