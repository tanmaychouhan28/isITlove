import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import CodeSnippetModal from '../components/CodeSnippetModal';

const QUICK_DEV_ICEBREAKERS = [
  "Tabs or spaces? Let's settle this right now.",
  "What's your current favorite stack to ship with?",
  "Care to do a quick mock pairing session?",
  "Review my PR and I'll review yours! 🚀"
];

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialMatchId = searchParams.get('matchId');

  const [matches, setMatches] = useState([]);
  const [activeMatch, setActiveMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Connect to Socket.io — use same origin in prod, localhost in dev
    const SOCKET_URL = import.meta.env.PROD
      ? window.location.origin
      : 'http://localhost:5000';
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    // Authenticate socket: join personal user room for match notifications
    const token = localStorage.getItem('devpair_token');
    if (token) {
      socket.emit('join-user', token);
    }

    // Load user matches
    api.get('/matches').then(res => {
      setMatches(res.data);
      if (res.data.length > 0) {
        if (initialMatchId) {
          const found = res.data.find(m => m._id === initialMatchId);
          setActiveMatch(found || res.data[0]);
        } else {
          setActiveMatch(res.data[0]);
        }
      }
    }).catch(console.error);

    return () => {
      socket.disconnect();
    };
  }, [initialMatchId]);

  // Handle active match changes & join socket room
  useEffect(() => {
    if (activeMatch && socketRef.current) {
      // Fetch messages for this match
      api.get(`/messages/${activeMatch._id}`).then(res => {
        setMessages(res.data);
      }).catch(console.error);

      // Join room
      socketRef.current.emit('join-match', activeMatch._id);

      // Listen for incoming messages
      const handleIncomingMessage = (msg) => {
        if (msg && msg.matchId === activeMatch._id) {
          setMessages(prev => {
            if (prev.some(m => m._id && m._id === msg._id)) return prev;
            return [...prev, msg];
          });
        }
      };

      socketRef.current.on('receive-message', handleIncomingMessage);
      socketRef.current.on('message', handleIncomingMessage);

      // Typing listeners
      socketRef.current.on('user-typing', (data) => {
        if (data.matchId === activeMatch._id) {
          setTypingUser(data.userName || 'Peer');
        }
      });

      socketRef.current.on('user-stop-typing', (data) => {
        if (data.matchId === activeMatch._id) {
          setTypingUser(null);
        }
      });

      return () => {
        socketRef.current.off('receive-message', handleIncomingMessage);
        socketRef.current.off('message', handleIncomingMessage);
        socketRef.current.off('user-typing');
        socketRef.current.off('user-stop-typing');
      };
    }
  }, [activeMatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!isTyping && activeMatch && socketRef.current) {
      setIsTyping(true);
      socketRef.current.emit('typing', { matchId: activeMatch._id, userName: user?.name });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (activeMatch && socketRef.current) {
        socketRef.current.emit('stop-typing', { matchId: activeMatch._id });
      }
    }, 1500);
  };

  const sendMessagePayload = async (payload) => {
    if (!activeMatch) return;

    try {
      const res = await api.post(`/messages/${activeMatch._id}`, payload);
      setMessages(prev => {
        if (prev.some(m => m._id && m._id === res.data._id)) return prev;
        return [...prev, res.data];
      });
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const handleSendText = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || !activeMatch) return;

    const textToSend = input.trim();
    setInput('');
    await sendMessagePayload({ text: textToSend, type: 'text' });
  };

  const handleSendCodeSnippet = async (snippetData) => {
    await sendMessagePayload(snippetData);
  };

  const getTargetUser = (m) => {
    return m.targetUser || (m.user2?._id === user?._id ? m.user1 : m.user2) || {};
  };

  const activeTarget = activeMatch ? getTargetUser(activeMatch) : null;

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', height: 'calc(100vh - 110px)', display: 'flex', gap: '18px', padding: '0 16px' }}>
      {showCodeModal && (
        <CodeSnippetModal 
          onSend={handleSendCodeSnippet} 
          onClose={() => setShowCodeModal(false)} 
        />
      )}

      {/* Matches Sidebar */}
      <div 
        className="glass-panel" 
        style={{ 
          width: '320px', 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          flexShrink: 0,
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--brd)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Active Chats</h3>
          <span style={{ fontSize: '12px', background: 'rgba(244, 63, 94, 0.12)', color: 'var(--rose)', padding: '3px 10px', borderRadius: '100px', fontWeight: '800' }}>
            {matches.length}
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {matches.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--t3)', fontSize: '13.5px' }}>
              No matches yet. Discover and like developers to chat!
            </div>
          ) : (
            matches.map(m => {
              const target = getTargetUser(m);
              const isSelected = activeMatch?._id === m._id;
              return (
                <div
                  key={m._id}
                  onClick={() => setActiveMatch(m)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--brd)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(244, 63, 94, 0.08)' : 'transparent',
                    borderLeft: isSelected ? '4px solid var(--rose)' : '4px solid transparent',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div style={{ fontSize: '34px', flexShrink: 0 }}>
                    {target.emoji || '👩‍💻'}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: isSelected ? 'var(--rose)' : 'var(--t1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {target.name || 'Developer'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--t3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {target.role || 'Software Engineer'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Conversation Pane */}
      <div 
        className="glass-panel" 
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {activeMatch && activeTarget ? (
          <>
            {/* Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--brd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ fontSize: '38px' }}>{activeTarget.emoji || '👩‍💻'}</div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {activeTarget.name || 'Developer'}
                    <span style={{ fontSize: '11px', background: 'rgba(5, 150, 105, 0.15)', color: 'var(--green)', padding: '2px 8px', borderRadius: '100px', fontWeight: '700' }}>
                      ● Online
                    </span>
                  </h3>
                  <div style={{ fontSize: '12.5px', color: 'var(--t3)' }}>
                    {activeTarget.role} {activeTarget.company ? `at ${activeTarget.company}` : ''}
                  </div>
                </div>
              </div>

              {activeTarget.stack && activeTarget.stack.length > 0 && (
                <div className="tags-row">
                  {activeTarget.stack.slice(0, 3).map(s => (
                    <span key={s} className="tag tag-cyan" style={{ fontSize: '11px', padding: '4px 10px' }}>⚡ {s}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Messages Scrollable Feed */}
            <div style={{ flex: 1, padding: '22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ textAlign: 'center', margin: '4px 0 16px' }}>
                <span style={{ fontSize: '12px', background: 'var(--bg2)', border: '1px solid var(--brd)', padding: '6px 16px', borderRadius: '100px', color: 'var(--t3)', fontFamily: 'var(--mono)', fontWeight: '600' }}>
                  🎉 Clean merge created! Start pair programming.
                </span>
              </div>

              {messages.map((msg, i) => {
                const isMe = msg.sender === user?._id || msg.sender?._id === user?._id;
                return (
                  <div 
                    key={msg._id || i} 
                    className="slide-up"
                    style={{
                      maxWidth: '78%',
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div 
                      style={{
                        padding: '13px 20px',
                        borderRadius: 'var(--radius-md)',
                        background: isMe 
                          ? 'linear-gradient(135deg, var(--rose) 0%, #e11d48 100%)' 
                          : 'var(--bg2)',
                        border: isMe ? 'none' : '1px solid var(--brd)',
                        color: isMe ? 'white' : 'var(--t1)',
                        fontSize: '14.5px',
                        lineHeight: 1.55,
                        boxShadow: isMe ? '0 4px 16px rgba(244, 63, 94, 0.3)' : 'var(--shadow-sm)'
                      }}
                    >
                      {msg.text && <div>{msg.text}</div>}

                      {/* Code Snippet Box */}
                      {msg.type === 'code' && msg.codeContent && (
                        <div className="code-block-msg">
                          <div className="code-header">
                            <span>⚡ {msg.codeLang || 'CODE'}</span>
                            <span 
                              style={{ cursor: 'pointer', color: 'var(--cyan)' }}
                              onClick={() => navigator.clipboard.writeText(msg.codeContent)}
                            >
                              📋 Copy
                            </span>
                          </div>
                          <pre style={{ margin: 0 }}><code>{msg.codeContent}</code></pre>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Animated Live Typing Wave */}
              {typingUser && (
                <div style={{ fontSize: '12.5px', color: 'var(--cyan)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✍️ {typingUser} is typing code</span>
                  <div style={{ display: 'inline-flex', gap: '4px' }}>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Icebreakers Row */}
            {messages.length < 3 && (
              <div style={{ padding: '8px 20px', display: 'flex', gap: '8px', overflowX: 'auto', borderTop: '1px solid var(--brd)', background: 'var(--bg2)' }}>
                {QUICK_DEV_ICEBREAKERS.map((text, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '100px', padding: '5px 14px' }}
                    onClick={() => sendMessagePayload({ text, type: 'text' })}
                  >
                    💬 {text}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input Bar */}
            <form onSubmit={handleSendText} style={{ padding: '16px 22px', borderTop: '1px solid var(--brd)', display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--card)' }}>
              <button 
                type="button" 
                className="btn btn-cyan btn-sm" 
                title="Share Code Snippet"
                onClick={() => setShowCodeModal(true)}
              >
                <span>⚡ Code</span>
              </button>

              <input 
                type="text" 
                className="form-input" 
                placeholder="Type a message or discuss tech..." 
                value={input} 
                onChange={handleInputChange} 
                style={{ flex: 1 }}
              />

              <button 
                type="submit" 
                className="btn btn-rose" 
                disabled={!input.trim()}
              >
                Send →
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', padding: '24px' }}>
            <div style={{ fontSize: '56px', marginBottom: '14px', animation: 'floatAnim 3s infinite' }}>💬</div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--t1)', marginBottom: '4px' }}>Select a Conversation</h3>
            <p style={{ fontSize: '14px' }}>Choose a pair from the left sidebar to chat and share code.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
