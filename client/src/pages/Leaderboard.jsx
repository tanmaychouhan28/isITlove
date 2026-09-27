import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'AI/ML', 'Mobile', 'DevOps'];

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/users/leaderboard?category=${selectedCategory}`);
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedCategory]);

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: '10px 20px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '38px', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '8px' }}>
          Top <span className="grad-rose">Developer</span> Leaderboard
        </h1>
        <p style={{ color: 'var(--t3)', fontSize: '15.5px' }}>
          Ranked algorithmically by DevScore (GitHub commits, LeetCode performance, stack mastery)
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`btn btn-sm ${selectedCategory === cat ? 'btn-rose' : 'btn-ghost'}`}
            style={{ borderRadius: '100px', padding: '8px 20px' }}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '70px 20px' }}>
          <div style={{ fontSize: '48px', animation: 'heartpop 1.4s infinite', marginBottom: '14px', display: 'inline-block' }}>🏆</div>
          <p style={{ color: 'var(--t3)', fontSize: '15px' }}>Computing developer rankings...</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Visual */}
          {top3.length >= 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.18fr 1fr', gap: '18px', alignItems: 'flex-end', marginBottom: '44px' }}>
              {/* 2nd Place Silver */}
              <div 
                className="glass-panel slide-up"
                style={{ 
                  padding: '26px 18px', 
                  textAlign: 'center', 
                  border: '2px solid rgba(148, 163, 184, 0.4)',
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: '30px', marginBottom: '4px' }}>🥈</div>
                <div style={{ fontSize: '52px', marginBottom: '8px' }}>{top3[1].emoji || '👨‍💻'}</div>
                <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '2px' }}>{top3[1].name}</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--t3)', marginBottom: '14px' }}>{top3[1].role}</p>
                <div style={{ display: 'inline-block', padding: '5px 14px', background: 'var(--bg2)', borderRadius: '100px', fontSize: '13.5px', fontWeight: '800', color: 'var(--cyan)', fontFamily: 'var(--mono)', border: '1px solid var(--brd)' }}>
                  {top3[1].devScore} pts
                </div>
              </div>

              {/* 1st Place Champion Gold */}
              <div 
                className="glass-panel slide-up"
                style={{ 
                  padding: '36px 20px', 
                  textAlign: 'center', 
                  border: '2px solid var(--rose)', 
                  background: 'radial-gradient(circle at 50% 15%, rgba(244, 63, 94, 0.15), var(--bg1) 85%)',
                  boxShadow: 'var(--shadow-lg), 0 0 30px rgba(244, 63, 94, 0.25)',
                  transform: 'scale(1.04)'
                }}
              >
                <div style={{ fontSize: '38px', marginBottom: '4px', animation: 'heartpop 2s infinite', display: 'inline-block' }}>👑 🥇</div>
                <div style={{ fontSize: '66px', marginBottom: '10px', animation: 'floatAnim 3.5s infinite' }}>{top3[0].emoji || '👨‍💻'}</div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '3px' }}>{top3[0].name}</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--rose)', fontWeight: '700', marginBottom: '14px' }}>{top3[0].role}</p>
                <div style={{ display: 'inline-block', padding: '7px 20px', background: 'linear-gradient(135deg, var(--rose) 0%, #e11d48 100%)', borderRadius: '100px', fontSize: '15px', fontWeight: '800', color: 'white', fontFamily: 'var(--mono)', boxShadow: '0 4px 16px rgba(244,63,94,0.45)' }}>
                  {top3[0].devScore} pts
                </div>
              </div>

              {/* 3rd Place Bronze */}
              <div 
                className="glass-panel slide-up"
                style={{ 
                  padding: '22px 18px', 
                  textAlign: 'center', 
                  border: '2px solid rgba(217, 119, 6, 0.4)',
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: '30px', marginBottom: '4px' }}>🥉</div>
                <div style={{ fontSize: '52px', marginBottom: '8px' }}>{top3[2].emoji || '👨‍💻'}</div>
                <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '2px' }}>{top3[2].name}</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--t3)', marginBottom: '14px' }}>{top3[2].role}</p>
                <div style={{ display: 'inline-block', padding: '5px 14px', background: 'var(--bg2)', borderRadius: '100px', fontSize: '13.5px', fontWeight: '800', color: 'var(--amber)', fontFamily: 'var(--mono)', border: '1px solid var(--brd)' }}>
                  {top3[2].devScore} pts
                </div>
              </div>
            </div>
          )}

          {/* Full List View */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(top3.length < 3 ? users : rest).map((u, i) => {
              const rank = (top3.length < 3 ? 0 : 3) + i + 1;
              return (
                <div
                  key={u._id || i}
                  className="glass-panel slide-up"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px 24px',
                    gap: '18px'
                  }}
                >
                  <div style={{ width: '40px', fontSize: '17px', fontWeight: '800', color: 'var(--t3)', fontFamily: 'var(--mono)' }}>
                    #{rank}
                  </div>

                  <div style={{ fontSize: '36px' }}>
                    {u.emoji || '👨‍💻'}
                  </div>

                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: '800', fontSize: '16px' }}>{u.name || 'Anonymous Dev'}</div>
                    <div style={{ fontSize: '13px', color: 'var(--t3)' }}>
                      {u.role} {u.company ? `• ${u.company}` : ''}
                    </div>
                  </div>

                  {u.stack && u.stack.length > 0 && (
                    <div className="tags-row">
                      {u.stack.slice(0, 3).map(s => (
                        <span key={s} className="tag tag-gray" style={{ fontSize: '11px', padding: '4px 10px' }}>{s}</span>
                      ))}
                    </div>
                  )}

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '17px', fontWeight: '800', color: 'var(--cyan)', fontFamily: 'var(--mono)' }}>
                      {u.devScore || 900}
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--t3)', textTransform: 'uppercase', fontWeight: '700' }}>DevScore</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
