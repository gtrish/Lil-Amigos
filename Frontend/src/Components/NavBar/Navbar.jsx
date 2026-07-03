import React, { useState } from 'react';
import './Navbar.css';
import { useCart } from '../../Context/CartContext.jsx';
import { Link } from 'react-router-dom';
import LoginModal from '../LoginModal.jsx';

const Navbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Track the logged-in user here
  const [currentUser, setCurrentUser] = useState(null);
  
  const { cartItems } = useCart();
   
  return (
    <>
    <nav className="nav-container">
      <div className="nav-logo">
        <h2>Lil Amigos</h2>
      </div>
      <ul className="nav-links">
          <li>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              New Arrivals
            </Link>
          </li>
          <li>
            <Link to="/category/co-ord-sets" style={{ textDecoration: 'none', color: 'inherit' }}>
              Co-ord sets
            </Link>
          </li>
          <li>
            <Link to="/category/nightsuits" style={{ textDecoration: 'none', color: 'inherit' }}>
              Nightsuits
            </Link>
          </li>
          <li>
            <Link to="/category/frocks" style={{ textDecoration: 'none', color: 'inherit' }}>
              Frocks
            </Link>
          </li>
          <li>
            <Link to="/category/accessories" style={{ textDecoration: 'none', color: 'inherit' }}>
              Accessories
            </Link>
          </li>
        </ul>
        
      <div className="nav-actions">
        {/* DESKTOP: Swap the Login button for the User Profile if logged in */}
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Hi, {currentUser.fullName}!</span>
            <button className="login-btn" onClick={() => setCurrentUser(null)}>
              Logout
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={() => setIsLoginModalOpen(true)}>
            Login
          </button>
        )}

        <Link to="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>
           <div className="cart-icon">
            🛒
            <span className="cart-count">{cartItems.length}</span>
            </div>
        </Link>
        
      <div 
          className="mobile-menu-icon" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✖' : '☰'}
        </div>
      </div>
    </nav>

      <div className={`mobile-dropdown ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li onClick={() => setIsMobileMenuOpen(false)}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>New Arrivals</Link>
          </li>
          <li onClick={() => setIsMobileMenuOpen(false)}>
            <Link to="/category/co-ord-sets" style={{ textDecoration: 'none', color: 'inherit' }}>Co-ord sets</Link>
          </li>
          <li onClick={() => setIsMobileMenuOpen(false)}>
            <Link to="/category/nightsuits" style={{ textDecoration: 'none', color: 'inherit' }}>Nightsuits</Link>
          </li>
          <li onClick={() => setIsMobileMenuOpen(false)}>
            <Link to="/category/frocks" style={{ textDecoration: 'none', color: 'inherit' }}>Frocks</Link>
          </li>
          <li onClick={() => setIsMobileMenuOpen(false)}>
            <Link to="/category/accessories" style={{ textDecoration: 'none', color: 'inherit' }}>Accessories</Link>
          </li>
          
          {/* MOBILE: Swap Login/Logout button here too */}
          {currentUser ? (
            <li 
              onClick={() => { setIsMobileMenuOpen(false); setCurrentUser(null); }}
              style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginTop: '10px' }}
            >
              <span style={{ fontWeight: '600', cursor: 'pointer' }}>Logout ({currentUser.fullName})</span>
            </li>
          ) : (
            <li 
              onClick={() => { setIsMobileMenuOpen(false); setIsLoginModalOpen(true); }}
              style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginTop: '10px' }}
            >
              <span style={{ fontWeight: '600', cursor: 'pointer' }}>Login / Sign Up</span>
            </li>
          )}
        </ul>
      </div>

    {/* Catch the user data when the modal successfully logs them in */}
    <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={(userData) => setCurrentUser(userData)}
      />
    </>
  )
}

export default Navbar;