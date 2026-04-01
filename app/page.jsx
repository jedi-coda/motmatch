'use client'

import { useState, useEffect, useRef } from 'react'

const CHIPS = [
  { icon: '🔧', label: 'Book my MOT' },
  { icon: '📍', label: 'Find a garage near me' },
  { icon: '💷', label: 'How much should my MOT cost?' },
  { icon: '📅', label: 'When is my MOT due?' },
  { icon: '⚡', label: 'My engine light is on' },
  { icon: '🛞', label: 'I need new tyres' },
]

const GREETINGS = [
  "Good morning.",
  "Good afternoon.",
  "Good evening.",
]

export default function Home() {
  const [greeting, setGreeting] = useState('')
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [dots, setDots] = useState(1)
  const inputRef = useRef(null)

  useEffect(() => {
    const h = new Date().getHours()
    if (h >= 5 && h < 12) setGreeting(GREETINGS[0])
    else if (h >= 12 && h < 18) setGreeting(GREETINGS[1])
    else setGreeting(GREETINGS[2])

    const dotsInterval = setInterval(() => {
      setDots(d => d === 3 ? 1 : d + 1)
    }, 500)
    return () => clearInterval(dotsInterval)
  }, [])

  function handleChip(label) {
    setInput(label)
    inputRef.current?.focus()
  }

  function handleSubmit(e) {
    e?.preventDefault()
    if (!input.trim()) return
    setSubmitted(true)
  }

  return (
    <main style={{ fontFamily: "'Epilogue', sans-serif", minHeight: '100vh', background: '#fafaf8', color: '#111', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@300;400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #fafaf8;
          --ink: #111111;
          --ink2: #555558;
          --ink3: #aaaaad;
          --blue: #1d4ed8;
          --blue2: #2563eb;
          --border: rgba(17,17,17,0.07);
          --shadow: 0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04);
          --shadow-lg: 0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.07);
        }

        /* Nav */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 1.25rem 2.5rem;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(250,250,248,0.9);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--border);
        }
        .nav-brand {
          display: flex; flex-direction: column; gap: 0;
        }
        .nav-logo {
          font-family: 'Epilogue', sans-serif;
          font-weight: 900; font-size: 1.1rem;
          color: var(--ink); letter-spacing: -0.03em;
          line-height: 1;
        }
        .nav-logo span { color: var(--blue2); }
        .nav-tagline {
          font-size: 0.65rem; color: var(--ink3);
          letter-spacing: 0.02em; margin-top: 2px;
        }
        .nav-links {
          display: flex; gap: 0.25rem; align-items: center;
        }
        .nav-link {
          font-size: 0.82rem; color: var(--ink2);
          text-decoration: none; padding: 0.4rem 0.75rem;
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
        }
        .nav-link:hover { background: rgba(17,17,17,0.05); color: var(--ink); }
        .nav-cta {
          background: var(--ink); color: #fff;
          padding: 0.42rem 1rem; border-radius: 6px;
          font-size: 0.82rem; font-weight: 600;
          text-decoration: none; transition: opacity 0.15s;
        }
        .nav-cta:hover { opacity: 0.85; }

        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 7rem 1.5rem 5rem;
        }
        .hero-inner {
          width: 100%; max-width: 640px;
          display: flex; flex-direction: column;
          align-items: center;
          text-align: center;
        }

        /* Giant greeting */
        .greeting {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(3.5rem, 10vw, 7rem);
          font-weight: 400;
          font-style: italic;
          color: var(--ink);
          line-height: 1.0;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
          opacity: 0; animation: fadeIn 0.6s ease forwards 0.05s;
        }
        .greeting-sub {
          font-size: clamp(0.9rem, 1.5vw, 1rem);
          color: var(--ink3); font-weight: 400;
          margin-bottom: 3rem;
          letter-spacing: 0.01em;
          opacity: 0; animation: fadeIn 0.5s ease forwards 0.2s;
        }

        /* Input */
        .input-wrap {
          width: 100%;
          opacity: 0; animation: fadeIn 0.5s ease forwards 0.3s;
        }
        .input-box {
          width: 100%;
          background: #fff;
          border: 1.5px solid var(--border);
          border-radius: 14px;
          padding: 0.9rem 0.9rem 0.9rem 1.25rem;
          display: flex; align-items: flex-end; gap: 0.6rem;
          box-shadow: var(--shadow-lg);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-box.focused {
          border-color: var(--blue2);
          box-shadow: 0 0 0 3px rgba(37,99,235,0.07), var(--shadow-lg);
        }
        .input-field {
          flex: 1;
          border: none; outline: none;
          font-family: 'Epilogue', sans-serif;
          font-size: 1rem; color: var(--ink);
          background: transparent;
          resize: none;
          min-height: 26px; max-height: 120px;
          line-height: 1.5;
        }
        .input-field::placeholder { color: var(--ink3); font-weight: 400; }
        .send-btn {
          width: 36px; height: 36px;
          background: var(--ink);
          border: none; border-radius: 9px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.15s, transform 0.1s;
          flex-shrink: 0;
        }
        .send-btn:hover { opacity: 0.8; transform: scale(1.04); }
        .send-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; }
        .send-icon {
          width: 15px; height: 15px;
          fill: none; stroke: #fff;
          stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
        }

        /* Chips */
        .chips-wrap {
          width: 100%; margin-top: 1rem;
          display: flex; flex-wrap: wrap; gap: 0.4rem;
          justify-content: center;
          opacity: 0; animation: fadeIn 0.5s ease forwards 0.45s;
        }
        .chip {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 0.4rem 0.85rem;
          font-size: 0.8rem; color: var(--ink2);
          cursor: pointer;
          transition: all 0.15s;
          display: flex; align-items: center; gap: 0.3rem;
          box-shadow: var(--shadow);
          font-family: 'Epilogue', sans-serif;
          white-space: nowrap;
        }
        .chip:hover {
          background: #f0f4ff;
          border-color: rgba(37,99,235,0.3);
          color: var(--blue2);
          transform: translateY(-1px);
        }

        /* Typing state */
        .submitted-wrap {
          width: 100%; display: flex; flex-direction: column; gap: 0.75rem;
        }
        .user-bubble {
          align-self: flex-end;
          background: var(--ink);
          color: #fff;
          border-radius: 14px 14px 3px 14px;
          padding: 0.7rem 1rem;
          font-size: 0.95rem; max-width: 85%;
          line-height: 1.4;
        }
        .typing-row {
          display: flex; align-items: center; gap: 0.6rem;
          margin-top: 0.5rem;
          opacity: 0; animation: fadeIn 0.4s ease forwards;
        }
        .typing-dot {
          width: 28px; height: 28px;
          background: #f0f0ee;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem;
        }
        .typing-bubble {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 12px 12px 12px 3px;
          padding: 0.55rem 0.9rem;
          font-size: 0.85rem; color: var(--ink2);
          box-shadow: var(--shadow);
        }

        /* Below fold */
        .how-section {
          background: #f3f2ef;
          border-top: 1px solid var(--border);
          padding: 5rem 1.5rem;
        }
        .how-inner { max-width: 840px; margin: 0 auto; text-align: center; }
        .how-eyebrow {
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.16em; color: var(--blue2);
          text-transform: uppercase; margin-bottom: 1rem;
        }
        .how-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.7rem, 3.5vw, 2.6rem);
          color: var(--ink); margin-bottom: 3rem;
          line-height: 1.2; font-weight: 400;
          font-style: italic;
        }
        .how-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem; text-align: left;
        }
        .how-card {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 12px; padding: 1.5rem;
          box-shadow: var(--shadow);
        }
        .how-step {
          width: 26px; height: 26px;
          background: #e8eeff;
          color: var(--blue2);
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem; font-weight: 700;
          margin-bottom: 0.9rem;
        }
        .how-card-title {
          font-weight: 600; font-size: 0.9rem;
          color: var(--ink); margin-bottom: 0.35rem;
        }
        .how-card-desc {
          font-size: 0.82rem; color: var(--ink2);
          line-height: 1.6;
        }

        /* Trust */
        .trust-section {
          padding: 4rem 1.5rem;
          max-width: 840px; margin: 0 auto;
          text-align: center;
        }
        .trust-label {
          font-size: 0.7rem; color: var(--ink3);
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 2rem;
        }
        .trust-stats {
          display: flex; justify-content: center;
          gap: 3rem; flex-wrap: wrap;
        }
        .trust-num {
          font-family: 'Epilogue', sans-serif;
          font-size: 2rem; font-weight: 800;
          color: var(--ink); line-height: 1;
          letter-spacing: -0.03em;
        }
        .trust-desc {
          font-size: 0.75rem; color: var(--ink3);
          margin-top: 0.2rem;
        }

        /* Garage CTA */
        .garage-cta {
          background: var(--ink);
          padding: 4.5rem 1.5rem; text-align: center;
        }
        .garage-cta-inner { max-width: 560px; margin: 0 auto; }
        .garage-cta-label {
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.16em; color: rgba(255,255,255,0.3);
          text-transform: uppercase; margin-bottom: 1rem;
        }
        .garage-cta-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          color: #fff; margin-bottom: 0.75rem;
          font-style: italic; font-weight: 400;
          line-height: 1.25;
        }
        .garage-cta-sub {
          color: rgba(255,255,255,0.4);
          font-size: 0.875rem; margin-bottom: 1.75rem;
          line-height: 1.6;
        }
        .garage-btn {
          background: #fff; color: var(--ink);
          padding: 0.75rem 1.75rem; border-radius: 8px;
          font-weight: 700; font-size: 0.9rem;
          text-decoration: none; display: inline-block;
          transition: opacity 0.15s;
        }
        .garage-btn:hover { opacity: 0.9; }

        /* Footer */
        footer {
          background: #f0efe9;
          border-top: 1px solid var(--border);
          padding: 1.75rem 2rem;
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 1rem;
        }
        .footer-logo {
          font-weight: 900; font-size: 1rem;
          color: var(--ink); letter-spacing: -0.03em;
        }
        .footer-logo span { color: var(--blue2); }
        .footer-text { font-size: 0.75rem; color: var(--ink3); }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .nav-links .nav-link { display: none; }
          .trust-stats { gap: 1.5rem; }
          footer { flex-direction: column; text-align: center; }
          .chips-wrap { justify-content: flex-start; }
        }
      `}</style>

      {/* Nav */}
      <nav className="nav">
        <div className="nav-brand">
          <div className="nav-logo">MOT<span>match</span></div>
          <div className="nav-tagline">Find a trusted garage near you</div>
        </div>
        <div className="nav-links">
          <a href="/garages" className="nav-link">For Garages</a>
          <a href="/demo/brighton-mot-centre" className="nav-link">Demo</a>
          <a href="/garages" className="nav-cta">List Your Garage</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">

          <div className="greeting">{greeting}</div>
          <p className="greeting-sub">How can we help with your car today?</p>

          {!submitted ? (
            <>
              <div className="input-wrap">
                <form onSubmit={handleSubmit}>
                  <div className={`input-box${focused ? ' focused' : ''}`}>
                    <textarea
                      ref={inputRef}
                      className="input-field"
                      placeholder="e.g. I need an MOT in Brighton this week"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      rows={1}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSubmit()
                        }
                      }}
                    />
                    <button className="send-btn" type="submit" disabled={!input.trim()}>
                      <svg className="send-icon" viewBox="0 0 24 24">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>

              <div className="chips-wrap">
                {CHIPS.map(c => (
                  <button key={c.label} className="chip" onClick={() => handleChip(c.label)}>
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="input-wrap">
              <div className="submitted-wrap">
                <div className="user-bubble">{input}</div>
                <div className="typing-row">
                  <div className="typing-dot">🚗</div>
                  <div className="typing-bubble">
                    Finding the best garages near you{'.' .repeat(dots)}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* How it works */}
      <div className="how-section">
        <div className="how-inner">
          <p className="how-eyebrow">How it works</p>
          <h2 className="how-title">Finding a trusted garage<br />shouldn't be hard.</h2>
          <div className="how-grid">
            {[
              { n: '1', title: 'Tell us what you need', desc: 'MOT, service, repair or just a question — type it naturally.' },
              { n: '2', title: 'We find the right garage', desc: 'From 16,000+ DVSA-approved independent garages across the UK.' },
              { n: '3', title: 'Book in seconds', desc: 'Call directly or book online. No middleman. No markup.' },
            ].map(h => (
              <div key={h.n} className="how-card">
                <div className="how-step">{h.n}</div>
                <div className="how-card-title">{h.title}</div>
                <div className="how-card-desc">{h.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust */}
      <div className="trust-section">
        <p className="trust-label">Trusted by drivers across the UK</p>
        <div className="trust-stats">
          {[
            { num: '16,000+', desc: 'DVSA-approved garages' },
            { num: '100%', desc: 'Independent, no chains' },
            { num: 'Free', desc: 'No booking fees ever' },
            { num: '24/7', desc: 'Always available' },
          ].map(s => (
            <div key={s.desc}>
              <div className="trust-num">{s.num}</div>
              <div className="trust-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* For garages */}
      <div className="garage-cta">
        <div className="garage-cta-inner">
          <p className="garage-cta-label">For garage owners</p>
          <h2 className="garage-cta-title">Is your garage on MOTmatch?</h2>
          <p className="garage-cta-sub">
            We've already created a free listing for thousands of independent garages.
            Claim yours and start getting more bookings today.
          </p>
          <a href="/garages" className="garage-btn">Find Your Listing →</a>
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
