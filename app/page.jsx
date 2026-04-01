'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e?.preventDefault()
    if (!email.trim() || !email.includes('@')) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <main style={{ fontFamily: "'Syne', sans-serif", minHeight: '100vh', background: '#080c14', color: '#f0f2f8', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #080c14;
          --bg2: #0d1220;
          --bg3: #111827;
          --ink: #f0f2f8;
          --ink2: #8892a4;
          --ink3: #4a5568;
          --blue: #2563eb;
          --blue-bright: #3b82f6;
          --blue-glow: rgba(37,99,235,0.18);
          --border: rgba(240,242,248,0.07);
        }

        /* Nav */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 1.25rem 2.5rem;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.2rem;
          color: var(--ink); letter-spacing: -0.02em;
        }
        .nav-logo span { color: var(--blue-bright); }
        .nav-garage {
          font-size: 0.8rem; color: var(--ink2);
          text-decoration: none;
          padding: 0.4rem 0.9rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          transition: all 0.2s;
        }
        .nav-garage:hover { border-color: rgba(240,242,248,0.2); color: var(--ink); }

        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 7rem 1.5rem 5rem;
          position: relative;
          overflow: hidden;
        }

        /* Background orb */
        .hero::before {
          content: '';
          position: absolute;
          top: -20%; left: 50%; transform: translateX(-50%);
          width: 800px; height: 800px;
          background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        /* Subtle grid */
        .hero::after {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(240,242,248,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(240,242,248,0.025) 1px, transparent 1px);
          background-size: 72px 72px;
          pointer-events: none;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 0%, transparent 100%);
        }

        .hero-inner {
          position: relative; z-index: 1;
          max-width: 720px; width: 100%;
        }

        /* Live pill */
        .live-pill {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: rgba(37,99,235,0.12);
          border: 1px solid rgba(37,99,235,0.25);
          border-radius: 20px; padding: 0.35rem 1rem;
          font-size: 0.75rem; font-weight: 600;
          color: var(--blue-bright);
          letter-spacing: 0.04em;
          margin-bottom: 2.5rem;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.1s;
        }
        .pulse-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--blue-bright);
          position: relative; flex-shrink: 0;
        }
        .pulse-dot::after {
          content: '';
          position: absolute; inset: -3px;
          border-radius: 50%;
          background: var(--blue-bright);
          opacity: 0.4;
          animation: ripple 2s ease-out infinite;
        }

        /* Headline */
        .headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(3.2rem, 9vw, 7rem);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.03em;
          color: var(--ink);
          margin-bottom: 1.5rem;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.2s;
        }
        .headline .accent {
          color: var(--blue-bright);
        }
        .headline .dim {
          color: var(--ink2);
        }

        /* Subtext */
        .subtext {
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          font-weight: 400;
          color: var(--ink2);
          max-width: 460px;
          margin: 0 auto 2.75rem;
          line-height: 1.65;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.3s;
        }

        /* Email form */
        .form-wrap {
          max-width: 420px; margin: 0 auto;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.4s;
        }
        .email-row {
          display: flex; gap: 0;
          background: rgba(240,242,248,0.05);
          border: 1px solid rgba(240,242,248,0.12);
          border-radius: 10px; overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .email-row:focus-within {
          border-color: rgba(59,130,246,0.5);
          box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
        }
        .email-input {
          flex: 1; background: transparent;
          border: none; outline: none;
          padding: 0.9rem 1.1rem;
          color: var(--ink); font-size: 0.9rem;
          font-family: 'Syne', sans-serif;
        }
        .email-input::placeholder { color: var(--ink3); }
        .email-btn {
          background: var(--blue);
          border: none; padding: 0.9rem 1.4rem;
          color: #fff; font-weight: 700; font-size: 0.85rem;
          cursor: pointer; transition: background 0.2s;
          font-family: 'Syne', sans-serif;
          white-space: nowrap; letter-spacing: 0.02em;
        }
        .email-btn:hover { background: var(--blue-bright); }
        .email-btn:disabled { background: var(--ink3); cursor: not-allowed; }

        .form-note {
          font-size: 0.72rem; color: var(--ink3);
          margin-top: 0.75rem; letter-spacing: 0.02em;
        }

        /* Success state */
        .success-wrap {
          display: flex; align-items: center; justify-content: center;
          gap: 0.75rem;
          background: rgba(37,99,235,0.1);
          border: 1px solid rgba(37,99,235,0.25);
          border-radius: 10px; padding: 1rem 1.5rem;
          opacity: 0; animation: fadeUp 0.4s ease forwards;
        }
        .success-icon {
          width: 28px; height: 28px;
          background: var(--blue);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; flex-shrink: 0;
        }
        .success-text { font-size: 0.9rem; color: var(--ink); font-weight: 500; }

        /* Stats */
        .stats-section {
          border-top: 1px solid var(--border);
          padding: 4rem 1.5rem;
        }
        .stats-inner {
          max-width: 720px; margin: 0 auto;
          display: flex; justify-content: center;
          gap: 0; flex-wrap: wrap;
        }
        .stat-block {
          text-align: center;
          padding: 1rem 3.5rem;
          border-right: 1px solid var(--border);
        }
        .stat-block:last-child { border-right: none; }
        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 2.2rem; font-weight: 800;
          color: var(--ink); line-height: 1;
          letter-spacing: -0.03em;
        }
        .stat-num span { color: var(--blue-bright); }
        .stat-desc {
          font-size: 0.72rem; color: var(--ink3);
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-top: 0.35rem; font-weight: 600;
        }

        /* How it works */
        .how-section {
          background: var(--bg2);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 5rem 1.5rem;
        }
        .how-inner { max-width: 820px; margin: 0 auto; }
        .section-label {
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.18em; color: var(--blue-bright);
          text-transform: uppercase; margin-bottom: 1rem;
          text-align: center;
        }
        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 800; color: var(--ink);
          text-align: center; margin-bottom: 3rem;
          line-height: 1.1; letter-spacing: -0.02em;
        }
        .how-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 12px; overflow: hidden;
        }
        .how-card {
          background: var(--bg2); padding: 2rem;
          transition: background 0.2s;
        }
        .how-card:hover { background: var(--bg3); }
        .how-num {
          font-family: 'Syne', sans-serif;
          font-size: 2.5rem; font-weight: 800;
          color: rgba(59,130,246,0.15); line-height: 1;
          margin-bottom: 1rem; letter-spacing: -0.03em;
        }
        .how-title {
          font-weight: 700; font-size: 0.95rem;
          color: var(--ink); margin-bottom: 0.4rem;
        }
        .how-desc { font-size: 0.83rem; color: var(--ink2); line-height: 1.65; }

        /* For garages */
        .garage-strip {
          padding: 4rem 1.5rem; text-align: center;
          position: relative; overflow: hidden;
        }
        .garage-strip::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(37,99,235,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .garage-strip-inner { max-width: 560px; margin: 0 auto; position: relative; }
        .garage-label {
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.18em; color: var(--ink3);
          text-transform: uppercase; margin-bottom: 1rem;
        }
        .garage-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 800; color: var(--ink);
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em; line-height: 1.15;
        }
        .garage-sub {
          color: var(--ink2); font-size: 0.875rem;
          margin-bottom: 1.5rem; line-height: 1.6;
        }
        .garage-btn {
          display: inline-block;
          background: transparent;
          border: 1px solid rgba(240,242,248,0.2);
          color: var(--ink); padding: 0.7rem 1.75rem;
          border-radius: 8px; font-weight: 700;
          font-size: 0.875rem; text-decoration: none;
          font-family: 'Syne', sans-serif;
          transition: all 0.2s;
          letter-spacing: 0.01em;
        }
        .garage-btn:hover { border-color: rgba(240,242,248,0.5); background: rgba(240,242,248,0.05); }

        /* Footer */
        footer {
          border-top: 1px solid var(--border);
          padding: 1.75rem 2.5rem;
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 1rem;
        }
        .footer-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 0.95rem;
          color: var(--ink); letter-spacing: -0.02em;
        }
        .footer-logo span { color: var(--blue-bright); }
        .footer-text { font-size: 0.72rem; color: var(--ink3); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ripple {
          0%   { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(3); opacity: 0; }
        }

        @media (max-width: 600px) {
          .nav { padding: 1rem 1.25rem; }
          .stat-block { padding: 0.75rem 2rem; border-right: none; border-bottom: 1px solid var(--border); }
          .stat-block:last-child { border-bottom: none; }
          footer { flex-direction: column; text-align: center; }
        }
      `}</style>

      {/* Nav */}
      <nav className="nav">
        <div className="nav-logo">MOT<span>match</span></div>
        <a href="/garages" className="nav-garage">For Garages →</a>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">

          <div className="live-pill">
            <span className="pulse-dot" />
            Live in Brighton · Coming to your area soon
          </div>

          <h1 className="headline">
            Your MOT.<br />
            <span className="accent">Sorted.</span>
          </h1>

          <p className="subtext">
            Launching soon for drivers across the UK — join the waitlist and get early access when we go live in your area.
          </p>

          <div className="form-wrap">
            {!submitted ? (
              <>
                <form onSubmit={handleSubmit}>
                  <div className="email-row">
                    <input
                      className="email-input"
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                    <button
                      className="email-btn"
                      type="submit"
                      disabled={loading || !email.includes('@')}
                    >
                      {loading ? 'Adding you...' : 'Get Early Access'}
                    </button>
                  </div>
                </form>
                <p className="form-note">No spam. One email when we launch near you.</p>
              </>
            ) : (
              <div className="success-wrap">
                <div className="success-icon">✓</div>
                <p className="success-text">You're on the list. We'll be in touch.</p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Stats */}
      <div className="stats-section">
        <div className="stats-inner">
          {[
            { num: '16,000', unit: '+', desc: 'UK Garages' },
            { num: '100', unit: '%', desc: 'Independent' },
            { num: 'Free', unit: '', desc: 'To Use' },
          ].map(s => (
            <div key={s.desc} className="stat-block">
              <div className="stat-num">{s.num}<span>{s.unit}</span></div>
              <div className="stat-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="how-section">
        <div className="how-inner">
          <p className="section-label">How it works</p>
          <h2 className="section-title">Finding a garage<br />takes seconds.</h2>
          <div className="how-grid">
            {[
              { n: '01', title: 'Tell us what you need', desc: 'MOT, service, repair — type it in plain English. No forms, no dropdowns.' },
              { n: '02', title: 'We find your garage', desc: 'Matched from 16,000+ DVSA-approved independent garages near you.' },
              { n: '03', title: 'Booked. Done.', desc: 'Call directly or book online. Free. No hidden fees. No middleman.' },
            ].map(h => (
              <div key={h.n} className="how-card">
                <div className="how-num">{h.n}</div>
                <div className="how-title">{h.title}</div>
                <div className="how-desc">{h.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* For garages */}
      <div className="garage-strip">
        <div className="garage-strip-inner">
          <p className="garage-label">For garage owners</p>
          <h2 className="garage-title">Already built your listing.<br />Just waiting for you.</h2>
          <p className="garage-sub">
            We've created free listings for thousands of independent UK garages.
            Claim yours before a competitor does.
          </p>
          <a href="/garages" className="garage-btn">Claim Your Free Listing →</a>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-logo">MOT<span>match</span></div>
        <p className="footer-text">Helping UK drivers find trusted local garages</p>
        <p className="footer-text">© {new Date().getFullYear()} MOTmatch</p>
      </footer>

    </main>
  )
}
