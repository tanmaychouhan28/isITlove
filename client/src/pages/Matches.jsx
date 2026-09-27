import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, useAuth } from '../context/AuthContext';

const Matches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get('/matches');
        setMatches(res.data);
      } catch (err) {
        console.error('Failed to fetch matches:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const openConversation = (matchId) => {
    navigate(`/app/messages?matchId=${matchId}`);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', animation: 'heartpop 1.5s infinite', marginBottom: '16px', display: 'inline-block' }}>💜</div>
        <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Loading your clean merges...</h3>
      </div>
    );
  }

  const getTargetUser = (m) => {
    return m.targetUser || (m.user2?._id === user?._id ? m.user1 : m.user2) || {};
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '10px 20px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '4px' }}>
            Your <span className="grad-rose">Clean Merges</span> & Pairs
          </h1>
          <p style={{ color: 'var(--t3)', fontSize: '15px' }}>
            Developers who matched with your stack, ready to collaborate and connect.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', background: 'var(--card)', padding: '5px', borderRadius: '100px', border: '1px solid var(--brd)', boxShadow: 'var(--shadow-sm)' }}>
          <button
            type="button"
            className={`btn btn-sm ${filterTab === 'all' ? 'btn-rose' : 'btn-ghost'}`}
            style={{ borderRadius: '100px', padding: '8px 18px' }}
            onClick={() => setFilterTab('all')}
          >
            All Pairs ({matches.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterTab === 'recent' ? 'btn-rose' : 'btn-ghost'}`}
            style={{ borderRadius: '100px', padding: '8px 18px' }}
            onClick={() => setFilterTab('recent')}
          >
            Recent Activity
          </button>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="glass-panel slide-up" style={{ textAlign: 'center', padding: '70px 24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '18px', animation: 'floatAnim 3s infinite' }}>💌</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>No matches yet</h2>
          <p style={{ color: 'var(--t3)', fontSize: '15px', maxWidth: '400px', margin: '0 auto 28px', lineHeight: 1.6 }}>
            Keep exploring and liking developer profiles. When someone likes you back, they'll appear right here!
          </p>
          <button type="button" className="btn btn-rose btn-lg" onClick={() => navigate('/app/discover')}>
            🔍 Start Discovering
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '22px' }}>
          {matches.map((m) => {
            const target = getTargetUser(m);
            return (
              <div 
                key={m._id} 
                className="glass-panel glass-panel-hover slide-up"
                style={{ 
                  padding: '26px 22px', 
                  cursor: 'pointer', 
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => openConversation(m._id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div 
                    style={{ 
                      fontSize: '46px', 
                      width: '68px', 
                      height: '68px', 
                      borderRadius: '50%', 
                      background: 'rgba(244, 63, 94, 0.1)', 
                      border: '2px solid rgba(244, 63, 94, 0.25)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {target.emoji || '👩‍💻'}
                  </div>

                  <div style={{ overflow: 'hidden' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {target.name || 'Developer'}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--cyan)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {target.role || 'Software Engineer'}
                    </p>
                  </div>
                </div>

                {target.company && (
                  <div style={{ fontSize: '12.5px', color: 'var(--t3)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🏢</span> {target.company} {target.location ? `• ${target.location}` : ''}
                  </div>
                )}

                {/* Tech Stack Pills */}
                {target.stack && target.stack.length > 0 && (
                  <div className="tags-row" style={{ marginBottom: '18px' }}>
                    {target.stack.slice(0, 3).map(t => (
                      <span key={t} className="tag tag-gray" style={{ fontSize: '11px', padding: '4px 10px' }}>
                        {t}
                      </span>
                    ))}
                    {target.stack.length > 3 && (
                      <span className="tag tag-gray" style={{ fontSize: '11px', padding: '4px 10px' }}>
                        +{target.stack.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Last Message and Chat Action */}
                <div style={{ borderTop: '1px solid var(--brd)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12.5px', color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                    💬 {m.lastMessage || 'Say hi!'}
                  </div>
                  <button 
                    type="button"
                    className="btn btn-rose btn-sm"
                    style={{ fontSize: '12px', padding: '6px 14px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openConversation(m._id);
                    }}
                  >
                    Chat →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Matches;
