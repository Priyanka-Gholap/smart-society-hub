import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../utils/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('authUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('authToken') || '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authUser');
    }
  }, [user]);

  const saveSession = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
  };

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token: authToken, user: authUser } = response.data;
    saveSession(authToken, authUser);
    return response.data;
  };

  const register = async (data) => {
    const response = await api.post('/auth/register', data);
    const { token: authToken, user: authUser } = response.data;
    saveSession(authToken, authUser);
    return response.data;
  };

  const logout = () => {
    setUser(null);
    setToken('');
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(user), login, register, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
