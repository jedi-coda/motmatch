'use client'

import { useState, useEffect } from 'react'

const SPOTS_REMAINING = 3

export default function GaragesLanding() {
  const [scrolled, setScrolled] = useState(false)
  const [town, setTown] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function handleSearch(e) {
    e?.preventDefault()
    if (!town.trim()) return
    window.location.href = '/demo/brighton-mot-centre'
  }

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0a', color: '#f0f0f0', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Barlow+Condensed:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 1.2rem 2rem;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.3s;
        }
        .nav.scrolled {
          background: rgba(10,10,10,0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .logo {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800; font-size: 1.5rem;
          color: #fff; text-decoration: none;
          letter-spacing: 0.04em;
        }
        .logo span { color: #4ade80; }
        .nav-demo {
          background: #4ade80; color: #0a0a0a;
          padding: 0.5rem 1.2rem; border-radius: 6px;
          font-weight: 600; font-size: 0.85rem;
          text-decoration: none; transition: background 0.2s;
        }
        .nav-demo:hover { background: #22c55e; }

        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          text-align: center; padding: 8rem 1.5rem 5rem;
          background:
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(74,222,128,0.07) 0%, transparent 70%),
            #0a0a0a;
          position: relative;
        }
        .hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }
        .hero-inner { position: relative; max-width: 760px; width: 100%; }

        .eyebrow {
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.2em; color: #4ade80;
          text-transform: uppercase; margin-bottom: 1.5rem;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.1s;
        }
        .hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2.6rem, 6vw, 5rem);
          font-weight: 800; line-height: 1.0;
          color: #fff; margin-bottom: 1.25rem;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.2s;
          letter-spacing: -0.01em;
        }
        .hero-sub {
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          font-weight: 400; color: rgba(240,240,240,0.5);
          margin: 0 auto 2.5rem;
          line-height: 1.5;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.3s;
        }

        /* Search */
        .search-wrap {
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.4s;
          margin-bottom: 1rem;
        }
        .search-box {
          display: flex;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 10px; overflow: hidden;
          max-width: 500px; margin: 0 auto;
          transition: border-color 0.2s;
        }
        .search-box:focus-within {
          border-color: rgba(74,222,128,0.5);
        }
        .search-input {
          flex: 1; background: transparent;
          border: none; outline: none;
          padding: 0.95rem 1.25rem;
          color: #f0f0f0; font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
        }
        .search-input::placeholder { color: rgba(240,240,240,0.3); }
        .search-btn {
          background: #4ade80; color: #0a0a0a;
          border: none; padding: 0.95rem 1.5rem;
          font-weight: 700; font-size: 0.88rem;
          cursor: pointer; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .search-btn:hover { background: #22c55e; }

        /* Trust badges */
        .trust-badges {
          display: flex; flex-wrap: wrap; justify-content: center;
          gap: 0.5rem; margin-bottom: 2rem;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.5s;
        }
        .trust-badge {
          font-size: 0.72rem; font-weight: 600;
          color: rgba(240,240,240,0.4);
          letter-spacing: 0.05em;
          display: flex; align-items: center; gap: 0.3rem;
        }
        .trust-badge::before { content: '·'; opacity: 0.3; }
        .trust-badge:first-child::before { display: none; }

        /* Hero actions */
        .hero-actions {
          display: flex; gap: 1rem; justify-content: center;
          flex-wrap: wrap;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.55s;
        }
        .btn-green {
          background: #4ade80; color: #0a0a0a;
          padding: 0.9rem 2rem; border-radius: 8px;
          font-weight: 600; font-size: 0.95rem;
          text-decoration: none; transition: all 0.2s;
          display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .btn-green:hover { background: #22c55e; transform: translateY(-1px); }
        .btn-ghost {
          background: transparent; color: #f0f0f0;
          padding: 0.9rem 2rem; border-radius: 8px;
          font-weight: 500; font-size: 0.95rem;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.15);
          transition: all 0.2s;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.35); }

        /* Urgency */
        .urgency {
          background: rgba(251,191,36,0.07);
          border: 1px solid rgba(251,191,36,0.2);
          border-radius: 8px; padding: 0.65rem 1.25rem;
          font-size: 0.82rem; color: #fbbf24;
          display: inline-flex; align-items: center; gap: 0.5rem;
          margin-top: 1.75rem;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.65s;
        }
        .urgency-dot { width: 6px; height: 6px; border-radius: 50%; background: #fbbf24; animation: pulse 1.5s infinite; flex-shrink: 0; }

        /* Stats row */
        .stats-row {
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(74,222,128,0.03);
          padding: 2rem 1.5rem;
          display: flex; justify-content: center;
          gap: 0; flex-wrap: wrap;
        }
        .stat-item {
          text-align: center;
          padding: 0.75rem 3rem;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .stat-item:last-child { border-right: none; }
        .stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.9rem; font-weight: 800;
          color: #4ade80; line-height: 1;
        }
        .stat-label {
          font-size: 0.72rem; color: rgba(240,240,240,0.4);
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-top: 0.3rem;
        }

        /* Value prop */
        .value-prop {
          text-align: center; padding: 3.5rem 1.5rem;
          max-width: 960px; margin: 0 auto;
        }
        .value-prop-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 700; color: #fff;
          line-height: 1.2;
        }
        .value-prop-text em {
          font-style: normal; color: #4ade80;
        }

        /* Pricing section */
        .pricing-section {
          max-width: 960px; margin: 0 auto;
          padding: 4rem 1.5rem 5rem;
        }
        .section-eyebrow {
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.18em; color: #4ade80;
          text-transform: uppercase; margin-bottom: 0.75rem;
          text-align: center;
        }
        .section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 700; color: #fff;
          text-align: center; margin-bottom: 0.75rem;
          line-height: 1.1;
        }
        .section-sub {
          text-align: center; color: rgba(240,240,240,0.45);
          font-size: 0.9rem; margin-bottom: 3rem;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .price-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 2rem;
        }
        .price-card.featured {
          background: rgba(74,222,128,0.04);
          border-color: rgba(74,222,128,0.3);
        }
        .price-tag {
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.12em; color: #4ade80;
          text-transform: uppercase; margin-bottom: 0.5rem;
        }
        .price-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.5rem; font-weight: 700;
          color: #fff; margin-bottom: 0.75rem;
        }
        .price-amount { margin-bottom: 0.25rem; }
        .price-strike {
          font-size: 1rem;
          color: rgba(240,240,240,0.25);
          text-decoration: line-through;
          margin-right: 0.3rem;
        }
        .price-main {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 2.5rem; font-weight: 800; color: #fff;
        }
        .price-per { font-size: 0.9rem; color: rgba(240,240,240,0.4); }
        .price-monthly {
          font-size: 0.85rem; color: rgba(240,240,240,0.4);
          margin-bottom: 1.5rem;
        }
        .price-features {
          list-style: none; padding: 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 1.25rem; margin-bottom: 1.5rem;
        }
        .price-feature {
          font-size: 0.88rem; color: rgba(240,240,240,0.65);
          padding: 0.3rem 0; line-height: 1.5;
        }
        .price-cta-wrap { display: flex; flex-direction: column; gap: 0.5rem; }
        .price-cta {
          display: block; text-align: center;
          padding: 0.9rem; border-radius: 8px;
          font-weight: 700; font-size: 0.95rem;
          text-decoration: none; transition: all 0.2s;
        }
        .price-cta.green { background: #4ade80; color: #0a0a0a; }
        .price-cta.green:hover { background: #22c55e; transform: translateY(-1px); }
        .price-cta.outline {
          border: 1px solid rgba(255,255,255,0.15);
          color: #f0f0f0;
        }
        .price-cta.outline:hover { border-color: rgba(255,255,255,0.35); }
        .price-cta-sub {
          text-align: center; font-size: 0.75rem;
          color: rgba(240,240,240,0.3);
        }

        /* Features */
        .features-section {
          background: rgba(255,255,255,0.015);
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 5rem 1.5rem;
        }
        .features-inner { max-width: 960px; margin: 0 auto; }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px; overflow: hidden;
          margin-top: 3rem;
        }
        .feature-item {
          background: #0a0a0a; padding: 1.75rem;
          transition: background 0.2s;
        }
        .feature-item:hover { background: rgba(74,222,128,0.04); }
        .feature-icon { font-size: 1.3rem; margin-bottom: 0.75rem; }
        .feature-title { font-weight: 600; font-size: 0.9rem; color: #fff; margin-bottom: 0.35rem; }
        .feature-desc { font-size: 0.82rem; color: rgba(240,240,240,0.4); line-height: 1.6; }

        /* Demo CTA */
        .demo-cta {
          text-align: center; padding: 5rem 1.5rem;
          background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(74,222,128,0.08) 0%, transparent 70%);
        }
        .demo-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800; color: #fff; margin-bottom: 0.75rem;
        }
        .demo-sub { color: rgba(240,240,240,0.45); font-size: 0.95rem; margin-bottom: 2rem; }

        /* Footer */
        footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 2rem 1.5rem;
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 1rem;
          max-width: 960px; margin: 0 auto;
        }
        .footer-text { font-size: 0.78rem; color: rgba(240,240,240,0.2); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        @media (max-width: 640px) {
          .stat-item { padding: 0.75rem 1.5rem; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
          .stat-item:last-child { border-bottom: none; }
          .hero-actions { flex-direction: column; align-items: center; }
        }
      `}</style>

      {/* Nav */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <a href="/" className="logo">MOT<span>match</span></a>
        <a href="/demo/brighton-mot-centre" target="_blank" className="nav-demo">See Live Demo →</a>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">For Independent MOT Garages</p>
          <h1 className="hero-title">
            You've earned your reputation.<br />
            Now let it shine online.
          </h1>
          <p className="hero-sub">
            Turn quiet garages into booked-out businesses.
          </p>

          <div className="search-wrap">
            <form onSubmit={handleSearch}>
              <div className="search-box">
                <input
                  className="search-input"
                  placeholder="Enter your town or postcode..."
                  value={town}
                  onChange={e => setTown(e.target.value)}
                />
                <button className="search-btn" type="submit">Find My Listing →</button>
              </div>
            </form>
          </div>

          <div className="trust-badges">
            {['DVSA Aligned', 'UK Hosted', 'SSL Secure', 'Live in 48hrs', '99.9% Uptime'].map(b => (
              <span key={b} className="trust-badge">{b}</span>
            ))}
          </div>

          <div className="hero-actions">
            <a href="/demo/brighton-mot-centre" target="_blank" className="btn-green">
              📞 Try the Virtual Receptionist
            </a>
            <a href="#pricing" className="btn-ghost">
              See Pricing
            </a>
          </div>

          <div className="urgency">
            <span className="urgency-dot" />
            <span>Launch pricing — only <strong>{SPOTS_REMAINING} spots remaining</strong> per town at £299 setup</span>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <div className="stats-row">
        {[
          { num: '47%', label: 'More Bookings' },
          { num: '3×', label: 'More Calls' },
          { num: 'Page 1', label: 'Google Results' },
          { num: '48hrs', label: 'Live & Trading' },
        ].map(s => (
          <div key={s.label} className="stat-item">
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Value prop */}
      <div className="value-prop">
        <p className="value-prop-text">
          One extra MOT booking a week<br />
          <em>covers your entire monthly fee.</em>
        </p>
      </div>

      {/* Pricing */}
      <div className="pricing-section" id="pricing">
        <p className="section-eyebrow">Simple Pricing</p>
        <h2 className="section-title">Everything included.<br />No surprises. No contracts.</h2>
        <p className="section-sub">Cancel anytime. Most garages are profitable within the first week.</p>

        <div className="pricing-grid">
          {/* Standard */}
          <div className="price-card">
            <div className="price-name">Standard</div>
            <div className="price-amount">
              <span className="price-main">£499</span>
              <span className="price-per"> setup</span>
            </div>
            <div className="price-monthly">then £99/month</div>
            <ul className="price-features">
              {[
                '✓ Professional microsite',
                '✓ Virtual Receptionist 24/7',
                '✓ Local SEO setup',
                '✓ Booking capture & SMS alerts',
                '✓ MOTmatch directory listing',
                '✓ Live in 48 hours',
              ].map(f => (
                <li key={f} className="price-feature">{f}</li>
              ))}
            </ul>
            <div className="price-cta-wrap">
              <a href="#find" className="price-cta outline">Start Your Free Test Drive →</a>
              <p className="price-cta-sub">See your live site for 14 days — no payment needed</p>
            </div>
          </div>

          {/* Founder */}
          <div className="price-card featured">
            <div className="price-tag">🔥 Launch Price — First 5 Per Town</div>
            <div className="price-name">Founder Package</div>
            <div className="price-amount">
              <span className="price-strike">£499</span>
              <span className="price-main">£299</span>
              <span className="price-per"> setup</span>
            </div>
            <div className="price-monthly">
              then <span style={{ textDecoration: 'line-through', opacity: 0.35 }}>£99</span> £49/month — locked in forever
            </div>
            <ul className="price-features">
              {[
                '✓ Everything in Standard',
                '✓ Price locked forever at £49/mo',
                '✓ Priority onboarding',
                '✓ Featured in local search',
                '✓ Founder badge on listing',
                '✓ Direct line to our team',
              ].map(f => (
                <li key={f} className="price-feature">{f}</li>
              ))}
            </ul>
            <div className="price-cta-wrap">
              <a href="#find" className="price-cta green">Start Your Free Test Drive →</a>
              <p className="price-cta-sub">See your live site for 14 days — no payment needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="features-section">
        <div className="features-inner">
          <p className="section-eyebrow" style={{ textAlign: 'center' }}>What's included</p>
          <h2 className="section-title">Everything your garage needs online.</h2>
          <div className="features-grid">
            {[
              { icon: '📞', title: 'Virtual Receptionist', desc: 'Answers every call 24/7. Captures name, reg, service needed. Texts you instantly.' },
              { icon: '🌐', title: 'Professional Website', desc: 'DVSA badge, pricing, services, reviews. Looks great on mobile.' },
              { icon: '📍', title: 'Local SEO', desc: 'Optimised for "MOT near me" in your area. Get found on Google.' },
              { icon: '📱', title: 'SMS Booking Alerts', desc: 'Every enquiry texted to you the moment it comes in.' },
              { icon: '⚡', title: 'Live in 48 Hours', desc: 'We handle everything. No tech knowledge needed.' },
              { icon: '💷', title: 'No Hidden Costs', desc: 'One monthly fee. Cancel anytime. No contracts.' },
            ].map(f => (
              <div key={f.title} className="feature-item">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo CTA */}
      <div className="demo-cta" id="find">
        <h2 className="demo-title">See exactly what you'd get.</h2>
        <p className="demo-sub">Live demo — call the virtual receptionist right now. No sign-up.</p>
        <a href="/demo/brighton-mot-centre" target="_blank" className="btn-green" style={{ fontSize: '1rem', padding: '1rem 2.5rem', display: 'inline-flex' }}>
          View Live Demo →
        </a>
        <p style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'rgba(240,240,240,0.2)' }}>
          Or search for your garage above to claim your listing
        </p>
      </div>

      {/* Footer */}
      <footer>
        <a href="/" className="logo" style={{ textDecoration: 'none' }}>MOT<span style={{ color: '#4ade80' }}>match</span></a>
        <p className="footer-text">Built for independent UK garages</p>
        <p className="footer-text">© {new Date().getFullYear()} MOTmatch</p>
      </footer>

    </main>
  )
}
