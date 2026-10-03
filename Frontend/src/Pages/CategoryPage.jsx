import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../Components/ProductGrid.css'; // Reusing the product grid styling!
import './CategoryPage.css';
import { API } from '../config';

const CategoryPage = () => {
  // Grab the category name from the URL (e.g., /category/frocks)
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Clean up the URL text for the header (e.g., 'co-ord-sets' -> 'CO ORD SETS')
  const formattedTitle = categoryName.replace(/-/g, ' ').toUpperCase();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API}/api/products?category=${categoryName}`);
        const data = await response.json();
        if (data.status === 200) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching category products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]); // re-fetch whenever the URL category changes

  return (
    <div className="category-page">
      {/* Page Banner */}
      <div className="category-banner">
        <h1>{formattedTitle}</h1>
        <p>Explore our premium collection designed for everyday little adventures.</p>
      </div>

      <div className="product-section">
        {loading ? (
          <div className="product-grid">
            {[...Array(3)].map((_, i) => (
              <div className="product-card-skeleton" key={i}>
                <div className="skeleton" style={{ height: '350px', marginBottom: '15px' }}></div>
                <div className="skeleton" style={{ height: '16px', width: '70%', marginBottom: '8px' }}></div>
                <div className="skeleton" style={{ height: '14px', width: '40%' }}></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>No products found in this category yet.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }} key={product.id}>
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
    </div>
  );
};

export default CategoryPage;
