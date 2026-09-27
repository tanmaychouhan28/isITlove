import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../utils/audio';

const SAMPLE_HERO_PROFILES = [
  {
    name: "Elena Rostova",
    age: 26,
    role: "Senior Frontend Architect",
    company: "Stripe",
    location: "San Francisco, CA",
    emoji: "👩‍💻",
    stack: ["React", "TypeScript", "Next.js", "TailwindCSS"],
    bio: "Obsessed with 120 FPS animations, clean component trees, and pour-over Ethiopian roast coffee ☕.",
    prompt: "I'll know it's love when we pair program for 6 hours straight without touching the mouse."
  },
  {
    name: "Marcus Vance",
    age: 28,
    role: "Staff Rust & Systems Engineer",
    company: "Vercel",
    location: "New York, NY",
    emoji: "🦀",
    stack: ["Rust", "Go", "WebAssembly", "PostgreSQL"],
    bio: "Zero memory leaks, zero runtime exceptions, 100% devoted to building ultra low-latency love.",
    prompt: "My most controversial opinion: Memory safety is the ultimate love language."
  },
  {
    name: "Aria Chen",
    age: 25,
    role: "AI / ML Research Engineer",
    company: "Anthropic",
    location: "Seattle, WA",
    emoji: "🧠",
    stack: ["Python", "PyTorch", "CUDA", "FastAPI"],
    bio: "Fine-tuning neural weights by day, exploring cozy tea shops and indie synth-pop by night 🎶.",
    prompt: "Looking for someone whose synergy loss converges to 0.00."
  }
];

const TECH_SYNERGY_MATRIX = {
  "React": { "Go": 98, "Rust": 95, "TypeScript": 99, "Python": 92, "Next.js": 100 },
  "TypeScript": { "React": 99, "Rust": 97, "Go": 96, "Python": 91, "Next.js": 99 },
  "Rust": { "TypeScript": 97, "Go": 99, "React": 95, "Python": 88, "WebAssembly": 100 },
  "Python": { "React": 92, "TypeScript": 91, "PyTorch": 100, "Go": 94, "Rust": 88 },
  "Go": { "React": 98, "TypeScript": 96, "Rust": 99, "Python": 94, "Next.js": 95 }
};

const GIT_ROMANCE_COMMITS = [
  { hash: "init_a1", title: "git init romance -m 'First coffee & VS Code pairing session'", date: "Day 1", author: "You & Elena" },
  { hash: "add_b2", title: "git add shared_dreams.ts --all", date: "Day 14", author: "Elena" },
  { hash: "fix_c3", title: "git commit -m 'Fixed production bug together at 2 AM with pizza 🍕'", date: "Day 45", author: "You" },
  { hash: "star_d4", title: "git tag -a v1.0.0 -m 'Moved into a shared home with two dual-monitor setups'", date: "Day 180", author: "Both" },
  { hash: "merge_e5", title: "git merge main --no-ff -m 'Engaged to the best full-stack partner forever ♥'", date: "Day 365", author: "isITlove Clean Merge" }
];

const COMMUNITY_STORIES = [
  {
    names: "Sarah (Frontend) & David (Backend)",
    role: "Matched in San Francisco",
    avatar1: "👩‍💻",
    avatar2: "👨‍💻",
    quote: "We matched during a heated tabs vs spaces debate. 18 months later, we co-founded a SaaS startup and share an AWS bill and a ginger cat 🐱.",
    compat: "99% Synergy"
  },
  {
    names: "Leo (AI Engineer) & Maya (Rust Dev)",
    role: "Matched in Berlin",
    avatar1: "🤖",
    avatar2: "🦀",
    quote: "Finding someone who understands concurrency bugs and loves midnight hackathons seemed impossible until isITlove. Best merge ever!",
    compat: "98% Synergy"
  },
  {
    names: "Kevin (Mobile) & Liam (Cloud Architect)",
    role: "Matched in London",
    avatar1: "📱",
    avatar2: "☁️",
    quote: "Our first date was a coffee shop pair-programming sprint. Zero merge conflicts from day one.",
    compat: "97% Synergy"
  }
];

