import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Auto-detect: use relative URL in production (same Express server), localhost in dev
const API_BASE = import.meta.env.PROD
  ? '/api'
  : 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('devpair_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('devpair_token'));
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('devpair_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('devpair_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/users/me');
          setUser(res.data);
        } catch (err) {
          console.error('Auth verification failed:', err);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('devpair_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const demoLogin = async (email) => {
    const res = await api.post('/auth/demo', { email });
    localStorage.setItem('devpair_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const signup = async (userData) => {
    const res = await api.post('/auth/signup', userData);
    localStorage.setItem('devpair_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('devpair_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await api.put('/users/me', data);
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      theme,
      toggleTheme,
      login, 
      demoLogin, 
      signup, 
      logout, 
      updateProfile, 
      setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
