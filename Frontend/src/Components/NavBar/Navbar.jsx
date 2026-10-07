import React, { useState } from 'react';
import './Navbar.css';
import { useCart } from '../../Context/CartContext.jsx';
import { useAuth } from '../../Context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import LoginModal from '../LoginModal.jsx';

const NAV_LINKS = [
  { to: '/', label: 'New Arrivals' },
  { to: '/category/co-ord-sets', label: 'Co-ord sets' },
  { to: '/category/nightsuits', label: 'Nightsuits' },
  { to: '/category/frocks', label: 'Frocks' },
  { to: '/category/accessories', label: 'Accessories' },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { user, logout, openAuth } = useAuth();
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <h2>Lil Amigos</h2>
        </Link>

        <ul className="nav-links">
          {NAV_LINKS.map((l) => (
            <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
          ))}
        </ul>

        <div className="nav-actions">
          {/* Desktop only. On phones these live inside the menu. */}
          <div className="nav-auth">
            {user ? (
              <button className="login-btn" onClick={logout}>Log out</button>
            ) : (
              <>
                <button className="auth-link" onClick={() => openAuth('login')}>Sign in</button>
                <button className="login-btn" onClick={() => openAuth('signup')}>Sign up</button>
              </>
            )}
          </div>

          <Link to="/cart" className="cart-link" aria-label={`Cart, ${cartItems.length} items`} onClick={closeMenu}>
            <div className="cart-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="cart-count">{cartItems.length}</span>
            </div>
          </Link>

          <button
            className="mobile-menu-icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <div className={`mobile-dropdown ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          {NAV_LINKS.map((l) => (
            <li key={l.to}><Link to={l.to} onClick={closeMenu}>{l.label}</Link></li>
          ))}
          {user ? (
            <li className="mobile-auth-row">
              <button onClick={() => { closeMenu(); logout(); }}>Log out</button>
            </li>
          ) : (
            <li className="mobile-auth-row">
              <button onClick={() => { closeMenu(); openAuth('login'); }}>Sign in</button>
              <button className="mobile-signup" onClick={() => { closeMenu(); openAuth('signup'); }}>Sign up</button>
            </li>
          )}
        </ul>
      </div>

      <LoginModal />
    </header>
  );
};

export default Navbar;
