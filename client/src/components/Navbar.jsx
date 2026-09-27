import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../utils/audio';
import FloatingHearts from './FloatingHearts';
import DevCupidMascot from './DevCupidMascot';

const Navbar = () => {
  const { user, theme, toggleTheme } = useAuth();
  const [isMuted, setIsMuted] = useState(soundFX.isMuted());

  const handleToggleAudio = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundFX.playLike();
    }
  };

  return (
    <>
      <FloatingHearts />
      <DevCupidMascot />
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      <nav className="navbar">
        <Link to="/app/discover" className="nav-brand">
          <span style={{ color: 'var(--rose)', fontSize: '24px', animation: 'heartpop 2.2s infinite', display: 'inline-block' }}>♥</span>
          <span className="grad-rose">isITlove</span>
          <span style={{ fontSize: '11px', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--rose)', border: '1px solid rgba(244, 63, 94, 0.25)', padding: '2px 8px', borderRadius: '100px', fontWeight: '700', marginLeft: '4px' }}>
            romantic v2
          </span>
        </Link>

        <div className="nav-links">
          <NavLink to="/app/discover" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span>🔍</span> Discover
          </NavLink>
          <NavLink to="/app/matches" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span>💜</span> Matches
          </NavLink>
          <NavLink to="/app/messages" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span>💬</span> Messages
          </NavLink>
          <NavLink to="/app/leaderboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span>🏆</span> Leaderboard
          </NavLink>
        </div>

        <div className="nav-user">
          {/* Sound Synthesizer Toggle */}
          <button 
            type="button" 
            className="theme-toggle-btn" 
            onClick={handleToggleAudio} 
            title={isMuted ? "Unmute Romantic Chimes 🔊" : "Mute Sound Effects 🔇"}
            aria-label="Toggle Sound Effects"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Theme Mode Toggle */}
          <button 
            type="button" 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* User Profile Avatar with Online Beacon */}
          <Link to="/app/profile" className="avatar-sm" title={user?.name || 'Profile'} style={{ position: 'relative' }}>
            {user?.emoji || '👨‍💻'}
            <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--green)', border: '2px solid var(--bg1)' }}></span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
