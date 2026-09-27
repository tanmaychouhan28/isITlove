import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, api } from '../context/AuthContext';
import EditProfileModal from '../components/EditProfileModal';

const Profile = () => {
  const { user, setUser, updateProfile, logout } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = async (formData) => {
    await updateProfile(formData);
  };

  const handleSyncAnalysis = async () => {
    setSyncing(true);
    setSyncMessage('');
    try {
      const res = await api.post('/users/analyze', {
        ghUrl: user.ghUrl || user.ghUser,
        lcUrl: user.lcUrl || user.lcUser,
        liUrl: user.liUrl || user.liUser
      });
      if (res.data?.user) {
        setUser(res.data.user);
        setSyncMessage('✨ Multi-Platform Profile Analysis updated with live data!');
        setTimeout(() => setSyncMessage(''), 4000);
      }
    } catch (err) {
      setSyncMessage('Could not refresh analysis. Check your profile links.');
      setTimeout(() => setSyncMessage(''), 4000);
    } finally {
      setSyncing(false);
    }
  };

  if (!user) return null;

  const analysis = user.platformAnalysis || {};
  const ghData = analysis.github || {};
  const lcData = analysis.leetcode || {};
  const liData = analysis.linkedin || {};
  const overall = analysis.overall || {};

  const ghUrl = user.ghUrl || (user.ghUser ? `https://github.com/${user.ghUser}` : (ghData.url || ''));
  const lcUrl = user.lcUrl || (user.lcUser ? `https://leetcode.com/u/${user.lcUser}/` : (lcData.url || ''));
  const liUrl = user.liUrl || (user.liUser ? `https://www.linkedin.com/in/${user.liUser}/` : (liData.url || ''));

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '10px 20px 80px' }}>
      {showEditModal && (
        <EditProfileModal 
          user={user} 
          onSave={handleSaveProfile} 
          onClose={() => setShowEditModal(false)} 
        />
      )}

      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>Developer Profile</h1>
          <p style={{ color: 'var(--t3)', fontSize: '14px' }}>Verified multi-platform credentials & live developer analysis</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            className="btn btn-ghost btn-sm"
            onClick={handleSyncAnalysis}
            disabled={syncing}
            style={{ borderColor: 'var(--cyan)', color: 'var(--cyan)', fontWeight: '700' }}
          >
            {syncing ? '⏳ Syncing...' : '🔄 Re-Analyze Profiles'}
          </button>
          <button 
            type="button" 
            className="btn btn-rose btn-sm"
            onClick={() => setShowEditModal(true)}
          >
            ✏️ Edit Profile
          </button>
          <button 
            type="button" 
            className="btn btn-ghost btn-sm"
            onClick={handleLogout}
            style={{ color: 'var(--red)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          >
            Log Out
          </button>
        </div>
      </div>

      {syncMessage && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--green)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '13.5px', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
          {syncMessage}
        </div>
      )}

      {/* Profile Card Preview */}
      <div className="profile-card slide-up" style={{ marginBottom: '28px' }}>
        <div className="card-hero">
          <div className="card-avatar" style={{ position: 'relative' }}>
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--rose)' }} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <span>{user.emoji || '👨‍💻'}</span>
            )}
          </div>
          <div className="card-hero-info">
            <h2>
              {user.name}, {user.age || 22}
              <span style={{ color: 'var(--cyan)', fontSize: '20px', marginLeft: '6px' }} title="Verified Profile">✓</span>
            </h2>
            <p>
              {user.role || 'Developer'} {user.company ? `• ${user.company}` : ''}
              {user.location ? ` • ${user.location}` : ''}
            </p>
          </div>
        </div>

        {/* Multi-Platform Profile Links Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', padding: '16px 20px', background: 'var(--bg2)', borderBottom: '1px solid var(--brd)' }}>
          {/* GitHub Link */}
          {ghUrl ? (
            <a 
              href={ghUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'var(--bg1)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--brd)', textDecoration: 'none', color: 'var(--t1)', transition: 'all 0.2s ease' }}
            >
              <span style={{ fontSize: '20px' }}>🐙</span>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', fontWeight: '700' }}>GitHub</div>
                <div style={{ fontSize: '13px', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  @{user.ghUser || ghData.username || 'github'} ↗
                </div>
              </div>
            </a>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'var(--bg1)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--brd)', color: 'var(--t4)' }}>
              <span style={{ fontSize: '20px' }}>🐙</span>
              <span style={{ fontSize: '12px' }}>GitHub not linked</span>
            </div>
          )}

          {/* LeetCode Link */}
          {lcUrl ? (
            <a 
              href={lcUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'var(--bg1)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--brd)', textDecoration: 'none', color: 'var(--t1)', transition: 'all 0.2s ease' }}
            >
              <span style={{ fontSize: '20px' }}>💡</span>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', fontWeight: '700' }}>LeetCode</div>
                <div style={{ fontSize: '13px', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  @{user.lcUser || lcData.username || 'leetcode'} ↗
                </div>
              </div>
            </a>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'var(--bg1)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--brd)', color: 'var(--t4)' }}>
              <span style={{ fontSize: '20px' }}>💡</span>
              <span style={{ fontSize: '12px' }}>LeetCode not linked</span>
            </div>
          )}

          {/* LinkedIn Link */}
          {liUrl ? (
            <a 
              href={liUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'var(--bg1)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--brd)', textDecoration: 'none', color: 'var(--t1)', transition: 'all 0.2s ease' }}
            >
              <span style={{ fontSize: '20px' }}>💼</span>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', fontWeight: '700' }}>LinkedIn</div>
                <div style={{ fontSize: '13px', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  @{user.liUser || liData.username || 'profile'} ↗
                </div>
              </div>
            </a>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'var(--bg1)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--brd)', color: 'var(--t4)' }}>
              <span style={{ fontSize: '20px' }}>💼</span>
              <span style={{ fontSize: '12px' }}>LinkedIn not linked</span>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--brd)', borderBottom: '1px solid var(--brd)' }}>
          <div style={{ background: 'var(--bg1)', padding: '16px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--rose)', fontFamily: 'var(--mono)' }}>
              {user.devScore || overall.devScore || 1200}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              DevScore
            </div>
          </div>

          <div style={{ background: 'var(--bg1)', padding: '16px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--cyan)', fontFamily: 'var(--mono)' }}>
              {ghData.publicRepos ?? user.ghContrib ?? 1}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              Public Repos
            </div>
          </div>

          <div style={{ background: 'var(--bg1)', padding: '16px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--amber)', fontFamily: 'var(--mono)' }}>
              {lcData.totalSolved ?? user.lcSolved ?? 0}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              LC Solved
            </div>
          </div>

          <div style={{ background: 'var(--bg1)', padding: '16px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--green)', fontFamily: 'var(--mono)' }}>
              {user.stack?.length || 0}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              Tech Stacks
            </div>
          </div>
        </div>

        <div className="card-content">
          {/* Bio */}
          {user.bio && (
            <div className="card-section">
              <h3>About Me</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--t2)' }}>
                {user.bio}
              </p>
            </div>
          )}

          {/* Tech Stack */}
          {user.stack && user.stack.length > 0 && (
            <div className="card-section">
              <h3>Primary Tech Stack</h3>
              <div className="tags-row">
                {user.stack.map(t => (
                  <span key={t} className="tag tag-cyan">⚡ {t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Developer Prompts */}
          {user.prompts && user.prompts.map((p, idx) => p.a && (
            <div key={idx} className="card-section">
              <h3>{p.q}</h3>
              <p style={{ fontSize: '15.5px', fontWeight: '600', color: 'var(--t1)', lineHeight: 1.5 }}>
                "{p.a}"
              </p>
            </div>
          ))}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div className="card-section">
              <h3>Interests & Vibes</h3>
              <div className="tags-row">
                {user.interests.map(i => (
                  <span key={i} className="tag tag-gray">{i}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Automated Multi-Platform Analysis Engine Section */}
      <div className="glass-panel slide-up" style={{ padding: '28px 24px', marginBottom: '30px', border: '1px solid var(--brd2)', background: 'linear-gradient(180deg, var(--bg1) 0%, var(--bg2) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>⚡</span>
              <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Multi-Platform Developer Intelligence</h2>
            </div>
            <p style={{ color: 'var(--t3)', fontSize: '13px', marginTop: '2px' }}>
              Deep automated analysis from GitHub, LeetCode & LinkedIn
            </p>
          </div>

          <span style={{ fontSize: '11.5px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '4px 10px', borderRadius: '100px', fontWeight: '700' }}>
            ✓ Verified Credentials
          </span>
        </div>

        {/* AI Developer Summary */}
        {overall.aiSummary && (
          <div style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800', color: 'var(--rose)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              <span>🤖</span> AI Developer Synergy Summary
            </div>
            <p style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'var(--t1)' }}>
              {overall.aiSummary}
            </p>
          </div>
        )}

        {/* Core Strengths Highlights */}
        {overall.strengths && overall.strengths.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <h3 style={{ fontSize: '13.5px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '800', marginBottom: '10px' }}>
              Key Verified Strengths
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {overall.strengths.map((str, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--card)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--brd)', fontSize: '13.5px', fontWeight: '600' }}>
                  {str}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3-Platform Intelligence Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {/* GitHub Analysis Box */}
          <div style={{ background: 'var(--bg1)', padding: '18px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--brd)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '14px' }}>
                <span>🐙</span> GitHub
              </div>
              <span style={{ fontSize: '11px', color: ghData.connected ? 'var(--green)' : 'var(--t4)', fontWeight: '700' }}>
                {ghData.status || (ghData.connected ? 'Live' : 'Not Connected')}
              </span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--t1)', fontFamily: 'var(--mono)' }}>
              {ghData.publicRepos ?? 1} <span style={{ fontSize: '12px', color: 'var(--t3)', fontWeight: '500' }}>Repos</span> • {ghData.totalStars ?? 1} ⭐
            </div>
            <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px' }}>
              Top: {ghData.languages?.[0]?.language || 'JavaScript'} • {ghData.followers ?? 3} Followers
            </div>
          </div>

          {/* LeetCode Analysis Box */}
          <div style={{ background: 'var(--bg1)', padding: '18px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--brd)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '14px' }}>
                <span>💡</span> LeetCode
              </div>
              <span style={{ fontSize: '11px', color: lcData.connected ? 'var(--amber)' : 'var(--t4)', fontWeight: '700' }}>
                {lcData.status || (lcData.connected ? 'Live' : 'Not Connected')}
              </span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--t1)', fontFamily: 'var(--mono)' }}>
              {lcData.totalSolved ?? 0} <span style={{ fontSize: '12px', color: 'var(--t3)', fontWeight: '500' }}>Problems Solved</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px' }}>
              🟢 {lcData.easySolved ?? 0} Easy • 🟡 {lcData.mediumSolved ?? 0} Med • 🔴 {lcData.hardSolved ?? 0} Hard
            </div>
          </div>

          {/* LinkedIn Analysis Box */}
          <div style={{ background: 'var(--bg1)', padding: '18px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--brd)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '14px' }}>
                <span>💼</span> LinkedIn
              </div>
              <span style={{ fontSize: '11px', color: liData.connected ? 'var(--cyan)' : 'var(--t4)', fontWeight: '700' }}>
                {liData.status || (liData.connected ? 'Live' : 'Not Connected')}
              </span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--t1)' }}>
              {liData.headline || user.role || 'Student & Developer'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px' }}>
              Status: {liData.experience || 'Student / Early Career'}
            </div>
          </div>
        </div>

        {/* Top Open Source Repositories Showcase */}
        {ghData.topRepos && ghData.topRepos.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <h3 style={{ fontSize: '13.5px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '800', marginBottom: '12px' }}>
              Featured GitHub Repositories
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ghData.topRepos.map((repo, idx) => (
                <a 
                  key={idx} 
                  href={repo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'block', background: 'var(--bg2)', padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--brd)', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s ease' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--cyan)', fontSize: '14px' }}>
                      📦 {repo.name} ↗
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--amber)' }}>
                      ⭐ {repo.stars}
                    </span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--t2)', margin: '4px 0 6px', lineHeight: 1.4 }}>
                    {repo.description}
                  </p>
                  <span className="tag tag-gray" style={{ fontSize: '11px', padding: '2px 8px' }}>
                    ⚡ {repo.language}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

