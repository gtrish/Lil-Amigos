import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const KEY = 'lilamigos_user';

// Only non-sensitive details are remembered (name, email, id). The password
// is never stored in the browser.
const loadUser = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return saved && saved.fullName ? saved : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadUser);
  const [modal, setModal] = useState({ open: false, mode: 'login' });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(KEY, JSON.stringify(user));
      else localStorage.removeItem(KEY);
    } catch { /* private browsing: ignore */ }
  }, [user]);

  const openAuth = (mode = 'login') => setModal({ open: true, mode });
  const closeAuth = () => setModal((m) => ({ ...m, open: false }));

  return (
    <AuthContext.Provider value={{ user, login: setUser, logout: () => setUser(null), modal, openAuth, closeAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
