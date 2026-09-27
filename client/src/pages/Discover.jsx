import React, { useState, useEffect, useCallback } from 'react';
import { api, useAuth } from '../context/AuthContext';
import { soundFX } from '../utils/audio';
import LikeModal from '../components/LikeModal';
import MatchOverlay from '../components/MatchOverlay';

const DEV_FORTUNES = [
  "Today's forecast: 100% chance of clean merges and warm coffee ☕🐾",
  "Your pull request to love has 0 merge conflicts today ✨💖",
  "Someone out there writes unit tests just the way you like them 🌸♥",
  "A high-synergy developer is within 10km of your heart 🚀🧸",
  "Your code is clean, your tests pass, and love is compiling smoothly 🍓💜"
];

const LOVE_LANGUAGES = [
  "Pair Programming Over Coffee ☕🐾",
  "Writing Clean TypeScript Types ⚡💖",
  "Spamming GitHub Reaction Emojis 🎉✨",
  "Late Night Debugging Sessions 🌙🧸",
  "Reviewing PRs with Compliments 🌸♥"
];

const CUTE_TREATS = ['🧋 Virtual Boba', '☕ Warm Latte', '🍓 Sweet Strawberry', '🍩 Fresh Donut', '🍪 Cookie Batch'];

export default function Discover() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likeModalSection, setLikeModalSection] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null); // 'liked' | 'passed' | 'super'
  const [swipeClass, setSwipeClass] = useState('');
  const [dailyFortune] = useState(() => DEV_FORTUNES[Math.floor(Math.random() * DEV_FORTUNES.length)]);
  const [treatSent, setTreatSent] = useState(null);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/discover');
      setProfiles(res.data);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Failed to fetch discover profiles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handlePass = useCallback(async () => {
    if (!profiles[currentIndex] || swipeClass) return;
    const target = profiles[currentIndex];
    
    soundFX.playPass();
    setActionFeedback('passed');
    setSwipeClass('swipe-left');

    setTimeout(() => {
      setCurrentIndex(i => i + 1);
      setSwipeClass('');
      setActionFeedback(null);
    }, 280);

    try {
      await api.post('/users/pass', { targetId: target._id });
    } catch (err) {
      console.error('Pass error:', err);
    }
  }, [profiles, currentIndex, swipeClass]);

  const handleLike = useCallback(async (section = 'profile', comment = '') => {
    if (!profiles[currentIndex] || swipeClass) return;
    const target = profiles[currentIndex];

    const isSuper = section === 'super';
    if (isSuper) {
      soundFX.playSuperLike();
    } else {
      soundFX.playLike();
    }

    setActionFeedback(isSuper ? 'super' : 'liked');
    setSwipeClass(isSuper ? 'swipe-up' : 'swipe-right');

    try {
      const res = await api.post('/matches/like', { 
        targetId: target._id,
        section,
        comment
      });

      setTimeout(() => {
        if (res.data.matched) {
          soundFX.playMatch();
          setMatchData({
            ...res.data.match,
            targetUser: target
          });
        } else {
          setCurrentIndex(i => i + 1);
        }
        setSwipeClass('');
        setActionFeedback(null);
      }, 280);
    } catch (err) {
      console.error('Like error:', err);
      setTimeout(() => {
        setCurrentIndex(i => i + 1);
        setSwipeClass('');
        setActionFeedback(null);
      }, 280);
    }
    setLikeModalSection(null);
  }, [profiles, currentIndex, swipeClass]);

  const handleSendTreat = (treat) => {
    soundFX.playSuperLike();
    setTreatSent(treat);
    setTimeout(() => setTreatSent(null), 1800);
  };

  const handleResetFeed = async () => {
    try {
      await api.post('/users/reset-discover');
      await fetchProfiles();
    } catch (err) {
      console.error('Reset feed error:', err);
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (likeModalSection || matchData) return;
      if (e.key === 'ArrowLeft') {
        handlePass();
      } else if (e.key === 'ArrowRight') {
        handleLike('profile');
      } else if (e.key === ' ') {
        e.preventDefault();
        setLikeModalSection('super');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePass, handleLike, likeModalSection, matchData]);

  if (loading) {
    return (
      <div className="discover-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <div style={{ fontSize: '56px', animation: 'cuteFloat 2s infinite', marginBottom: '16px', display: 'inline-block' }}>🐱💖</div>
        <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Scanning for Cute Soulmates...</h3>
        <p style={{ color: 'var(--t3)', fontSize: '14.5px' }}>Computing tech stack synergy and love languages ☕✨</p>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="discover-container" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <div className="glass-panel spring-in" style={{ padding: '48px 28px' }}>
          <div style={{ fontSize: '64px', marginBottom: '18px', animation: 'cuteFloat 3s infinite' }}>💌🐾</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>You've seen all cuties today!</h2>
          <p style={{ color: 'var(--t3)', fontSize: '15px', maxWidth: '380px', margin: '0 auto 30px', lineHeight: 1.6 }}>
            Great job exploring. Check your Matches tab to chat with developers who merged back with you!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '300px', margin: '0 auto' }}>
            <button type="button" className="btn btn-rose btn-lg" onClick={handleResetFeed}>
              🔄 Reset Feed & Explore Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const profile = profiles[currentIndex];
  const compat = profile.compatScore || 88;
  const assignedLoveLanguage = LOVE_LANGUAGES[currentIndex % LOVE_LANGUAGES.length];

  return (
    <div className="discover-container">
      {matchData && (
        <MatchOverlay 
          match={matchData} 
          onClose={() => { 
            setMatchData(null); 
            setCurrentIndex(i => i + 1); 
          }} 
        />
      )}

      {likeModalSection && (
        <LikeModal 
          target={profile} 
          section={likeModalSection} 
          onSend={(comment) => handleLike(likeModalSection, comment)} 
          onClose={() => setLikeModalSection(null)} 
        />
      )}

      {/* Romantic Daily Fortune Banner */}
      <div 
        className="slide-up"
        style={{
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.09) 0%, rgba(139, 92, 246, 0.09) 100%)',
          border: '1px solid var(--brd)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '12.5px',
          color: 'var(--t2)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <span style={{ fontSize: '18px', animation: 'heartpop 2s infinite', display: 'inline-block' }}>🐾</span>
        <span><strong>Pairing Fortune:</strong> {dailyFortune}</span>
      </div>

      {/* Keyboard Shortcut Hint Pill */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px', fontSize: '12px', color: 'var(--t3)', fontFamily: 'var(--mono)', fontWeight: '600' }}>
        <span style={{ background: 'var(--card)', padding: '4px 12px', borderRadius: '100px', border: '1px solid var(--brd)' }}>← [Left] Pass ✕</span>
        <span style={{ background: 'var(--card)', padding: '4px 12px', borderRadius: '100px', border: '1px solid var(--brd)' }}>Space [Super] ⭐</span>
        <span style={{ background: 'var(--card)', padding: '4px 12px', borderRadius: '100px', border: '1px solid var(--brd)' }}>→ [Right] Like ♥</span>
      </div>

      {/* Profile Card with Physical Swipe Gestures & Spring-In Entrance */}
      <div 
        className={`profile-card ${swipeClass || 'spring-in'}`} 
        key={profile._id}
        style={{ willChange: 'transform, opacity', position: 'relative' }}
      >
        {/* Cute Treat Floating Celebration */}
        {treatSent && (
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 40,
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '16px 28px',
              borderRadius: '100px',
              border: '2px solid var(--rose)',
              boxShadow: '0 12px 40px rgba(244, 63, 94, 0.5)',
              color: 'var(--rose)',
              fontSize: '18px',
              fontWeight: '800',
              animation: 'springIn 0.3s ease forwards'
            }}
          >
            Sent {treatSent} to {profile.name}! 💖🐾
          </div>
        )}

        {actionFeedback && (
          <div 
            style={{
              position: 'absolute',
              top: '24px',
              right: actionFeedback === 'passed' ? 'auto' : '24px',
              left: actionFeedback === 'passed' ? '24px' : 'auto',
              zIndex: 30,
              padding: '10px 24px',
              borderRadius: '100px',
              fontSize: '18px',
              fontWeight: '800',
              fontFamily: 'var(--mono)',
              border: '2px solid',
              borderColor: actionFeedback === 'passed' ? 'var(--red)' : 'var(--rose)',
              color: actionFeedback === 'passed' ? 'var(--red)' : 'white',
              background: actionFeedback === 'passed' ? 'rgba(239, 68, 68, 0.18)' : 'var(--rose)',
              transform: actionFeedback === 'passed' ? 'rotate(-12deg) scale(1.1)' : 'rotate(12deg) scale(1.1)',
              animation: 'fadeIn 0.18s ease forwards',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            {actionFeedback === 'passed' ? 'PASS ✕' : actionFeedback === 'super' ? 'SUPER MERGE ⭐' : 'MERGE ♥'}
          </div>
        )}

        <div className="card-hero">
          <div className="card-avatar" style={{ animation: 'cuteFloat 3.5s ease-in-out infinite' }}>
            {profile.emoji || '👨‍💻'}
          </div>
          <div className="card-hero-info">
            <h2>
              {profile.name}, {profile.age || 25}
              <span style={{ color: 'var(--cyan)', fontSize: '20px', marginLeft: '6px' }} title="Verified Developer">✓</span>
            </h2>
            <p>
              {profile.role || 'Software Engineer'} {profile.company ? `at ${profile.company}` : ''}
              {profile.location ? ` • ${profile.location}` : ''}
            </p>
          </div>
        </div>

        {/* Compatibility & Dev Chemistry Verdict Bar */}
        <div className="compat-bar" style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '10px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ animation: 'heartpop 2s infinite', display: 'inline-block' }}>💖</span>
            <span>{compat}% Tech Chemistry & Git Synergy</span>
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--t3)', fontWeight: '600' }}>
            Verdict: Fast-Forward Ready • 0 Merge Conflicts 🐾
          </div>
        </div>

        {/* Send a Cute Virtual Treat Row */}
        <div style={{ padding: '10px 18px', background: 'var(--bg2)', borderBottom: '1px solid var(--brd)', display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
          <span style={{ fontSize: '11px', color: 'var(--t3)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
            Send treat:
          </span>
          {CUTE_TREATS.map((t, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ padding: '4px 10px', fontSize: '11.5px', borderRadius: '100px', whiteSpace: 'nowrap' }}
              onClick={() => handleSendTreat(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Card Body */}
        <div className="card-content">
          {/* Dev Love Language Badge */}
          <div className="card-section" style={{ background: 'rgba(244, 63, 94, 0.04)', borderColor: 'rgba(244, 63, 94, 0.2)' }}>
            <h3>Love Language in Code</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14.5px', fontWeight: '700', color: 'var(--rose)' }}>
              <span>♥</span> {assignedLoveLanguage}
            </div>
            <button 
              type="button" 
              className="section-like-btn" 
              onClick={() => setLikeModalSection('lovelang')}
            >
              ♥ Match this love language
            </button>
          </div>

          {/* Bio Section */}
          {profile.bio && (
            <div className="card-section">
              <h3>About Me</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--t2)' }}>
                {profile.bio}
              </p>
              <button 
                type="button" 
                className="section-like-btn" 
                onClick={() => setLikeModalSection('bio')}
              >
                ♥ Like bio
              </button>
            </div>
          )}

          {/* First Prompt */}
          {profile.prompts && profile.prompts[0] && profile.prompts[0].a && (
            <div className="card-section">
              <h3>{profile.prompts[0].q}</h3>
              <p style={{ fontSize: '15.5px', fontWeight: '600', color: 'var(--t1)', lineHeight: 1.5 }}>
                "{profile.prompts[0].a}"
              </p>
              <button 
                type="button" 
                className="section-like-btn" 
                onClick={() => setLikeModalSection('prompt1')}
              >
                ♥ Like answer
              </button>
            </div>
          )}

          {/* Tech Stack */}
          {profile.stack && profile.stack.length > 0 && (
            <div className="card-section">
              <h3>Primary Tech Stack</h3>
              <div className="tags-row">
                {profile.stack.map(t => (
                  <span key={t} className="tag tag-cyan">⚡ {t}</span>
                ))}
              </div>
              <button 
                type="button" 
                className="section-like-btn" 
                onClick={() => setLikeModalSection('tech')}
              >
                ♥ Like tech stack
              </button>
            </div>
          )}

          {/* Multi-Platform Profile Links & Verified Badges */}
          {(profile.ghUrl || profile.ghUser || profile.lcUrl || profile.lcUser || profile.liUrl || profile.liUser) && (
            <div className="card-section" style={{ background: 'var(--bg2)' }}>
              <h3>Verified Platform Profiles</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {(profile.ghUrl || profile.ghUser) && (
                  <a 
                    href={profile.ghUrl || `https://github.com/${profile.ghUser}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="tag tag-cyan"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    🐙 @{profile.ghUser || 'github'} ↗
                  </a>
                )}
                {(profile.lcUrl || profile.lcUser) && (
                  <a 
                    href={profile.lcUrl || `https://leetcode.com/u/${profile.lcUser}/`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="tag tag-amber"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    💡 @{profile.lcUser || 'leetcode'} ↗
                  </a>
                )}
                {(profile.liUrl || profile.liUser) && (
                  <a 
                    href={profile.liUrl || `https://www.linkedin.com/in/${profile.liUser}/`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="tag tag-rose"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    💼 LinkedIn ↗
                  </a>
                )}
              </div>
              {profile.platformAnalysis?.overall?.aiSummary && (
                <div style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: 1.5, background: 'var(--bg1)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--brd)' }}>
                  🤖 <em>"{profile.platformAnalysis.overall.aiSummary}"</em>
                </div>
              )}
            </div>
          )}

          {/* Stats: GitHub & LeetCode */}
          {(profile.ghContrib > 0 || profile.lcSolved > 0 || profile.platformAnalysis?.leetcode?.totalSolved > 0) && (
            <div className="card-section">
              <h3>Developer Performance</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {(profile.ghContrib > 0 || profile.platformAnalysis?.github?.publicRepos > 0) && (
                  <div style={{ background: 'var(--bg1)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--brd)' }}>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--green)' }}>
                      {profile.platformAnalysis?.github?.publicRepos || profile.ghContrib || 1}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', fontWeight: '700' }}>
                      {profile.platformAnalysis?.github?.publicRepos ? 'GitHub Repos' : 'GitHub Contribs'}
                    </div>
                  </div>
                )}
                {(profile.lcSolved > 0 || profile.platformAnalysis?.leetcode?.totalSolved > 0) && (
                  <div style={{ background: 'var(--bg1)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--brd)' }}>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--amber)' }}>
                      {profile.platformAnalysis?.leetcode?.totalSolved || profile.lcSolved || 0}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', fontWeight: '700' }}>
                      LeetCode Solved
                    </div>
                  </div>
                )}
              </div>
              <button 
                type="button" 
                className="section-like-btn" 
                onClick={() => setLikeModalSection('github')}
              >
                ♥ Like metrics
              </button>
            </div>
          )}

          {/* Second Prompt */}
          {profile.prompts && profile.prompts[1] && profile.prompts[1].a && (
            <div className="card-section">
              <h3>{profile.prompts[1].q}</h3>
              <p style={{ fontSize: '15.5px', fontWeight: '600', color: 'var(--t1)', lineHeight: 1.5 }}>
                "{profile.prompts[1].a}"
              </p>
              <button 
                type="button" 
                className="section-like-btn" 
                onClick={() => setLikeModalSection('prompt2')}
              >
                ♥ Like answer
              </button>
            </div>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="card-section">
              <h3>Interests & Vibes</h3>
              <div className="tags-row">
                {profile.interests.map(i => (
                  <span key={i} className="tag tag-gray">{i}</span>
                ))}
              </div>
              <button 
                type="button" 
                className="section-like-btn" 
                onClick={() => setLikeModalSection('interests')}
              >
                ♥ Like interests
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="action-bar">
        <button 
          type="button" 
          className="btn-action btn-pass" 
          onClick={handlePass}
          title="Pass (Left Arrow)"
        >
          ✕
        </button>
        <button 
          type="button" 
          className="btn-action btn-super" 
          onClick={() => setLikeModalSection('super')}
          title="Super Like (Space)"
        >
          ⭐
        </button>
        <button 
          type="button" 
          className="btn-action btn-like" 
          onClick={() => handleLike('profile')}
          title="Like (Right Arrow)"
        >
          ♥
        </button>
      </div>
    </div>
  );
}
