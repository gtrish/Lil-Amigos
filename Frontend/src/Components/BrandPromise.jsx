import React from 'react';
import './BrandPromise.css';

const BrandPromise = () => {
  return (
    <div className="promise-section">
      <h2 className="promise-title">Lil Amigos Co.</h2>
      
      <div className="promise-intro">
        <p>Lil Amigo's is born from love, care and the little moments that matter the most.</p>
        <p>Thoughtfully designed for your little ones, with comfort in every detail.</p>
      </div>

      <h3 className="promise-subtitle">Our Promise</h3>
      
      <ul className="promise-list">
        <li>
          <span className="promise-icon"> ♡</span> 
          <strong>Made with Love :</strong> Because your little ones deserve the best
        </li>
        <li>
          <span className="promise-icon">🌿</span> 
          <strong>Gentle on Skin :</strong> Soft, Breathable and baby-friendly
        </li>
        <li>
          <span className="promise-icon">☆</span> 
          <strong>Thoughtful designs :</strong> Cute, timeless & made for everyday adventures
        </li>
        <li>
          <span className="promise-icon">✓</span> 
          <strong>Mom-approved :</strong> Trusted quality for your peace of mind
        </li>
      </ul>
    </div>
  );
};

export default BrandPromise;