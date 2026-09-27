import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CONFETTI_ITEMS = [
  { emoji: '🎉', left: '10%', delay: '0s', dur: '3.2s' },
  { emoji: '⚡', left: '25%', delay: '0.4s', dur: '2.8s' },
  { emoji: '♥', left: '40%', delay: '0.2s', dur: '3.5s' },
  { emoji: '🚀', left: '55%', delay: '0.6s', dur: '3.0s' },
  { emoji: '✨', left: '70%', delay: '0.1s', dur: '3.3s' },
  { emoji: '🦀', left: '85%', delay: '0.5s', dur: '2.9s' },
  { emoji: '💜', left: '95%', delay: '0.3s', dur: '3.6s' }
];

const MatchOverlay = ({ match, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const target = match.targetUser || (match.user2?._id === user?._id ? match.user1 : match.user2) || {};

  const handleStartChat = () => {
    onClose();
    navigate(`/app/messages?matchId=${match._id}`);
  };

  return (
    <div 
      className="fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8, 13, 26, 0.92)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Falling Confetti & Particles */}
      {CONFETTI_ITEMS.map((c, i) => (
        <div 
          key={i}
          style={{
            position: 'absolute',
            top: '-30px',
            left: c.left,
            fontSize: '32px',
            animation: `confettiFall ${c.dur} infinite linear`,
            animationDelay: c.delay,
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          {c.emoji}
        </div>
      ))}

      {/* Ambient Central Merge Glow */}
      <div 
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.35) 0%, rgba(139, 92, 246, 0.2) 45%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'pulseGlow 3s infinite',
          pointerEvents: 'none',
          zIndex: 0
        }} 
      />

      <div className="modal-spring-in" style={{ position: 'relative', zIndex: 10, maxWidth: '520px', width: '100%' }}>
        {/* Animated Headline */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '100px', background: 'rgba(244, 63, 94, 0.18)', border: '1px solid var(--rose)', color: 'var(--rose)', fontSize: '14px', fontWeight: '800', marginBottom: '20px', boxShadow: 'var(--shadow-glow)' }}>
          <span>🚀</span> GIT MERGE SUCCESSFUL
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 6vw, 54px)', fontWeight: '800', lineHeight: 1.1, marginBottom: '14px', letterSpacing: '-0.03em' }}>
          It's a <span className="grad-mix">Clean Merge!</span>
        </h1>

        <p style={{ color: '#cbd5e1', fontSize: '16.5px', marginBottom: '40px', lineHeight: 1.6 }}>
          You and <strong style={{ color: 'white' }}>{target.name}</strong> liked each other's developer profiles. 0 merge conflicts detected!
        </p>

        {/* Floating Developer Avatars */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '44px' }}>
          <div 
            style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              background: 'var(--bg2)', 
              border: '3px solid var(--rose)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '52px',
              boxShadow: '0 8px 30px rgba(244, 63, 94, 0.4)',
              animation: 'floatAnim 3.5s infinite'
            }}
          >
            {user?.emoji || '👨‍💻'}
          </div>

          <div style={{ fontSize: '36px', color: 'var(--rose)', animation: 'heartpop 1.8s infinite', display: 'inline-block' }}>
            ♥
          </div>

          <div 
            style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              background: 'var(--bg2)', 
              border: '3px solid var(--cyan)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '52px',
              boxShadow: '0 8px 30px rgba(6, 182, 212, 0.4)',
              animation: 'floatAnim 3.5s infinite',
              animationDelay: '1.75s'
            }}
          >
            {target.emoji || '👩‍💻'}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '360px', margin: '0 auto' }}>
          <button 
            type="button" 
            className="btn btn-rose btn-lg" 
            onClick={handleStartChat}
            style={{ fontSize: '17px', padding: '16px' }}
          >
            💬 Open Chat & Pair Up →
          </button>
          <button 
            type="button" 
            className="btn btn-ghost" 
            onClick={onClose}
            style={{ color: '#94a3b8' }}
          >
            Keep Exploring
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchOverlay;
