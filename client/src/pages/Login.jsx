import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMO_USERS = [
  { name: 'Tanmay Chouhan', email: 'tanmaychoouhantc@gmail.com', role: 'Full-Stack & Security', emoji: '👨‍💻' },
  { name: 'Yug Shah', email: 'yugshah197@gmail.com', role: 'Full-Stack & Algorithms', emoji: '🏴‍☠️' }
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/app/discover');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSelect = async (demoEmail) => {
    setError('');
    setIsLoading(true);
    try {
      await demoLogin(demoEmail);
      navigate('/app/discover');
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '24px' }}>
      <div className="glass-panel slide-up" style={{ width: '100%', maxWidth: '440px', padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" className="nav-brand" style={{ display: 'inline-flex', marginBottom: '8px' }}>
            <span style={{ color: 'var(--rose)', fontSize: '24px', animation: 'heartpop 2s infinite', display: 'inline-block' }}>♥</span>
            <span className="grad-rose">isITlove</span>
          </Link>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Welcome Back</h2>
          <p style={{ fontSize: '14px', color: 'var(--t3)' }}>Sign in to continue pairing</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '18px', fontSize: '13px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* 1-Click Demo Profiles */}
        <div style={{ marginBottom: '24px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--brd)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--cyanl)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚡</span> Quick Demo Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {DEMO_USERS.map((d) => (
              <button
                key={d.email}
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: '12px', padding: '8px 10px', justifyContent: 'flex-start', textAlign: 'left', borderRadius: '8px' }}
                onClick={() => handleDemoSelect(d.email)}
                disabled={isLoading}
              >
                <span style={{ fontSize: '16px' }}>{d.emoji}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--brd)' }}></div>
          <span style={{ fontSize: '12px', color: 'var(--t4)', textTransform: 'uppercase' }}>or with credentials</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--brd)' }}></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="you@example.dev"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-rose btn-lg" 
            style={{ width: '100%', marginTop: '8px' }} 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '22px', color: 'var(--t4)', fontSize: '13.5px' }}>
          Don't have a profile?{' '}
          <Link to="/signup" style={{ color: 'var(--rosel)', fontWeight: '600' }}>
            Create one (git init)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
