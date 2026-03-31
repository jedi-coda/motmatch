'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0a', color: '#f0f0f0', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Barlow+Condensed:wght@600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 1.2rem 2rem;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.3s ease;
        }
        .nav.scrolled {
          background: rgba(10,10,10,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .nav-logo {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800; font-size: 1.5rem; letter-spacing: 0.04em;
          color: #fff; text-decoration: none;
        }
        .nav-logo span { color: #4ade80; }
        .nav-cta {
          background: #4ade80; color: #0a0a0a;
          padding: 0.55rem 1.3rem; border-radius: 6px;
          font-size: 0.85rem; font-weight: 600; text-decoration: none;
          transition: background 0.2s;
        }
        .nav-cta:hover { background: #22c55e; }

        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          text-align: center;
          padding: 6rem 1.5rem 4rem;
          position: relative;
          background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(74,222,128,0.07) 0%, transparent 70%),
                      #0a0a0a;
        }
        .hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }
        .hero-eyebrow {
          font-size: 0.75rem; font-weight: 600; letter-spacing: 0.15em;
          color: #4ade80; text-transform: uppercase; margin-bottom: 1.5rem;
          opacity: 0; animation: fadeUp 0.6s ease forwards 0.1s;
        }
        .hero-headline {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(3rem, 8vw, 6.5rem);
          font-weight: 800; line-height: 0.95;
          letter-spacing: -0.01em;
          color: #fff; margin-bottom: 1.5rem;
          opacity: 0; animation: fadeUp 0.6s ease forwards 0.2s;
        }
        .hero-headline em {
          font-style: normal; color: #4ade80;
        }
        .hero-sub {
          font-size: clamp(1rem, 2vw, 1.2rem); font-weight: 300;
          color: rgba(240,240,240,0.6); max-width: 520px;
          line-height: 1.6; margin-bottom: 2.5rem;
          opacity: 0; animation: fadeUp 0.6s ease forwards 0.35s;
        }
        .hero-actions {
          display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
          opacity: 0; animation: fadeUp 0.6s ease forwards 0.5s;
        }
        .btn-primary {
          background: #4ade80; color: #0a0a0a;
          padding: 0.85rem 2rem; border-radius: 8px;
          font-weight: 600; font-size: 1rem; text-decoration: none;
          transition: all 0.2s; display: inline-flex; align-items: center; gap: 0.5rem;
        }
        .btn-primary:hover { background: #22c55e; transform: translateY(-1px); }
        .btn-secondary {
          background: transparent; color: #f0f0f0;
          padding: 0.85rem 2rem; border-radius: 8px;
          font-weight: 500; font-size: 1rem; text-decoration: none;
          border: 1px solid rgba(255,255,255,0.15);
          transition: all 0.2s;
        }
        .btn-secondary:hover { border-color: rgba(255,255,255,0.4); }

        /* Stats bar */
        .stats {
          display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap;
          padding: 3rem 2rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .stat { text-align: center; }
        .stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 2.5rem; font-weight: 800; color: #4ade80;
          line-height: 1;
        }
        .stat-label {
          font-size: 0.8rem; color: rgba(240,240,240,0.45);
          text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.3rem;
        }

        /* How it works */
        .section { padding: 5rem 1.5rem; max-width: 1100px; margin: 0 auto; }
        .section-label {
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.15em;
          color: #4ade80; text-transform: uppercase; margin-bottom: 1rem;
        }
        .section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem); font-weight: 700;
          color: #fff; margin-bottom: 3rem; line-height: 1.1;
        }
        .steps {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }
        .step {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 1.8rem;
          transition: border-color 0.2s;
        }
        .step:hover { border-color: rgba(74,222,128,0.3); }
        .step-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 3rem; font-weight: 800; color: rgba(74,222,128,0.2);
          line-height: 1; margin-bottom: 1rem;
        }
        .step-title {
          font-weight: 600; font-size: 1rem; color: #fff; margin-bottom: 0.5rem;
        }
        .step-desc { font-size: 0.9rem; color: rgba(240,240,240,0.5); line-height: 1.6; }

        /* Features */
        .features {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1px; background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden;
        }
        .feature {
          background: #0a0a0a; padding: 2rem;
          transition: background 0.2s;
        }
        .feature:hover { background: rgba(74,222,128,0.04); }
        .feature-icon { font-size: 1.5rem; margin-bottom: 1rem; }
        .feature-title { font-weight: 600; font-size: 1rem; color: #fff; margin-bottom: 0.4rem; }
        .feature-desc { font-size: 0.88rem; color: rgba(240,240,240,0.5); line-height: 1.6; }

        /* CTA section */
        .cta-section {
          text-align: center; padding: 5rem 1.5rem;
          background: radial-gradient(ellipse 70% 50% at 50% 50%, rgba(74,222,128,0.08) 0%, transparent 70%);
        }
        .cta-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800;
          color: #fff; margin-bottom: 1rem;
        }
        .cta-sub {
          color: rgba(240,240,240,0.5); font-size: 1rem; margin-bottom: 2rem;
        }

        /* Footer */
        footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 2rem; text-align: center;
          font-size: 0.8rem; color: rgba(240,240,240,0.3);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .stats { gap: 2rem; }
          .hero-actions { flex-direction: column; align-items: center; }
        }
      `}</style>

      {/* Nav */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <a href="/" className="nav-logo">MOT<span>match</span></a>
        <a href="/demo/brighton-mot-centre" className="nav-cta">See Demo →</a>
      </nav>

      {/* Hero */}
      <section className="hero">
        <p className="hero-eyebrow">B2B SaaS for UK MOT Garages</p>
        <h1 className="hero-headline">
          Your garage.<br />
          <em>Online in 48 hours.</em>
        </h1>
        <p className="hero-sub">
          MOTmatch gives independent MOT garages a professional website with a built-in virtual receptionist — handling calls, bookings and enquiries 24/7.
        </p>
        <div className="hero-actions">
          <a href="/demo/brighton-mot-centre" className="btn-primary">
            📞 Try the Virtual Receptionist
          </a>
          <a href="mailto:hello@motmatch.co.uk" className="btn-secondary">
            Get Your Free Demo
          </a>
        </div>
      </section>

      {/* Stats */}
      <div className="stats">
        <div className="stat">
          <div className="stat-num">23k+</div>
          <div className="stat-label">UK MOT Garages</div>
        </div>
        <div className="stat">
          <div className="stat-num">48h</div>
          <div className="stat-label">Live in 48 Hours</div>
        </div>
        <div className="stat">
          <div className="stat-num">24/7</div>
          <div className="stat-label">Virtual Receptionist</div>
        </div>
        <div className="stat">
          <div className="stat-num">£0</div>
          <div className="stat-label">Setup Fee</div>
        </div>
      </div>

      {/* How it works */}
      <div className="section">
        <p className="section-label">How It Works</p>
        <h2 className="section-title">From enquiry to booked — automatically.</h2>
        <div className="steps">
          {[
            { n: '01', title: 'We build your site', desc: 'A professional, mobile-ready website branded to your garage. Live in 48 hours.' },
            { n: '02', title: 'Calls answered 24/7', desc: 'Your virtual receptionist answers calls, answers questions and takes bookings — even at 2am.' },
            { n: '03', title: 'You get more bookings', desc: 'Customers find you on Google, call, and get booked in. You just do the MOTs.' },
          ].map(s => (
            <div className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="section" style={{ paddingTop: 0 }}>
        <p className="section-label">What's Included</p>
        <h2 className="section-title">Everything a garage needs online.</h2>
        <div className="features">
          {[
            { icon: '🌐', title: 'Professional Website', desc: 'DVSA badge, pricing, services, Google Maps — everything your customers need.' },
            { icon: '📞', title: 'Virtual Receptionist', desc: 'AI-powered phone agent handles calls, answers FAQs and books appointments.' },
            { icon: '📍', title: 'Local SEO Setup', desc: 'Optimised for "MOT near me" searches in your area. Get found on Google.' },
            { icon: '📱', title: 'Mobile-First Design', desc: 'Looks perfect on any device. Most MOT searches happen on mobile.' },
            { icon: '⚡', title: 'No Tech Headaches', desc: 'We handle everything. No WordPress, no plugins, no IT knowledge needed.' },
            { icon: '💷', title: 'Simple Pricing', desc: 'One monthly fee. No setup cost. Cancel anytime.' },
          ].map(f => (
            <div className="feature" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <h2 className="cta-title">Ready to see it in action?</h2>
        <p className="cta-sub">Try the live demo — no sign-up needed.</p>
        <a href="/demo/brighton-mot-centre" className="btn-primary" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}>
          View Live Demo →
        </a>
      </div>

      {/* Footer */}
      <footer>
        © {new Date().getFullYear()} MOTmatch · Built for independent UK garages
      </footer>

    </main>
  )
}
