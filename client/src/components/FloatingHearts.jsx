import React, { useState, useEffect } from 'react';

const EMOJI_POOL = ['♥', '💖', '✨', '☕', '⚡', '🦀', '🚀', '💜', '🐱', '💻'];

export default function FloatingHearts() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      // Don't spawn if clicking inside form inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const randomEmoji = EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)];
      const id = Date.now() + Math.random();
      const newParticle = {
        id,
        x: e.clientX,
        y: e.clientY,
        emoji: randomEmoji,
        rot: (Math.random() - 0.5) * 40
      };

      setParticles((prev) => [...prev.slice(-12), newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x - 12,
            top: p.y - 12,
            fontSize: '22px',
            userSelect: 'none',
            pointerEvents: 'none',
            transform: `rotate(${p.rot}deg)`,
            animation: 'floatUpAndFade 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}
