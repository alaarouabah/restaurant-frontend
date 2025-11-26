import { createContext, useContext, useState, useEffect } from 'react';
import { setAuthHeader, clearAuthHeader, isAuthenticated as checkAuth } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = checkAuth();
    setIsAuthenticated(auth);
    setLoading(false);
  }, []);

  const login = (username, password) => {
    setAuthHeader(username, password);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuthHeader();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
