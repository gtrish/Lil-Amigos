import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { newArrivalsData } from '../mockData'; // Reusing our mock data for now
import '../components/ProductGrid.css'; // Reusing the product grid styling!
import './CategoryPage.css';

const CategoryPage = () => {
  // Grab the category name from the URL (e.g., /category/frocks)
  const { categoryName } = useParams();
  
  // Clean up the URL text for the header (e.g., 'co-ord-sets' -> 'CO ORD SETS')
  const formattedTitle = categoryName.replace(/-/g, ' ').toUpperCase();

  return (
    <div className="category-page">
      {/* Page Banner */}
      <div className="category-banner">
        <h1>{formattedTitle}</h1>
        <p>Explore our premium collection designed for everyday little adventures.</p>
      </div>

      {/* Reusing the exact Product Grid structure */}
      <div className="product-section">
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
    </div>
  );
};

export default CategoryPage;