import React, { useState, useEffect } from 'react';
import './ProductGrid.css';
import { Link } from 'react-router-dom';
import { API } from '../config';

const ProductGrid = () => {
  // 1. Set up the state to hold our database products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch the products from Flask when the page loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API}/api/products`);
        const data = await response.json();
        
        if (data.status === 200) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-section" id="new-arrivals">
      <h2 className="section-title">New Arrivals</h2>

      {loading ? (
        <div className="product-grid">
          {[...Array(6)].map((_, i) => (
            <div className="product-card-skeleton" key={i}>
              <div className="skeleton" style={{ height: '350px', marginBottom: '15px' }}></div>
              <div className="skeleton" style={{ height: '16px', width: '70%', marginBottom: '8px' }}></div>
              <div className="skeleton" style={{ height: '14px', width: '40%' }}></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="product-grid">
          {/* Loop through the real database products instead of mockData */}
          {products.map((product) => (
            <Link
              to={`/product/${product.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              key={product.id}
            >
              <div className="product-card">
                <div className="card-image-box">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="card-details">
                  <p className="product-name">{product.name}</p>
                  <p className="product-price">₹{Number(product.price).toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;