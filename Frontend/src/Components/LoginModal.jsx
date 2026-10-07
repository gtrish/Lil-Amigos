import React, { useState, useEffect } from 'react';
import './LoginModal.css';
import { API } from '../config';
import { useAuth } from '../Context/AuthContext.jsx';

const LoginModal = () => {
  const { modal, closeAuth, login } = useAuth();
  const isOpen = modal.open;
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  // Open on the right tab: "Sign in" opens login, "Sign up" opens sign up.
  useEffect(() => {
    if (isOpen) {
      setIsLoginMode(modal.mode !== 'signup');
      setMessage({ type: '', text: '' });
    }
  }, [isOpen, modal.mode]);

  if (!isOpen) return null;

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage({ type: '', text: '' });
    const endpoint = isLoginMode ? `${API}/api/login` : `${API}/api/signup`;
    const payload = isLoginMode ? { email, password } : { fullName, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.status === 200) {
        if (isLoginMode && result.user) {
          login(result.user);          // remembered across page reloads
          setFullName(''); setEmail(''); setPassword('');
          closeAuth();
        } else {
          // Account created: send them to the sign-in tab
          setIsLoginMode(true);
          setPassword('');
          setMessage({ type: 'ok', text: 'Account created! Please sign in.' });
        }
      } else {
        setMessage({ type: 'error', text: result.message || 'Something went wrong.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Cannot reach the shop right now. Please try again in a moment.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        
        <button className="close-modal-btn" onClick={closeAuth} aria-label="Close">
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

        {message.text && (
          <p role={message.type === 'error' ? 'alert' : 'status'} style={{ color: message.type === 'error' ? '#a63a2a' : 'var(--bg-footer)', marginBottom: '12px', fontWeight: 600 }}>
            {message.text}
          </p>
        )}

        <form className="modal-form" onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" required autoComplete="name"
                placeholder="John Doe" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}
          
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" required autoComplete="email"
              placeholder="hello@lilamigos.co" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" required autoComplete={isLoginMode ? "current-password" : "new-password"}
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="modal-submit-btn" disabled={busy}>
            {busy ? 'Please wait...' : isLoginMode ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <span 
              className="modal-toggle-link" 
              onClick={switchMode}
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