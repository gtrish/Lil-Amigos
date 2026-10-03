import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { API } from '../config';
import './Checkout.css'; 

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [placed, setPlaced] = useState(null); // { orderId, total } once the order is saved

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price.replace('₹', ''));
      return total + price;
    }, 0);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      // We send only which products and sizes were chosen. The server works out
      // the prices and total itself, so they can't be changed from the browser.
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: cartItems.map((item) => ({ id: item.id, size: item.size })),
        }),
      });
      const data = await res.json();
      if (res.ok && data.status === 200) {
        setPlaced({ orderId: data.orderId, total: data.total });
        clearCart();
      } else {
        setError(data.message || 'Could not place your order. Please try again.');
      }
    } catch {
      setError('Cannot reach the shop right now. Please check your connection and try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (placed) {
    return (
      <div className="checkout-done">
        <h2>Thank you! Your order is placed.</h2>
        <p>Order number #{placed.orderId} · Total ₹{Number(placed.total).toFixed(2)}</p>
        <p>We have your details and will be in touch about delivery.</p>
        <Link to="/" className="place-order-btn">Back to shop</Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-done">
        <h2>Your cart is empty</h2>
        <Link to="/" className="place-order-btn">Browse the shop</Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-form-column">
        <h2>Shipping Details</h2>
        <form onSubmit={handleSubmitOrder}>
          <h3>Contact & Delivery</h3>
          <input type="text" name="name" placeholder="Full Name" required onChange={handleInputChange} />
          <input type="email" name="email" placeholder="Email Address" required onChange={handleInputChange} />
          <input type="text" name="address" placeholder="Shipping Address" required onChange={handleInputChange} />
          <div className="form-row">
            <input type="text" name="city" placeholder="City" required onChange={handleInputChange} />
            <input type="text" name="zip" placeholder="ZIP Code" required onChange={handleInputChange} />
          </div>

          {error && <p className="checkout-error" role="alert">{error}</p>}
          <button type="submit" className="place-order-btn" disabled={placing}>
            {placing ? 'Placing order...' : `Place order (₹${calculateTotal().toFixed(2)})`}
          </button>
        </form>
      </div>

      <div className="checkout-summary-column">
        <h3>Your Order</h3>
        <div className="checkout-items">
          {cartItems.map((item, index) => (
            <div key={index} className="checkout-item-summary-row">
              <p>{item.name} ({item.size})</p>
              <p>₹{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</p>
            </div>
          ))}
        </div>
        <hr />
        <div className="checkout-total-row">
          <h4>Total Amount:</h4>
          <h4>₹{calculateTotal().toFixed(2)}</h4>
        </div>
      </div>
    </div>
  );
};

export default Checkout;