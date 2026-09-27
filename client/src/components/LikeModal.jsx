import React, { useState } from 'react';

const DEV_FLIRTS = {
  git: [
    "Are you a git commit? Because you just started something special.",
    "0 merge conflicts detected between our hearts.",
    "Can I git cherry-pick you for my future?",
    "You're the master branch of my life."
  ],
  frontend: [
    "Are you CSS flexbox? Because you align my items perfectly.",
    "You bring 60FPS smoothness to my day.",
    "My heart just triggered an unthrottled re-render.",
    "You're more beautiful than a perfect design system."
  ],
  backend: [
    "You must be async, because you're always on my mind without blocking.",
    "My database has indexed you as primary key.",
    "Our connection latency is 0ms.",
    "You satisfy all my ACID transactions."
  ],
  ai: [
    "Are you PyTorch? Because you backpropagate joy into my life.",
    "Our synergy score is at global minimum loss.",
    "My neural weights are 100% fine-tuned for you.",
    "You're the AGI my heart has been predicting."
  ],
  cozy: [
    "Coffee, pair programming, and good vibes? ☕",
    "I'll write the unit tests if you write the code ♥",
    "Let's build a side project and see where it goes.",
    "Tabs or spaces? Let's debate over dinner."
  ]
};

const LikeModal = ({ target, section, onSend, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('git');
  const [comment, setComment] = useState('');

  const getSectionTitle = () => {
    switch (section) {
      case 'bio': return 'their Bio';
      case 'tech': return 'their Tech Stack';
      case 'github': return 'their GitHub Activity';
      case 'leetcode': return 'their LeetCode Stats';
      case 'prompt1': return 'their Prompt';
      case 'prompt2': return 'their Prompt';
      case 'interests': return 'their Interests';
      case 'super': return 'their entire Profile ⭐';
      default: return 'their Profile ♥';
    }
  };

  return (
    <div 
      className="fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8, 13, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }} 
      onClick={onClose}
    >
      <div 
        className="modal-spring-in"
        style={{
          background: 'var(--bg1)',
          width: '100%',
          maxWidth: '520px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--brd2)',
          padding: '30px 26px',
          boxShadow: 'var(--shadow-lg)'
        }} 
        onClick={e => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '56px', marginBottom: '8px', animation: 'floatAnim 3s infinite', display: 'inline-block' }}>
            {target.emoji || '👨‍💻'}
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>
            Like {target.name}'s {getSectionTitle()}
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--t3)' }}>
            Pick a witty developer flirt or write a custom note to stand out!
          </p>
        </div>

        {/* Flirt Category Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'git', label: '🐙 Git' },
            { id: 'frontend', label: '🎨 UI/CSS' },
            { id: 'backend', label: '⚡ Backend' },
            { id: 'ai', label: '🧠 AI/ML' },
            { id: 'cozy', label: '☕ Cozy' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`btn btn-sm ${activeCategory === tab.id ? 'btn-rose' : 'btn-ghost'}`}
              style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '100px' }}
              onClick={() => setActiveCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Flirts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '16px' }}>
          {DEV_FLIRTS[activeCategory].map((text, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-ghost"
              style={{ 
                justifyContent: 'flex-start', 
                fontSize: '12.5px', 
                padding: '9px 14px', 
                textAlign: 'left', 
                borderRadius: '10px',
                lineHeight: 1.4,
                border: comment === text ? '1px solid var(--rose)' : '1px solid var(--brd)',
                background: comment === text ? 'rgba(244, 63, 94, 0.08)' : 'var(--bg2)'
              }}
              onClick={() => setComment(text)}
            >
              💬 {text}
            </button>
          ))}
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <textarea 
            className="form-input" 
            rows="2" 
            placeholder="Or write a custom note... (optional)" 
            value={comment} 
            onChange={e => setComment(e.target.value)} 
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-rose" 
            style={{ flex: 2 }} 
            onClick={() => onSend(comment)}
          >
            Send Like & Flirt ♥
          </button>
        </div>
      </div>
    </div>
  );
};

export default LikeModal;
