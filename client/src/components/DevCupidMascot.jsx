import React, { useState } from 'react';
import { soundFX } from '../utils/audio';

const CUPID_MESSAGES = [
  "Meow! You look 100% bug-free today! 🐾💖",
  "*purrs in Python* You deserve someone who reviews your PRs with love! ☕",
  "Don't worry, your perfect coding soulmate is compiling right now! ✨",
  "Sending you a warm virtual boba! 🧋💕",
  "Tabs or spaces? I vote for warm hugs! 🧸🎀",
  "0 merge conflicts detected in your future romance! 🚀♥",
  "You + Your Match = Infinite Loop of Happiness! 🌸🐱",
  "Remember to hydrate and take breaks between commits! 🍓💧"
];

const MASCOT_EMOJIS = ['🐱', '😸', '😻', '😽', '🦊', '🐼', '🐰'];

export default function DevCupidMascot() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMsg, setCurrentMsg] = useState(CUPID_MESSAGES[0]);
  const [mascotEmoji, setMascotEmoji] = useState('🐱');
  const [wiggling, setWiggling] = useState(false);

  const handleClick = () => {
    soundFX.playSuperLike();
    setWiggling(true);
    setTimeout(() => setWiggling(false), 500);

    const randomMsg = CUPID_MESSAGES[Math.floor(Math.random() * CUPID_MESSAGES.length)];
    const randomEmoji = MASCOT_EMOJIS[Math.floor(Math.random() * MASCOT_EMOJIS.length)];
    setCurrentMsg(randomMsg);
    setMascotEmoji(randomEmoji);
    setIsOpen(true);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 900, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      {/* Speech Bubble */}
      {isOpen && (
        <div 
          className="modal-spring-in"
          style={{
            marginBottom: '10px',
            background: 'var(--bg1)',
            border: '2px solid var(--rose)',
            padding: '12px 18px',
            borderRadius: '18px 18px 4px 18px',
            boxShadow: '0 8px 30px rgba(244, 63, 94, 0.25)',
            maxWidth: '240px',
            fontSize: '13px',
            fontWeight: '700',
            color: 'var(--t1)',
            lineHeight: 1.45,
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--rose)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '800' }}>
              🐾 isITlove Cupid
            </span>
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'var(--t3)', padding: 0 }}
            >
              ✕
            </button>
          </div>
          <div>{currentMsg}</div>
        </div>
      )}

      {/* Mascot Bubble Button */}
      <button
        type="button"
        onClick={handleClick}
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #e11d48 100%)',
          border: '3px solid white',
          boxShadow: '0 8px 24px rgba(244, 63, 94, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          cursor: 'pointer',
          outline: 'none',
          userSelect: 'none',
          transform: wiggling ? 'scale(1.25) rotate(15deg)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          animation: 'cuteFloat 3s ease-in-out infinite'
        }}
        title="Click DevCupid for love & encouragement! 🐾"
      >
        <span>{mascotEmoji}</span>
      </button>
    </div>
  );
}