export default function Landing() {
  const { demoLogin, user, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = useState(false);

  // Hero Interactive Card Simulator State
  const [heroCardIdx, setHeroCardIdx] = useState(0);
  const [heroFeedback, setHeroFeedback] = useState(null);
  const [heroMatched, setHeroMatched] = useState(false);

  // Tech Synergy Calculator State
  const [myStack, setMyStack] = useState("TypeScript");
  const [matchStack, setMatchStack] = useState("Go");

  // Sound FX State
  const [isMuted, setIsMuted] = useState(soundFX.isMuted());

  const toggleSound = () => {
    const m = soundFX.toggleMute();
    setIsMuted(m);
    if (!m) soundFX.playLike();
  };

  const handleHeroSwipe = (type) => {
    if (type === 'pass') {
      soundFX.playPass();
      setHeroFeedback('passed');
    } else {
      soundFX.playLike();
      setHeroFeedback('liked');
      setTimeout(() => {
        soundFX.playMatch();
        setHeroMatched(true);
      }, 350);
    }

    setTimeout(() => {
      setHeroCardIdx((prev) => (prev + 1) % SAMPLE_HERO_PROFILES.length);
      setHeroFeedback(null);
    }, 450);
  };

  const handleQuickDemo = async () => {
    soundFX.playMatch();
    setLoggingIn(true);
    try {
      await demoLogin('alex@devpair.dev');
      navigate('/app/discover');
    } catch (err) {
      navigate('/login');
    } finally {
      setLoggingIn(false);
    }
  };

  const calculateSynergy = () => {
    if (TECH_SYNERGY_MATRIX[myStack] && TECH_SYNERGY_MATRIX[myStack][matchStack]) {
      return TECH_SYNERGY_MATRIX[myStack][matchStack];
    }
    return 94;
  };

  const currentProfile = SAMPLE_HERO_PROFILES[heroCardIdx];

  return (
    <div className="landing-page" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Background Layer 1: High-Tech Masked Grid */}
      <div className="cyber-grid-pattern" />

      {/* Background Layer 2: Aurora Morphing Mesh */}
      <div className="aurora-mesh">
        <div className="aurora-orb-1" />
        <div className="aurora-orb-2" />
        <div className="aurora-orb-3" />
        <div className="aurora-orb-4" />
      </div>

      {/* Background Layer 3: Subtle Floating Code Glyphs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <span className="float-anim" style={{ position: 'absolute', top: '22%', left: '12%', fontFamily: 'var(--mono)', fontSize: '20px', color: 'var(--rose)', opacity: 0.18 }}>
          {`{ isITlove: true }`}
        </span>
        <span className="float-anim" style={{ position: 'absolute', top: '38%', right: '14%', fontFamily: 'var(--mono)', fontSize: '24px', color: 'var(--cyan)', opacity: 0.18, animationDelay: '1.2s' }}>
          {`<isITlove merge="clean" />`}
        </span>
        <span className="float-anim" style={{ position: 'absolute', top: '75%', left: '18%', fontFamily: 'var(--mono)', fontSize: '22px', color: 'var(--violet)', opacity: 0.16, animationDelay: '2.4s' }}>
          {`async () => ❤️`}
        </span>
        <span className="float-anim" style={{ position: 'absolute', top: '82%', right: '22%', fontFamily: 'var(--mono)', fontSize: '20px', color: 'var(--green)', opacity: 0.18, animationDelay: '0.6s' }}>
          {`0_merge_conflicts`}
        </span>
      </div>

      {/* Floating Animated Badges in Background */}
      <div className="float-anim" style={{ position: 'absolute', top: '15%', left: '6%', pointerEvents: 'none', zIndex: 1, opacity: 0.85 }}>
        <span className="tag tag-cyan" style={{ boxShadow: 'var(--shadow-sm)', fontSize: '13px', padding: '8px 16px' }}>⚡ TypeScript Romance</span>
      </div>
      <div className="float-anim" style={{ position: 'absolute', top: '18%', right: '7%', animationDelay: '1.5s', pointerEvents: 'none', zIndex: 1, opacity: 0.85 }}>
        <span className="tag tag-rose" style={{ boxShadow: 'var(--shadow-sm)', fontSize: '13px', padding: '8px 16px' }}>♥ 0 Merge Conflicts</span>
      </div>
      <div className="float-anim" style={{ position: 'absolute', top: '55%', left: '5%', animationDelay: '2.2s', pointerEvents: 'none', zIndex: 1, opacity: 0.75 }}>
        <span className="tag tag-violet" style={{ boxShadow: 'var(--shadow-sm)', fontSize: '13px', padding: '8px 16px' }}>☕ Latte & Pair Sessions</span>
      </div>
      <div className="float-anim" style={{ position: 'absolute', top: '65%', right: '6%', animationDelay: '0.8s', pointerEvents: 'none', zIndex: 1, opacity: 0.75 }}>
        <span className="tag tag-gray" style={{ boxShadow: 'var(--shadow-sm)', fontSize: '13px', padding: '8px 16px' }}>🦀 Memory-Safe Love</span>
      </div>

      {/* Top Navigation */}
      <nav className="navbar" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div className="nav-brand">
          <span style={{ color: 'var(--rose)', fontSize: '24px', animation: 'heartpop 2.2s infinite', display: 'inline-block' }}>♥</span>
          <span className="grad-rose" style={{ fontSize: '22px', fontWeight: '800' }}>isITlove</span>
          <span style={{ fontSize: '11px', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--rose)', border: '1px solid rgba(244, 63, 94, 0.25)', padding: '2px 8px', borderRadius: '100px', fontWeight: '700', marginLeft: '4px' }}>
            romantic v2
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            type="button" 
            className="theme-toggle-btn" 
            onClick={toggleSound} 
            title={isMuted ? "Unmute Sound 🔊" : "Mute Sound 🔇"}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          <button 
            type="button" 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <Link to="/app/discover" className="btn btn-rose">
              Enter App →
            </Link>
          ) : (
            <>
              <button 
                type="button" 
                className="btn btn-ghost" 
                onClick={handleQuickDemo}
                disabled={loggingIn}
              >
                {loggingIn ? 'Connecting...' : '⚡ Quick Demo'}
              </button>
              <Link to="/login" className="btn btn-ghost">Log In</Link>
              <Link to="/signup" className="btn btn-rose">Start Luv</Link>
            </>
          )}
        </div>
      </nav>

      {/* =========================================================================
          HERO SECTION WITH LIVE INTERACTIVE SWIPE CARD SIMULATOR
          ========================================================================= */}
      <main className="hero" style={{ paddingTop: '135px', paddingBottom: '70px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px', alignItems: 'center', marginBottom: '80px' }}>
            {/* Left Hero Pitch */}
            <div style={{ textAlign: 'left' }}>
              <div className="slide-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '100px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.25)', color: 'var(--rose)', fontSize: '13.5px', fontWeight: '700', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
                <span>♥</span> The Matchmaking Platform for Developers
              </div>

              <h1 className="slide-up" style={{ animationDelay: '0.1s', fontSize: 'clamp(40px, 5.5vw, 68px)', fontWeight: '800', lineHeight: 1.12, letterSpacing: '-0.04em', marginBottom: '22px' }}>
                Where Code Meets <span className="grad-mix">isITlove.</span>
              </h1>

              <p className="slide-up" style={{ animationDelay: '0.2s', fontSize: 'clamp(16px, 1.8vw, 20px)', color: 'var(--t2)', lineHeight: 1.6, marginBottom: '36px' }}>
                Match by tech stack synergy, GitHub streaks, LeetCode ratings, and genuine developer vibes. No awkward small talk — start with code reviews and warm coffee ☕.
              </p>

              <div className="slide-up" style={{ animationDelay: '0.3s', display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <Link to="/signup" className="btn btn-rose btn-lg">
                  Create Profile & Start Pairing →
                </Link>
                <button 
                  type="button" 
                  className="btn btn-cyan btn-lg"
                  onClick={handleQuickDemo}
                  disabled={loggingIn}
                >
                  {loggingIn ? 'Loading demo...' : '✨ Try Live Demo Persona'}
                </button>
              </div>

              <div className="slide-up" style={{ animationDelay: '0.35s', display: 'flex', alignItems: 'center', gap: '18px', color: 'var(--t3)', fontSize: '13.5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--green)', fontWeight: '800' }}>✓</span> 100% Developer Verified
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--green)', fontWeight: '800' }}>✓</span> 0 Merge Conflicts
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--rose)', fontWeight: '800' }}>♥</span> 3,890+ Merged Pairs
                </div>
              </div>
            </div>

            {/* Right Interactive Hero Card Simulator */}
            <div className="slide-up" style={{ animationDelay: '0.25s', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-24px', right: '16px', background: 'var(--bg2)', border: '1px solid var(--brd)', padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: '700', color: 'var(--cyan)', zIndex: 10, fontFamily: 'var(--mono)' }}>
                🎮 Interactive Live Preview
              </div>

              {/* Sample Card Box */}
              <div 
                className="profile-card spring-in"
                key={currentProfile.name}
                style={{ 
                  maxWidth: '440px', 
                  margin: '0 auto', 
                  boxShadow: 'var(--shadow-lg), 0 0 35px rgba(244, 63, 94, 0.15)',
                  transform: heroFeedback === 'passed' ? 'translateX(-80px) rotate(-10deg) scale(0.95)' : heroFeedback === 'liked' ? 'translateX(80px) rotate(10deg) scale(0.95)' : 'none',
                  transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                {heroFeedback && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: heroFeedback === 'passed' ? 'auto' : '20px',
                      left: heroFeedback === 'passed' ? '20px' : 'auto',
                      zIndex: 30,
                      padding: '8px 20px',
                      borderRadius: '100px',
                      fontSize: '16px',
                      fontWeight: '800',
                      fontFamily: 'var(--mono)',
                      border: '2px solid',
                      borderColor: heroFeedback === 'passed' ? 'var(--red)' : 'var(--rose)',
                      color: heroFeedback === 'passed' ? 'var(--red)' : 'white',
                      background: heroFeedback === 'passed' ? 'rgba(239, 68, 68, 0.18)' : 'var(--rose)',
                      boxShadow: 'var(--shadow-glow)'
                    }}
                  >
                    {heroFeedback === 'passed' ? 'PASS ✕' : 'MERGE ♥'}
                  </div>
                )}

                <div className="card-hero" style={{ height: '190px' }}>
                  <div className="card-avatar" style={{ fontSize: '72px' }}>{currentProfile.emoji}</div>
                  <div className="card-hero-info">
                    <h2 style={{ fontSize: '22px' }}>
                      {currentProfile.name}, {currentProfile.age}
                      <span style={{ color: 'var(--cyan)', fontSize: '18px', marginLeft: '6px' }}>✓</span>
                    </h2>
                    <p style={{ fontSize: '13px' }}>{currentProfile.role} at {currentProfile.company}</p>
                  </div>
                </div>

                <div className="compat-bar" style={{ padding: '8px', fontSize: '12px' }}>
                  <span style={{ animation: 'heartpop 2s infinite', display: 'inline-block' }}>✨</span>
                  <span>98.6% Tech Compatibility Synergy</span>
                </div>

                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                  <p style={{ fontSize: '13.5px', color: 'var(--t2)', lineHeight: 1.5 }}>
                    {currentProfile.bio}
                  </p>

                  <div className="tags-row">
                    {currentProfile.stack.map(s => (
                      <span key={s} className="tag tag-cyan" style={{ fontSize: '11px', padding: '4px 10px' }}>⚡ {s}</span>
                    ))}
                  </div>

                  <div style={{ background: 'var(--bg2)', padding: '12px', borderRadius: '10px', border: '1px solid var(--brd)', fontSize: '12.5px', color: 'var(--t1)' }}>
                    <strong>Prompt:</strong> "{currentProfile.prompt}"
                  </div>

                  {/* Simulator Controls */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                    <button 
                      type="button" 
                      className="btn btn-ghost" 
                      style={{ flex: 1, color: 'var(--red)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      onClick={() => handleHeroSwipe('pass')}
                    >
                      ✕ Pass
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-rose" 
                      style={{ flex: 2 }}
                      onClick={() => handleHeroSwipe('like')}
                    >
                      ♥ Clean Merge
                    </button>
                  </div>
                </div>
              </div>

              {/* Sample Match Banner */}
              {heroMatched && (
                <div className="slide-up" style={{ marginTop: '16px', background: 'rgba(5, 150, 105, 0.12)', border: '1px solid var(--green)', padding: '10px 16px', borderRadius: '12px', color: 'var(--green)', fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                  🎉 Clean merge created with {currentProfile.name}! Try the full app to chat in real-time.
                </div>
              )}
            </div>
          </div>

          {/* =========================================================================
              INTERACTIVE TECH SYNERGY SANDBOX CALCULATOR
              ========================================================================= */}
          <div className="slide-up" style={{ maxWidth: '920px', margin: '0 auto 90px' }}>
            <div className="glass-panel" style={{ padding: '36px 30px', textAlign: 'center', border: '1px solid var(--brd-glow)', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--cyan)', fontSize: '12.5px', fontWeight: '700', marginBottom: '14px' }}>
                <span>⚡</span> Interactive Synergy Matrix Calculator
              </div>

              <h2 style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                Test Your <span className="grad-mix">Tech Stack Synergy</span>
              </h2>
              <p style={{ color: 'var(--t3)', fontSize: '14.5px', marginBottom: '28px', maxWidth: '520px', margin: '0 auto 28px' }}>
                Select your primary language/framework and your ideal partner's stack to simulate pairing compatibility.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '28px' }}>
                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--t3)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Your Primary Stack</label>
                  <select 
                    className="form-input" 
                    value={myStack} 
                    onChange={e => setMyStack(e.target.value)}
                    style={{ minWidth: '170px', fontWeight: '700' }}
                  >
                    <option value="TypeScript">TypeScript</option>
                    <option value="React">React</option>
                    <option value="Rust">Rust</option>
                    <option value="Python">Python</option>
                    <option value="Go">Go</option>
                  </select>
                </div>

                <div style={{ fontSize: '24px', color: 'var(--rose)', marginTop: '20px', animation: 'heartpop 2s infinite', display: 'inline-block' }}>♥</div>

                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--t3)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Partner's Stack</label>
                  <select 
                    className="form-input" 
                    value={matchStack} 
                    onChange={e => setMatchStack(e.target.value)}
                    style={{ minWidth: '170px', fontWeight: '700' }}
                  >
                    <option value="Go">Go</option>
                    <option value="Rust">Rust</option>
                    <option value="React">React</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="Python">Python</option>
                  </select>
                </div>
              </div>

              {/* Calculated Score Display */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', background: 'var(--bg2)', padding: '14px 28px', borderRadius: '100px', border: '1px solid var(--brd)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--cyan)', fontFamily: 'var(--mono)' }}>
                  {calculateSynergy()}%
                </div>
                <div style={{ textAlign: 'left', fontSize: '13px' }}>
                  <div style={{ fontWeight: '800', color: 'var(--t1)' }}>High-Frequency Synergy Power Team 🚀</div>
                  <div style={{ color: 'var(--t3)' }}>0 Merge Conflicts • Fast-Forward Ready</div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              "OUR GIT ROMANCE" COMMIT TIMELINE
              ========================================================================= */}
          <div className="slide-up" style={{ maxWidth: '880px', margin: '0 auto 90px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--rose)', fontSize: '12.5px', fontWeight: '700', marginBottom: '14px' }}>
              <span>🐙</span> How Love Compiles on isITlove
            </div>

            <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '10px' }}>
              Our Future <span className="grad-rose">Git Commit History</span>
            </h2>
            <p style={{ color: 'var(--t3)', fontSize: '15px', marginBottom: '36px' }}>
              From initial commit to shipping startups and happily ever after.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
              {GIT_ROMANCE_COMMITS.map((c, i) => (
                <div 
                  key={c.hash}
                  className="glass-panel"
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap',
                    borderLeft: i === GIT_ROMANCE_COMMITS.length - 1 ? '4px solid var(--rose)' : '4px solid var(--cyan)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '12px', background: 'var(--bg2)', padding: '4px 10px', borderRadius: '6px', fontFamily: 'var(--mono)', color: 'var(--t3)', fontWeight: '700' }}>
                      {c.hash}
                    </span>
                    <span style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--t1)' }}>
                      {c.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12.5px', color: 'var(--t3)', fontFamily: 'var(--mono)' }}>
                    <span>👤 {c.author}</span>
                    <span style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--rose)', padding: '2px 8px', borderRadius: '100px', fontWeight: '700' }}>{c.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================================
              COMMUNITY TESTIMONIALS & REVIEWS
              ========================================================================= */}
          <div className="slide-up" style={{ maxWidth: '1040px', margin: '0 auto 90px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--violet)', fontSize: '12.5px', fontWeight: '700', marginBottom: '14px' }}>
                <span>💬</span> Real Tech Couples
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em' }}>
                Clean Merges <span className="grad-mix">in the Wild</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {COMMUNITY_STORIES.map((story, i) => (
                <div key={i} className="glass-panel glass-panel-hover" style={{ padding: '28px 24px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '28px' }}>
                        <span>{story.avatar1}</span>
                        <span style={{ color: 'var(--rose)', fontSize: '16px' }}>♥</span>
                        <span>{story.avatar2}</span>
                      </div>
                      <span className="tag tag-rose" style={{ fontSize: '11px', padding: '3px 10px' }}>{story.compat}</span>
                    </div>

                    <p style={{ fontSize: '14px', color: 'var(--t2)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '20px' }}>
                      "{story.quote}"
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--brd)', paddingTop: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '800' }}>{story.names}</div>
                    <div style={{ fontSize: '12px', color: 'var(--t3)' }}>{story.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================================
              CALL TO ACTION BANNER
              ========================================================================= */}
          <div className="slide-up" style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
            <div className="glass-panel" style={{ padding: '52px 30px', background: 'radial-gradient(circle at 50% 10%, rgba(244, 63, 94, 0.16), var(--bg1) 85%)', border: '2px solid var(--rose)', boxShadow: '0 0 45px rgba(244, 63, 94, 0.25)' }}>
              <div style={{ fontSize: '54px', marginBottom: '14px', animation: 'heartpop 2s infinite', display: 'inline-block' }}>♥</div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '14px' }}>
                Ready to Find Your <span className="grad-rose">Clean Merge?</span>
              </h2>
              <p style={{ color: 'var(--t2)', fontSize: '16px', maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.6 }}>
                Join over 14,000 developers who stopped swiping on basic dating apps and started connecting over code on isITlove.
              </p>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/signup" className="btn btn-rose btn-lg" style={{ padding: '16px 36px', fontSize: '16.5px' }}>
                  Create Free Account →
                </Link>
                <button 
                  type="button" 
                  className="btn btn-cyan btn-lg"
                  onClick={handleQuickDemo}
                  disabled={loggingIn}
                >
                  ⚡ Try Live Demo Persona
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '50px 20px', textAlign: 'center', borderTop: '1px solid var(--brd)', color: 'var(--t3)', fontSize: '13.5px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '10px', fontSize: '16px', fontWeight: '800', color: 'var(--t1)' }}>
          <span style={{ color: 'var(--rose)', animation: 'heartpop 2s infinite', display: 'inline-block' }}>♥</span> isITlove
        </div>
        <p>© 2026 isITlove. Crafted with love for developers worldwide.</p>
      </footer>
    </div>
  );
}
