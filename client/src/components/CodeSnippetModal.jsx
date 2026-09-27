import React, { useState } from 'react';

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'rust', 'go', 'html', 'css', 'sql', 'cpp', 'java'
];

const CODE_PRESETS = [
  { label: 'React Hook', lang: 'javascript', code: `const [isPaired, setIsPaired] = useState(true);\nuseEffect(() => {\n  console.log("Ready to ship together!");\n}, []);` },
  { label: 'Python Synergy', lang: 'python', code: `def match_score(a, b):\n    return len(set(a.stack) & set(b.stack)) * 100` },
  { label: 'Rust Struct', lang: 'rust', code: `pub struct DevPair {\n    pub matched: bool,\n    pub latency_ms: u32,\n}` }
];

const CodeSnippetModal = ({ onSend, onClose }) => {
  const [lang, setLang] = useState('javascript');
  const [code, setCode] = useState('');
  const [note, setNote] = useState('');

  const handlePreset = (preset) => {
    setLang(preset.lang);
    setCode(preset.code);
  };

  const handleSend = () => {
    if (!code.trim()) return;
    onSend({
      text: note || `Shared a ${lang} snippet`,
      type: 'code',
      codeLang: lang,
      codeContent: code.trim()
    });
    onClose();
  };

  return (
    <div 
      className="fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8, 13, 26, 0.85)',
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
          maxWidth: '560px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--brd2)',
          padding: '32px 28px',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡</span> Share Code Snippet
          </h3>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: 'var(--t3)', alignSelf: 'center', fontWeight: '700' }}>Presets:</span>
          {CODE_PRESETS.map((p, i) => (
            <button 
              key={i} 
              type="button" 
              className="btn btn-ghost btn-sm" 
              onClick={() => handlePreset(p)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="form-group" style={{ marginBottom: '14px' }}>
          <label>Language</label>
          <select 
            className="form-input" 
            value={lang} 
            onChange={e => setLang(e.target.value)}
          >
            {LANGUAGES.map(l => (
              <option key={l} value={l}>{l.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: '14px' }}>
          <label>Code</label>
          <textarea 
            className="form-input mono" 
            rows="6" 
            placeholder="// Paste or write your code snippet here..."
            value={code} 
            onChange={e => setCode(e.target.value)}
            style={{ fontSize: '13.5px', background: '#090e1a', color: '#38bdf8' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '22px' }}>
          <label>Optional Note</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g., What do you think of this architecture?" 
            value={note} 
            onChange={e => setNote(e.target.value)} 
          />
        </div>

        <div style={{ display: 'flex', gap: '14px' }}>
          <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-cyan" 
            style={{ flex: 2 }} 
            onClick={handleSend}
            disabled={!code.trim()}
          >
            Send Snippet 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetModal;
