import React from 'react';
import './HeroGallery.css';

const HeroGallery = () => {
  return (
    <div className="hero-container">
      {/* The Grid of 4 Images */}
      <div className="hero-gallery-grid">
        <div className="hero-img-box img1"></div>
        <div className="hero-img-box img2"></div>
        <div className="hero-img-box img3"></div>
        <div className="hero-img-box img4"></div>
      </div>

      {/* The Floating Center Button */}
      <button className="hero-explore-btn">Explore</button>
    </div>
  );
};

export default HeroGallery;