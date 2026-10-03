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
          <span className="promise-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </span>
          <strong>Made with Love :</strong> Because your little ones deserve the best
        </li>
        <li>
          <span className="promise-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 4 13V8a4 4 0 0 1 4-4h5a7 7 0 0 1 7 7v1a8 8 0 0 1-8 8z" />
              <path d="M11 20v-9a4 4 0 0 1 4-4" />
            </svg>
          </span>
          <strong>Gentle on Skin :</strong> Soft, Breathable and baby-friendly
        </li>
        <li>
          <span className="promise-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </span>
          <strong>Thoughtful designs :</strong> Cute, timeless & made for everyday adventures
        </li>
        <li>
          <span className="promise-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <strong>Mom-approved :</strong> Trusted quality for your peace of mind
        </li>
      </ul>
    </div>
  );
};

export default BrandPromise;