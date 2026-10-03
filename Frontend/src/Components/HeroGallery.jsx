import React from 'react';
import './HeroGallery.css';

const heroImages = [
  { src: '/images/image 48.png', alt: 'Two children wearing matching Lil Amigos nightsuits, asleep in bed' },
  { src: '/images/image 49.png', alt: 'Lil Amigos co-ord set styled on a child' },
  { src: '/images/image 50.png', alt: 'Lil Amigos frock detail' },
  { src: '/images/image 51.png', alt: 'Lil Amigos accessories laid out' },
];

const HeroGallery = () => {
  const scrollToProducts = () => {
    document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="hero-container">
      {/* The Grid of 4 Images */}
      <div className="hero-gallery-grid">
        {heroImages.map((img, i) => (
          <div className="hero-img-box" key={i}>
            <img src={img.src} alt={img.alt} />
          </div>
        ))}
      </div>

      {/* The Floating Center Button */}
      <button className="hero-explore-btn" onClick={scrollToProducts}>Explore</button>
    </div>
  );
};

export default HeroGallery;