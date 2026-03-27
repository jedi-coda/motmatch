'use client';

import { useState } from 'react';

// ⚠️  Replace with your Formspree form ID.
// Sign up free at formspree.io → New Form → copy the ID from the endpoint URL.
// The form will email Za.akhtar@gmail.com on every submission.
const FORMSPREE_ID = 'mzdkbpzp';

const inputStyle = {
  width:           '100%',
  backgroundColor: '#0a0a0a',
  border:          '1px solid #2a2a2a',
  borderRadius:    '8px',
  padding:         '14px 16px',
  fontSize:        '0.95rem',
  color:           '#ffffff',
  outline:         'none',
  boxSizing:       'border-box',
  marginBottom:    '12px',
  display:         'block',
};

const labelStyle = {
  display:      'block',
  fontSize:     '0.78rem',
  fontWeight:   600,
  color:        '#888888',
  marginBottom: '6px',
  textAlign:    'left',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

export default function ClaimForm() {
  const [fields, setFields]   = useState({ name: '', garage: '', phone: '' });
  const [status, setStatus]   = useState('idle'); // idle | submitting | done | error

  function handleChange(e) {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(fields),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div
        style={{
          backgroundColor: 'rgba(34,197,94,0.08)',
          border:          '1px solid rgba(34,197,94,0.3)',
          borderRadius:    '12px',
          padding:         '32px 24px',
          textAlign:       'center',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✅</div>
        <p
          style={{
            fontSize:   '1.05rem',
            fontWeight: 600,
            color:      '#ffffff',
            lineHeight: 1.6,
            margin:     0,
          }}
        >
          Thanks! We&apos;ll be in touch within 2 hours to get your site live.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
      <div>
        <label htmlFor="name" style={labelStyle}>Your Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="e.g. John Smith"
          value={fields.name}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="garage" style={labelStyle}>Garage Name</label>
        <input
          id="garage"
          name="garage"
          type="text"
          required
          placeholder="e.g. Brighton MOT Centre"
          value={fields.garage}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="phone" style={labelStyle}>Your Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="e.g. 01273 000 000"
          value={fields.phone}
          onChange={handleChange}
          style={{ ...inputStyle, marginBottom: '20px' }}
        />
      </div>

      {status === 'error' && (
        <p style={{ fontSize: '0.85rem', color: '#f87171', marginBottom: '12px', textAlign: 'center' }}>
          Something went wrong — please try again or reply to this message.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        style={{
          width:           '100%',
          backgroundColor: status === 'submitting' ? '#166534' : '#22c55e',
          color:           '#000000',
          fontWeight:      800,
          fontSize:        '1rem',
          padding:         '17px 24px',
          borderRadius:    '8px',
          border:          'none',
          cursor:          status === 'submitting' ? 'not-allowed' : 'pointer',
          letterSpacing:   '0.01em',
          boxSizing:       'border-box',
        }}
      >
        {status === 'submitting' ? 'Sending…' : 'Claim My Launch Price →'}
      </button>
    </form>
  );
}
