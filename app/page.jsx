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

const MESSAGES = [
  "Good morning, how can I help with your car today?",
  "Good afternoon, what can I help you with today?",
  "Good evening, need help with your vehicle?",
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
    if (h >= 5 && h < 12) setGreeting(MESSAGES[0])
    else if (h >= 12 && h < 18) setGreeting(MESSAGES[1])
    else setGreeting(MESSAGES[2])

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
    <main style={{ fontFamily: "'Epilogue', sans-serif", minHeight: '100vh', background: '#f8f7f4', color: '#1a1a2e', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #f8f7f4;
          --bg2: #f0efe9;
          --ink: #1a1a2e;
          --ink2: #4a4a6a;
          --ink3: #9898b8;
          --blue: #2563eb;
          --blue-light: #eff6ff;
          --blue-mid: #dbeafe;
          --green: #059669;
          --border: rgba(26,26,46,0.08);
          --shadow: 0 1px 3px rgba(26,26,46,0.06), 0 4px 16px rgba(26,26,46,0.04);
          --shadow-lg: 0 4px 24px rgba(26,26,46,0.10), 0 1px 4px rgba(26,26,46,0.06);
        }

        /* Nav */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 1rem 2rem;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(248,247,244,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo {
          font-family: 'Epilogue', sans-serif;
          font-weight: 800; font-size: 1.3rem;
          color: var(--ink); letter-spacing: -0.02em;
        }
        .nav-logo span { color: var(--blue); }
        .nav-links {
          display: flex; gap: 0.5rem; align-items: center;
        }
        .nav-link {
          font-size: 0.85rem; color: var(--ink2);
          text-decoration: none; padding: 0.4rem 0.8rem;
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
        }
        .nav-link:hover { background: var(--bg2); color: var(--ink); }
        .nav-cta {
          background: var(--ink); color: #fff;
          padding: 0.45rem 1.1rem; border-radius: 6px;
          font-size: 0.85rem; font-weight: 600;
          text-decoration: none;
          transition: background 0.15s;
        }
        .nav-cta:hover { background: #2d2d4e; }

        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 7rem 1.5rem 4rem;
          position: relative;
        }
        .hero-inner {
          width: 100%; max-width: 680px;
          display: flex; flex-direction: column;
          align-items: center;
        }

        /* Greeting */
        .greeting-wrap {
          display: flex; align-items: center; gap: 0.75rem;
          margin-bottom: 2.5rem;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.1s;
        }
        .greeting-avatar {
          width: 42px; height: 42px;
          background: var(--blue);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(37,99,235,0.3);
        }
        .greeting-bubble {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 16px 16px 16px 4px;
          padding: 0.75rem 1.1rem;
          font-size: 1rem;
          color: var(--ink);
          box-shadow: var(--shadow);
          line-height: 1.5;
          max-width: 440px;
        }
        .greeting-bubble strong {
          font-weight: 600;
        }

        /* Input area */
        .input-wrap {
          width: 100%;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.25s;
        }
        .input-box {
          width: 100%;
          background: #fff;
          border: 2px solid var(--border);
          border-radius: 16px;
          padding: 1rem 1rem 1rem 1.25rem;
          display: flex; align-items: flex-end; gap: 0.75rem;
          box-shadow: var(--shadow-lg);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-box.focused {
          border-color: var(--blue);
          box-shadow: 0 0 0 4px rgba(37,99,235,0.08), var(--shadow-lg);
        }
        .input-field {
          flex: 1;
          border: none; outline: none;
          font-family: 'Epilogue', sans-serif;
          font-size: 1rem; color: var(--ink);
          background: transparent;
          resize: none;
          min-height: 28px; max-height: 120px;
          line-height: 1.5;
        }
        .input-field::placeholder { color: var(--ink3); }
        .send-btn {
          width: 38px; height: 38px;
          background: var(--blue);
          border: none; border-radius: 10px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, transform 0.1s;
          flex-shrink: 0;
        }
        .send-btn:hover { background: #1d4ed8; transform: scale(1.05); }
        .send-btn:disabled { background: var(--ink3); cursor: not-allowed; transform: none; }
        .send-icon {
          width: 16px; height: 16px;
          fill: none; stroke: #fff;
          stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
        }

        /* Chips */
        .chips-wrap {
          width: 100%; margin-top: 1rem;
          display: flex; flex-wrap: wrap; gap: 0.5rem;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.4s;
        }
        .chip {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 0.45rem 0.9rem;
          font-size: 0.85rem; color: var(--ink2);
          cursor: pointer;
          transition: all 0.15s;
          display: flex; align-items: center; gap: 0.35rem;
          box-shadow: var(--shadow);
          font-family: 'Epilogue', sans-serif;
        }
        .chip:hover {
          background: var(--blue-light);
          border-color: var(--blue);
          color: var(--blue);
          transform: translateY(-1px);
        }

        /* Typing indicator */
        .typing {
          display: flex; align-items: center; gap: 0.75rem;
          margin-top: 1.5rem;
          opacity: 0; animation: fadeUp 0.4s ease forwards;
        }
        .typing-avatar {
          width: 32px; height: 32px;
          background: var(--blue);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem;
        }
        .typing-bubble {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 12px 12px 12px 4px;
          padding: 0.6rem 1rem;
          font-size: 0.9rem; color: var(--ink2);
          box-shadow: var(--shadow);
        }

        /* How it works */
        .how-section {
          background: var(--bg2);
          border-top: 1px solid var(--border);
          padding: 5rem 1.5rem;
        }
        .how-inner {
          max-width: 900px; margin: 0 auto;
          text-align: center;
        }
        .how-eyebrow {
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.15em; color: var(--blue);
          text-transform: uppercase; margin-bottom: 1rem;
        }
        .how-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          color: var(--ink); margin-bottom: 3rem;
          line-height: 1.2; font-weight: 400;
          font-style: italic;
        }
        .how-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem; text-align: left;
        }
        .how-card {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 12px; padding: 1.5rem;
          box-shadow: var(--shadow);
        }
        .how-step {
          width: 28px; height: 28px;
          background: var(--blue-mid);
          color: var(--blue);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.78rem; font-weight: 700;
          margin-bottom: 1rem;
        }
        .how-card-title {
          font-weight: 600; font-size: 0.95rem;
          color: var(--ink); margin-bottom: 0.4rem;
        }
        .how-card-desc {
          font-size: 0.85rem; color: var(--ink2);
          line-height: 1.6;
        }

        /* Trust section */
        .trust-section {
          padding: 4rem 1.5rem;
          max-width: 900px; margin: 0 auto;
          text-align: center;
        }
        .trust-label {
          font-size: 0.75rem; color: var(--ink3);
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 2rem;
        }
        .trust-stats {
          display: flex; justify-content: center;
          gap: 3rem; flex-wrap: wrap;
        }
        .trust-stat {}
        .trust-num {
          font-family: 'Epilogue', sans-serif;
          font-size: 2.2rem; font-weight: 800;
          color: var(--ink); line-height: 1;
        }
        .trust-desc {
          font-size: 0.8rem; color: var(--ink3);
          margin-top: 0.25rem;
        }

        /* For garages CTA */
        .garage-cta {
          background: var(--ink);
          padding: 4rem 1.5rem; text-align: center;
        }
        .garage-cta-inner { max-width: 600px; margin: 0 auto; }
        .garage-cta-label {
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.15em; color: rgba(255,255,255,0.4);
          text-transform: uppercase; margin-bottom: 1rem;
        }
        .garage-cta-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          color: #fff; margin-bottom: 0.75rem;
          font-style: italic; font-weight: 400;
        }
        .garage-cta-sub {
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem; margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        .garage-btn {
          background: #fff; color: var(--ink);
          padding: 0.75rem 2rem; border-radius: 8px;
          font-weight: 700; font-size: 0.95rem;
          text-decoration: none; display: inline-block;
          transition: background 0.15s;
        }
        .garage-btn:hover { background: var(--bg2); }

        /* Footer */
        footer {
          background: #f0efe9;
          border-top: 1px solid var(--border);
          padding: 2rem 1.5rem;
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 1rem;
        }
        .footer-logo {
          font-weight: 800; font-size: 1.1rem;
          color: var(--ink); letter-spacing: -0.02em;
        }
        .footer-logo span { color: var(--blue); }
        .footer-text { font-size: 0.78rem; color: var(--ink3); }

        /* Submitted state */
        .submitted-wrap {
          width: 100%; display: flex; flex-direction: column; gap: 0.75rem;
        }
        .user-bubble {
          align-self: flex-end;
          background: var(--blue);
          color: #fff;
          border-radius: 16px 16px 4px 16px;
          padding: 0.75rem 1.1rem;
          font-size: 0.95rem; max-width: 80%;
          box-shadow: 0 2px 8px rgba(37,99,235,0.2);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
        }

        @media (max-width: 600px) {
          .nav-links .nav-link { display: none; }
          .trust-stats { gap: 1.5rem; }
          footer { flex-direction: column; text-align: center; }
        }
      `}</style>

      {/* Nav */}
      <nav className="nav">
        <div className="nav-logo">MOT<span>match</span></div>
        <div className="nav-links">
          <a href="/garages" className="nav-link">For Garages</a>
          <a href="/demo/brighton-mot-centre" className="nav-link">See Demo</a>
          <a href="/garages" className="nav-cta">List Your Garage</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">

          {/* Greeting bubble */}
          <div className="greeting-wrap">
            <div className="greeting-avatar">🚗</div>
            <div className="greeting-bubble">
              <strong>{greeting}</strong>
            </div>
          </div>

          {/* Input or submitted state */}
          {!submitted ? (
            <>
              <div className="input-wrap">
                <form onSubmit={handleSubmit}>
                  <div className={`input-box${focused ? ' focused' : ''}`}>
                    <textarea
                      ref={inputRef}
                      className="input-field"
                      placeholder="Tell me what you need — e.g. 'I need an MOT in Brighton'"
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
                <div className="typing">
                  <div className="typing-avatar">🚗</div>
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
          <h2 className="how-title">Finding a trusted garage<br />shouldn't be stressful.</h2>
          <div className="how-grid">
            {[
              { n: '1', title: 'Tell us what you need', desc: 'MOT, service, repair or just a question — type it naturally, like texting a friend.' },
              { n: '2', title: 'We find the right garage', desc: 'From 16,000+ DVSA-approved independent garages across the UK.' },
              { n: '3', title: 'Book in seconds', desc: 'Call directly or book online. No middleman, no markup. Just you and your garage.' },
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

      {/* Trust stats */}
      <div className="trust-section">
        <p className="trust-label">Trusted by drivers across the UK</p>
        <div className="trust-stats">
          {[
            { num: '16,000+', desc: 'DVSA-approved garages' },
            { num: '100%', desc: 'Independent, no chains' },
            { num: 'Free', desc: 'No booking fees ever' },
            { num: '24/7', desc: 'Always available' },
          ].map(s => (
            <div key={s.desc} className="trust-stat">
              <div className="trust-num">{s.num}</div>
              <div className="trust-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* For garages CTA */}
      <div className="garage-cta">
        <div className="garage-cta-inner">
          <p className="garage-cta-label">For garage owners</p>
          <h2 className="garage-cta-title">Is your garage on MOTmatch?</h2>
          <p className="garage-cta-sub">
            We've already created a free listing for thousands of independent garages across the UK.
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
