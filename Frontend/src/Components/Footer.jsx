import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/#new-arrivals">New Arrivals</Link></li>
            {/* Track Order and Returns Policy aren't real pages yet — left as
                plain text rather than a link that goes nowhere. Once those
                pages exist, wrap them in <Link> the same way as above. */}
            <li className="footer-link-pending">Track Order</li>
            <li className="footer-link-pending">Returns Policy</li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>Contact Address</h4>
          <p>Lil Amigos Co. Studio</p>
          <p>hello@lilamigos.co</p>
          <p>+91 98765 43210</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-logo-box">
          <h3>Lil Amigos Co.</h3>
        </div>
        <p className="footer-copyright">© 2026 Lil Amigos Co. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;