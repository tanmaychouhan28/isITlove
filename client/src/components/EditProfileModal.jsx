import React, { useState } from 'react';
import { api } from '../context/AuthContext';

const EMOJIS = ['👨‍💻', '👩‍💻', '🧑‍💻', '🤖', '👾', '🦊', '🐱', '🐶', '🦄', '🐲', '🦉', '🚀'];
const POPULAR_STACK = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'FastAPI', 'PyTorch', 'Go', 'Rust', 'Java', 'C++', 'Swift', 'Flutter', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'Tailwind'];

const EditProfileModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    age: user.age || 22,
    emoji: user.emoji || '👨‍💻',
    avatarUrl: user.avatarUrl || '',
    role: user.role || 'Student',
    company: user.company || '',
    location: user.location || '',
    bio: user.bio || '',
    stack: user.stack || [],
    ghUrl: user.ghUrl || (user.ghUser ? `https://github.com/${user.ghUser}` : ''),
    ghUser: user.ghUser || '',
    lcUrl: user.lcUrl || (user.lcUser ? `https://leetcode.com/u/${user.lcUser}/` : ''),
    lcUser: user.lcUser || '',
    liUrl: user.liUrl || (user.liUser ? `https://www.linkedin.com/in/${user.liUser}/` : ''),
    liUser: user.liUser || '',
    prompts: user.prompts?.length ? user.prompts : [
      { q: 'The side project I\'m most proud of...', a: '' },
      { q: 'My coding superpower is...', a: '' }
    ],
    intention: user.intention || 'Pair programming partner'
  });

  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisMsg, setAnalysisMsg] = useState('');
  const [customTech, setCustomTech] = useState('');

  const toggleStack = (tech) => {
    setFormData(prev => ({
      ...prev,
      stack: prev.stack.includes(tech)
        ? prev.stack.filter(t => t !== tech)
        : [...prev.stack, tech]
    }));
  };

  const addCustomTech = () => {
    if (customTech.trim() && !formData.stack.includes(customTech.trim())) {
      setFormData(prev => ({
        ...prev,
        stack: [...prev.stack, customTech.trim()]
      }));
      setCustomTech('');
    }
  };

  const handlePromptChange = (idx, field, val) => {
    const updated = [...formData.prompts];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData(prev => ({ ...prev, prompts: updated }));
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setAnalysisMsg('');
    try {
      const res = await api.post('/users/analyze', {
        ghUrl: formData.ghUrl,
        lcUrl: formData.lcUrl,
        liUrl: formData.liUrl
      });
      if (res.data?.analysis) {
        setAnalysisMsg(`✓ Live Analysis Complete! DevScore: ${res.data.user?.devScore || res.data.analysis.overall?.devScore}`);
      }
    } catch (err) {
      setAnalysisMsg('Failed to run live analysis. Please check your URLs.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      alert('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div 
      className="fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8, 13, 26, 0.88)',
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
          maxWidth: '680px',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--brd2)',
          padding: '32px 28px',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Edit Developer Profile</h2>
            <p style={{ color: 'var(--t3)', fontSize: '13.5px', marginTop: '2px' }}>
              Update your profile photo, LinkedIn/GitHub links & developer details
            </p>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>✕ Close</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profile Photo URL & Avatar Preview */}
          <div className="form-group" style={{ background: 'var(--bg2)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--brd)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span>📸</span> Profile Avatar & Photo (LinkedIn / Custom Image URL)
            </label>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg1)', border: '2px solid var(--rose)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
                {formData.avatarUrl ? (
                  <img 
                    src={formData.avatarUrl} 
                    alt="Avatar" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <span>{formData.emoji || '👨‍💻'}</span>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Paste LinkedIn photo URL or any image link (https://...)" 
                  value={formData.avatarUrl}
                  onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {formData.avatarUrl && (
                    <button 
                      type="button" 
                      className="btn btn-ghost btn-sm" 
                      style={{ fontSize: '11px', padding: '2px 8px' }}
                      onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                    >
                      ✕ Use Emoji Instead
                    </button>
                  )}
                  <span style={{ fontSize: '11.5px', color: 'var(--t3)', alignSelf: 'center' }}>
                    Tip: Right-click your LinkedIn photo → "Copy Image Address" & paste here
                  </span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '8px' }}>Or pick a fallback Emoji avatar:</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {EMOJIS.map(e => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setFormData({ ...formData, emoji: e })}
                  style={{
                    fontSize: '20px',
                    padding: '6px 10px',
                    background: formData.emoji === e ? 'rgba(244, 63, 94, 0.2)' : 'var(--bg1)',
                    border: formData.emoji === e ? '2px solid var(--rose)' : '1px solid var(--brd)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transform: formData.emoji === e ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.age} 
                onChange={e => setFormData({ ...formData, age: Number(e.target.value) })} 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Job Title / Role</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Student / Full Stack Dev"
                value={formData.role} 
                onChange={e => setFormData({ ...formData, role: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Company / University</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. University or Startup"
                value={formData.company} 
                onChange={e => setFormData({ ...formData, company: e.target.value })} 
              />
            </div>
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

          {/* Multi-Platform Developer Profiles Section */}
          <div style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06) 0%, rgba(139, 92, 246, 0.06) 100%)', border: '1px solid var(--brd2)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>⚡</span>
                <span style={{ fontSize: '15px', fontWeight: '800' }}>Multi-Platform Profile Links & Analysis</span>
              </div>
              <button 
                type="button" 
                className="btn btn-ghost btn-sm"
                onClick={handleRunAnalysis}
                disabled={analyzing}
                style={{ borderColor: 'var(--cyan)', color: 'var(--cyan)', fontSize: '12px', fontWeight: '700' }}
              >
                {analyzing ? '⏳ Analyzing Platforms...' : '⚡ Test Live Analysis'}
              </button>
            </div>

            {analysisMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--green)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 12px', borderRadius: '6px', fontSize: '12.5px', marginBottom: '14px' }}>
                {analysisMsg}
              </div>
            )}

            {/* GitHub URL */}
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🐙</span> GitHub Profile URL or Username
              </label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="https://github.com/yourhandle"
                value={formData.ghUrl} 
                onChange={e => setFormData({ ...formData, ghUrl: e.target.value })} 
              />
            </div>

            {/* LeetCode URL */}
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>💡</span> LeetCode Profile URL or Username
              </label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="https://leetcode.com/u/yourhandle/"
                value={formData.lcUrl} 
                onChange={e => setFormData({ ...formData, lcUrl: e.target.value })} 
              />
            </div>

            {/* LinkedIn URL */}
            <div className="form-group" style={{ marginBottom: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>💼</span> LinkedIn Profile URL or Handle
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

          <div className="form-group">
            <label>Bio</label>
            <textarea 
              className="form-input" 
              rows="3" 
              placeholder="Tell others what you build and what you love..."
              value={formData.bio} 
              onChange={e => setFormData({ ...formData, bio: e.target.value })} 
            />
          </div>

          {/* Tech Stack */}
          <div className="form-group">
            <label>Tech Stack</label>
            <div className="tags-row" style={{ marginBottom: '12px' }}>
              {POPULAR_STACK.map(tech => (
                <span 
                  key={tech} 
                  className={`tag ${formData.stack.includes(tech) ? 'active' : 'tag-gray'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleStack(tech)}
                >
                  {tech}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Add custom tech (e.g. FastAPI, Tailwind)..."
                value={customTech}
                onChange={e => setCustomTech(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTech(); } }}
              />
              <button type="button" className="btn btn-ghost" onClick={addCustomTech}>+ Add</button>
            </div>
          </div>

          {/* Coding Prompts */}
          <div className="form-group">
            <label>Developer Prompts</label>
            {formData.prompts.map((p, idx) => (
              <div key={idx} style={{ background: 'var(--bg2)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--brd)', marginBottom: '12px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ marginBottom: '10px', fontSize: '13.5px', fontWeight: '700' }}
                  value={p.q} 
                  onChange={e => handlePromptChange(idx, 'q', e.target.value)} 
                />
                <textarea 
                  className="form-input" 
                  rows="2" 
                  placeholder="Your answer..."
                  value={p.a} 
                  onChange={e => handlePromptChange(idx, 'a', e.target.value)} 
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '28px' }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-rose" style={{ flex: 2 }} disabled={saving}>
              {saving ? 'Saving changes...' : 'Save Profile & Update Analysis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

