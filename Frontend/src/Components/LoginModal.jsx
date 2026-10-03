import React, { useState } from 'react';
import './LoginModal.css';
import { API } from '../config';

// Added onLoginSuccess prop
const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Switch the endpoint based on the mode
    const endpoint = isLoginMode 
      ? `${API}/api/login` 
      : `${API}/api/signup`;
      
    const payload = isLoginMode 
      ? { email, password } 
      : { fullName, email, password };
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (result.status === 200) {
        if (isLoginMode && result.user) {
          // Send data to Navbar!
          onLoginSuccess(result.user);
        } else {
          // Keep the success alert for signups
          alert(result.message); 
        }
        
        // Clear the form and close
        setFullName('');
        setEmail('');
        setPassword('');
        onClose();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
      alert("Make sure your Flask server is running!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        
        <button className="close-modal-btn" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="modal-title">
          {isLoginMode ? 'Welcome Back' : 'Join the Family'}
        </h2>
        <p className="modal-subtitle">
          {isLoginMode 
            ? 'Sign in to access your little adventures.' 
            : 'Create an account for faster checkout.'}
        </p>

        <form className="modal-form" onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}
          
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="hello@lilamigos.co" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="modal-submit-btn">
            {isLoginMode ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <span 
              className="modal-toggle-link" 
              onClick={() => setIsLoginMode(!isLoginMode)}
            >
              {isLoginMode ? 'Sign up' : 'Log in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;