import React from 'react';
import './Categories.css';
import { Link } from 'react-router-dom'; // Importing Link for navigation
// Local array for the 4 primary categories
const categoriesData = [
  {
    id: 1,
    name: "NightSuits",
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Co-Ord Sets",
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Frocks",
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=400&auto=format&fit=crop"
  }
];

const Categories = () => {
  return (
    <div className="categories-section">
      <h2 className="categories-title">Explore our Categories</h2>
      
      <div className="categories-grid">
        {categoriesData.map((category) => {
          // Converts "Co-Ord Sets" into "co-ord-sets" for a clean URL
          const urlPath = category.name.toLowerCase().replace(/\s+/g, '-');
          
          return (
            <Link to={`/category/${urlPath}`} style={{ textDecoration: 'none' }} key={category.id}>
              <div className="category-card">
                <div className="category-image-box">
                  <img src={category.image} alt={category.name} />
                </div>
                <p className="category-name">{category.name}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  );
};

export default Categories;