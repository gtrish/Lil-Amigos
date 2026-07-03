import React from 'react';
import './ProductGrid.css';
import { newArrivalsData } from '../mockData'; // Importing our fake database
import { Link } from 'react-router-dom';
const ProductGrid = () => {
  return (
    <div className="product-section">
      <h2 className="section-title">New Arrivals</h2>
      
      <div className="product-grid">
        {newArrivalsData.map((product) => (
           <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }} key={product.id}>
            <div className="product-card">
              <div className="card-image-box">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="card-details">
                <p className="product-name">{product.name}</p>
                <p className="product-price">{product.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;