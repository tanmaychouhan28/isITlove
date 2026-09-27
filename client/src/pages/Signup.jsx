import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PROMPTS = [
  "My most controversial coding opinion is...",
  "The bug that haunts my dreams...",
  "I'll know it's love when...",
  "My coding superpower is...",
  "The side project I'm most proud of...",
  "My relationship with documentation is...",
  "Looking for someone who...",
  "I geek out about...",
  "Green flags in a coding partner...",
  "My stack for a zombie apocalypse..."
];

const INTERESTS = [
  "Gaming", "Guitar", "Music", "Running", "Gym", "Hiking", 
  "Reading", "Photography", "Coffee", "Cooking", "Foodie", 
  "Movies", "Yoga", "Board games", "Travel", "Startups", "Investing", "Podcasts", "Sci-fi", "Chess"
];

const TECH_STACK = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", 
  "PyTorch", "TensorFlow", "Go", "Rust", "Java", "Spring Boot", 
  "C++", "C#", "Swift", "Flutter", "PostgreSQL", "MongoDB", 
  "Redis", "GraphQL", "Docker", "Kubernetes", "AWS", "Tailwind"
];

const EMOJIS = ['👨‍💻', '👩‍💻', '🧑‍💻', '🤖', '👽', '👾', '🦊', '🐱', '🐶', '🦄', '🐲', '🦉', '🚀'];

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: 22,
    location: '',
    emoji: '👨‍💻',
    role: 'Student / Developer',
    company: '',
    experience: 'Student / Early Career',
    stack: ['JavaScript', 'React', 'Node.js', 'Python'],
    ghUrl: '',
    ghUser: '',
    lcUrl: '',
    lcUser: '',
    liUrl: '',
    liUser: '',
    ghContrib: 0,
    lcSolved: 0,
    lcRating: 0,
    prompts: [
      { q: PROMPTS[4] || PROMPTS[0], a: '' },
      { q: PROMPTS[3] || PROMPTS[1], a: '' }
    ],
    bio: '',
    interests: ['Startups', 'Coffee', 'Gaming'],
    intention: 'Pair programming partner'
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in your name, email, and password.');
        return;
      }
    }
    setError('');
    setStep(s => Math.min(s + 1, 5));
  };

  const handleBack = () => {
    setError('');
    setStep(s => Math.max(s - 1, 1));
  };

  const toggleTech = (tech) => {
    setFormData(prev => ({
      ...prev,
      stack: prev.stack.includes(tech)
        ? prev.stack.filter(t => t !== tech)
        : [...prev.stack, tech]
    }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await signup(formData);
      navigate('/app/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    { num: 1, cmd: 'git init', desc: 'Basics & Identity' },
    { num: 2, cmd: 'git config', desc: 'Role & Experience' },
    { num: 3, cmd: 'git add', desc: 'Multi-Platform Profiles' },
    { num: 4, cmd: 'git commit', desc: 'Bio & Prompts' },
    { num: 5, cmd: 'git push', desc: 'Interests & Launch' }
  ];

  return (
    <div style={{ maxWidth: '640px', margin: '30px auto', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link to="/" className="nav-brand" style={{ display: 'inline-flex', marginBottom: '8px' }}>
            <span style={{ color: 'var(--rose)', fontSize: '24px', animation: 'heartpop 2s infinite', display: 'inline-block' }}>♥</span>
            <span className="grad-rose">DevPair</span>
          </Link>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Create Developer Profile</h2>
          <p style={{ fontSize: '13.5px', color: 'var(--t3)' }}>Step {step} of 5 — {stepTitles[step - 1].desc}</p>
        </div>

      {/* Git Step Progress Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', gap: '8px' }}>
        {stepTitles.map(st => (
          <div key={st.num} style={{ flex: 1, textAlign: 'center' }}>
            <div 
              style={{ 
                height: '4px', 
                background: st.num <= step ? 'var(--rose)' : 'var(--brd)', 
                borderRadius: '4px',
                marginBottom: '6px',
                transition: 'all 0.3s ease'
              }} 
            />
            <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: st.num === step ? 'var(--rosel)' : 'var(--t4)', fontWeight: '600' }}>
              {st.cmd}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '18px', fontSize: '13px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <div className="glass-panel slide-up" style={{ padding: '32px 28px' }}>
        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="fade-in">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ color: 'var(--rose)' }}>$ git init</span> Your Identity
            </h3>

            <div className="form-group">
              <label>Choose Avatar Emoji</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {EMOJIS.map(e => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setFormData({ ...formData, emoji: e })}
                    style={{
                      fontSize: '22px',
                      padding: '8px 10px',
                      background: formData.emoji === e ? 'rgba(244, 63, 94, 0.2)' : 'var(--card)',
                      border: formData.emoji === e ? '1px solid var(--rose)' : '1px solid var(--brd)',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Full Name or Handle</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Alex Morgan" 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="you@example.com" 
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={e => setFormData({ ...formData, password: e.target.value })} 
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label>Age</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={formData.age} 
                  onChange={e => setFormData({ ...formData, age: Number(e.target.value) })} 
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. India / Remote" 
                  value={formData.location} 
                  onChange={e => setFormData({ ...formData, location: e.target.value })} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Role & Experience */}
        {step === 2 && (
          <div className="fade-in">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ color: 'var(--cyan)' }}>$ git config</span> Career & Role
            </h3>

            <div className="form-group">
              <label>Your Role / Title</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Student / Full Stack Developer" 
                value={formData.role} 
                onChange={e => setFormData({ ...formData, role: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label>Company / University</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. University, Startup, or Indie" 
                value={formData.company} 
                onChange={e => setFormData({ ...formData, company: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label>Experience Level</label>
              <select 
                className="form-input" 
                value={formData.experience} 
                onChange={e => setFormData({ ...formData, experience: e.target.value })}
              >
                <option>Student / Early Career</option>
                <option>Junior (0-2 years)</option>
                <option>Mid-Level (2-5 years)</option>
                <option>Senior (5-10 years)</option>
                <option>Founder / CTO</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Tech Stack & Multi-Platform Profiles */}
        {step === 3 && (
          <div className="fade-in">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ color: 'var(--violet)' }}>$ git add</span> Multi-Platform Profiles
            </h3>

            <div className="form-group">
              <label>Primary Tech Stack</label>
              <div className="tags-row" style={{ marginTop: '6px' }}>
                {TECH_STACK.map(tech => (
                  <span 
                    key={tech} 
                    className={`tag ${formData.stack.includes(tech) ? 'active' : 'tag-gray'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleTech(tech)}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '20px', background: 'var(--bg2)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--brd)' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--cyan)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>⚡</span> Automated Analysis Platform Links
              </div>

              {/* GitHub */}
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🐙</span> GitHub Profile URL / Handle
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="https://github.com/yourhandle" 
                  value={formData.ghUrl} 
                  onChange={e => setFormData({ ...formData, ghUrl: e.target.value })} 
                />
              </div>

              {/* LeetCode */}
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>💡</span> LeetCode Profile URL / Handle
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="https://leetcode.com/u/yourhandle/" 
                  value={formData.lcUrl} 
                  onChange={e => setFormData({ ...formData, lcUrl: e.target.value })} 
                />
              </div>

              {/* LinkedIn */}
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>💼</span> LinkedIn Profile URL / Handle
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="https://www.linkedin.com/in/yourhandle/" 
                  value={formData.liUrl} 
                  onChange={e => setFormData({ ...formData, liUrl: e.target.value })} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Prompts */}
        {step === 4 && (
          <div className="fade-in">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ color: 'var(--amber)' }}>$ git commit</span> Developer Prompts
            </h3>


            <div className="form-group">
              <label>About You (Bio)</label>
              <textarea 
                className="form-input" 
                rows="3" 
                placeholder="What do you build, break, or obsess over?"
                value={formData.bio} 
                onChange={e => setFormData({ ...formData, bio: e.target.value })} 
              />
            </div>

            {formData.prompts.map((p, idx) => (
              <div key={idx} style={{ background: 'var(--card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--brd)', marginBottom: '14px' }}>
                <select 
                  className="form-input" 
                  style={{ marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}
                  value={p.q} 
                  onChange={e => {
                    const newP = [...formData.prompts];
                    newP[idx].q = e.target.value;
                    setFormData({ ...formData, prompts: newP });
                  }}
                >
                  {PROMPTS.map(pr => <option key={pr} value={pr}>{pr}</option>)}
                </select>
                <textarea 
                  className="form-input" 
                  rows="2" 
                  placeholder="Your answer..." 
                  value={p.a} 
                  onChange={e => {
                    const newP = [...formData.prompts];
                    newP[idx].a = e.target.value;
                    setFormData({ ...formData, prompts: newP });
                  }} 
                />
              </div>
            ))}
          </div>
        )}

        {/* Step 5: Interests & Launch */}
        {step === 5 && (
          <div className="fade-in">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ color: 'var(--green)' }}>$ git push</span> Ready for Production!
            </h3>

            <div className="form-group">
              <label>Interests & Hobbies</label>
              <div className="tags-row" style={{ marginTop: '6px' }}>
                {INTERESTS.map(i => (
                  <span 
                    key={i} 
                    className={`tag ${formData.interests.includes(i) ? 'active' : 'tag-gray'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleInterest(i)}
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label>Looking for</label>
              <select 
                className="form-input" 
                value={formData.intention} 
                onChange={e => setFormData({ ...formData, intention: e.target.value })}
              >
                <option>Long-term relationship</option>
                <option>Short-term / dating</option>
                <option>Pair programming partner</option>
                <option>Co-founder & friendship</option>
                <option>Just seeing who's out there</option>
              </select>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', gap: '12px' }}>
          {step > 1 ? (
            <button type="button" className="btn btn-ghost" onClick={handleBack}>
              ← Back
            </button>
          ) : (
            <Link to="/login" className="btn btn-ghost">
              Have an account? Log In
            </Link>
          )}

          {step < 5 ? (
            <button type="button" className="btn btn-rose" onClick={handleNext}>
              Continue →
            </button>
          ) : (
            <button 
              type="button" 
              className="btn btn-rose btn-lg" 
              onClick={handleSubmit} 
              disabled={loading}
            >
              {loading ? 'Deploying profile...' : '🚀 Launch My Profile'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
