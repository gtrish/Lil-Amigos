import React, { createContext, useState, useContext } from 'react';

// 1. Create the Context
const CartContext = createContext();

// 2. Create a Custom Hook to use the cart easily
export const useCart = () => useContext(CartContext);

// 3. Create the Provider that will wrap your app
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Function to add an item
  const addToCart = (product, size) => {
    setCartItems((prevCart) => [...prevCart, { ...product, size }]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};