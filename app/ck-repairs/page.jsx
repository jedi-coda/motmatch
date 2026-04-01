'use client'

import { useState, useEffect } from 'react'

export default function CKRepairs() {
  const [time, setTime] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const hours = now.getHours()
      const mins = now.getMinutes().toString().padStart(2, '0')
      const ampm = hours >= 12 ? 'pm' : 'am'
      const h = hours % 12 || 12
      setTime(`${h}:${mins}${ampm}`)
      const day = now.getDay()
      setIsOpen(day >= 1 && day <= 5 && hours >= 8 && hours < 17)
    }
    update()
    const t = setInterval(update, 60000)
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => { clearInterval(t); window.removeEventListener('scroll', handleScroll) }
  }, [])

  const services = [
    { icon: '🔧', title: 'Mechanical Repairs', desc: 'Brakes, suspension, steering, exhausts — diagnosed and fixed right first time.' },
    { icon: '⚡', title: 'Electrical Diagnostics', desc: 'Engine management, fault codes, wiring issues. We find what others miss.' },
    { icon: '🔄', title: 'Servicing & Maintenance', desc: 'Full and interim services. Keep your car running at its best.' },
    { icon: '🛞', title: 'Tyres & Wheels', desc: 'Supply and fit. Tracking and balancing. All makes and sizes.' },
    { icon: '🚗', title: 'MOT Preparation', desc: 'Pre-MOT checks and repairs to make sure your car passes first time.' },
    { icon: '🔍', title: 'Vehicle Health Checks', desc: 'Free visual inspection with every service. No nasty surprises.' },
  ]

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", background: '#0f0f0f', color: '#f0ede8', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Oswald:wght@500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --red: #c0392b;
          --red-bright: #e74c3c;
          --gold: #f39c12;
          --dark: #0f0f0f;
          --dark2: #1a1a1a;
          --dark3: #242424;
          --light: #f0ede8;
          --muted: rgba(240,237,232,0.45);
        }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 1rem 2rem;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.3s;
        }
        .nav.scrolled {
          background: rgba(15,15,15,0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(192,57,43,0.2);
        }
        .nav-logo {
          font-family: 'Oswald', sans-serif;
          font-weight: 700; font-size: 1.6rem;
          color: var(--light); letter-spacing: 0.05em;
        }
        .nav-logo span { color: var(--red); }
        .nav-call {
          background: var(--red);
          color: #fff; padding: 0.55rem 1.4rem;
          border-radius: 4px; font-weight: 600;
          font-size: 0.88rem; text-decoration: none;
          transition: background 0.2s;
          display: flex; align-items: center; gap: 0.4rem;
        }
        .nav-call:hover { background: var(--red-bright); }

        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          justify-content: center;
          padding: 8rem 2rem 4rem;
          position: relative;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 100% 50%, rgba(192,57,43,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 0% 100%, rgba(192,57,43,0.06) 0%, transparent 50%),
            var(--dark);
        }
        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .hero-content {
          position: relative; z-index: 1;
          max-width: 900px;
        }
        .hero-status {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 0.4rem 1rem;
          font-size: 0.78rem; color: var(--muted);
          margin-bottom: 2rem;
          letter-spacing: 0.05em;
        }
        .status-dot {
          width: 7px; height: 7px; border-radius: 50%;
          animation: pulse 2s infinite;
        }
        .status-dot.open { background: #2ecc71; }
        .status-dot.closed { background: #e74c3c; }
        .hero-eyebrow {
          font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.2em; color: var(--red);
          text-transform: uppercase; margin-bottom: 1.2rem;
          opacity: 0; animation: fadeUp 0.6s ease forwards 0.1s;
        }
        .hero-title {
          font-family: 'Oswald', sans-serif;
          font-size: clamp(3.5rem, 9vw, 7.5rem);
          font-weight: 700; line-height: 0.92;
          letter-spacing: -0.01em;
          color: var(--light);
          margin-bottom: 1.5rem;
          opacity: 0; animation: fadeUp 0.6s ease forwards 0.2s;
        }
        .hero-title .accent { color: var(--red); }
        .hero-sub {
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          font-weight: 300; color: var(--muted);
          max-width: 480px; line-height: 1.7;
          margin-bottom: 2.5rem;
          opacity: 0; animation: fadeUp 0.6s ease forwards 0.35s;
        }
        .hero-actions {
          display: flex; gap: 1rem; flex-wrap: wrap;
          opacity: 0; animation: fadeUp 0.6s ease forwards 0.5s;
        }
        .btn-primary {
          background: var(--red); color: #fff;
          padding: 0.9rem 2.2rem; border-radius: 4px;
          font-weight: 600; font-size: 1rem;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-flex; align-items: center; gap: 0.5rem;
        }
        .btn-primary:hover { background: var(--red-bright); transform: translateY(-2px); }
        .btn-outline {
          background: transparent; color: var(--light);
          padding: 0.9rem 2.2rem; border-radius: 4px;
          font-weight: 500; font-size: 1rem;
          text-decoration: none;
          border: 1px solid rgba(240,237,232,0.2);
          transition: all 0.2s;
        }
        .btn-outline:hover { border-color: rgba(240,237,232,0.5); }

        /* Trust bar */
        .trust-bar {
          background: var(--red);
          padding: 1rem 2rem;
          display: flex; justify-content: center;
          gap: 3rem; flex-wrap: wrap;
        }
        .trust-item {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.88rem; font-weight: 600;
          color: rgba(255,255,255,0.92);
          letter-spacing: 0.03em;
        }

        /* Stats */
        .stats-bar {
          background: var(--dark2);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 2.5rem 2rem;
          display: flex; justify-content: center;
          gap: 0; flex-wrap: wrap;
        }
        .stat-item {
          text-align: center;
          padding: 0 3rem;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .stat-item:last-child { border-right: none; }
        .stat-num {
          font-family: 'Oswald', sans-serif;
          font-size: 2.8rem; font-weight: 700;
          color: var(--red); line-height: 1;
        }
        .stat-label {
          font-size: 0.75rem; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-top: 0.3rem;
        }

        /* Sections */
        .section {
          padding: 5rem 2rem;
          max-width: 1100px; margin: 0 auto;
        }
        .section-eyebrow {
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.18em; color: var(--red);
          text-transform: uppercase; margin-bottom: 0.75rem;
        }
        .section-title {
          font-family: 'Oswald', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 600; color: var(--light);
          line-height: 1.05; margin-bottom: 3rem;
        }

        /* Services grid */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px; overflow: hidden;
        }
        .service-card {
          background: var(--dark2);
          padding: 2rem;
          transition: background 0.2s;
          cursor: default;
        }
        .service-card:hover { background: var(--dark3); }
        .service-icon { font-size: 1.5rem; margin-bottom: 1rem; }
        .service-title {
          font-family: 'Oswald', sans-serif;
          font-size: 1.1rem; font-weight: 600;
          color: var(--light); margin-bottom: 0.5rem;
        }
        .service-desc {
          font-size: 0.88rem; color: var(--muted);
          line-height: 1.6;
        }

        /* Why us */
        .why-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }
        .why-card {
          background: var(--dark2);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px; padding: 1.8rem;
          border-top: 3px solid var(--red);
        }
        .why-num {
          font-family: 'Oswald', sans-serif;
          font-size: 2.5rem; font-weight: 700;
          color: rgba(192,57,43,0.25); line-height: 1;
          margin-bottom: 0.75rem;
        }
        .why-title {
          font-weight: 600; font-size: 0.95rem;
          color: var(--light); margin-bottom: 0.4rem;
        }
        .why-desc { font-size: 0.85rem; color: var(--muted); line-height: 1.6; }

        /* Reviews */
        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }
        .review-card {
          background: var(--dark2);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px; padding: 1.5rem;
        }
        .review-stars { color: var(--gold); font-size: 0.9rem; margin-bottom: 0.75rem; }
        .review-text {
          font-size: 0.9rem; color: rgba(240,237,232,0.7);
          line-height: 1.6; font-style: italic;
          margin-bottom: 0.75rem;
        }
        .review-author { font-size: 0.78rem; color: var(--muted); }

        /* CTA section */
        .cta-section {
          background: var(--dark2);
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 5rem 2rem; text-align: center;
          position: relative; overflow: hidden;
        }
        .cta-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(192,57,43,0.08) 0%, transparent 70%);
        }
        .cta-title {
          font-family: 'Oswald', sans-serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700; color: var(--light);
          margin-bottom: 1rem; position: relative;
        }
        .cta-sub {
          color: var(--muted); font-size: 1rem;
          margin-bottom: 2rem; position: relative;
        }

        /* Hours */
        .hours-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        .hours-table { width: 100%; }
        .hours-row {
          display: flex; justify-content: space-between;
          padding: 0.6rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 0.9rem;
        }
        .hours-day { color: var(--muted); }
        .hours-time { color: var(--light); font-weight: 500; }
        .hours-time.open { color: #2ecc71; }
        .hours-time.closed { color: rgba(240,237,232,0.25); }

        /* Map placeholder */
        .map-box {
          background: var(--dark3);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px; padding: 2rem;
          display: flex; flex-direction: column;
          gap: 0.75rem;
        }
        .map-label {
          font-size: 0.72rem; letter-spacing: 0.12em;
          color: var(--red); text-transform: uppercase;
          font-weight: 600;
        }
        .map-address {
          font-family: 'Oswald', sans-serif;
          font-size: 1.1rem; color: var(--light);
          line-height: 1.4;
        }
        .map-detail { font-size: 0.88rem; color: var(--muted); }
        .map-link {
          display: inline-flex; align-items: center; gap: 0.4rem;
          color: var(--red); font-size: 0.88rem;
          font-weight: 600; text-decoration: none;
          margin-top: 0.5rem;
          transition: color 0.2s;
        }
        .map-link:hover { color: var(--red-bright); }

        /* Footer */
        footer {
          background: #080808;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 2.5rem 2rem;
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 1rem;
        }
        .footer-logo {
          font-family: 'Oswald', sans-serif;
          font-weight: 700; font-size: 1.3rem;
          color: var(--light);
        }
        .footer-logo span { color: var(--red); }
        .footer-text { font-size: 0.78rem; color: rgba(240,237,232,0.2); }
        .footer-phone {
          font-size: 0.88rem; color: var(--muted);
          text-decoration: none;
        }
        .footer-phone:hover { color: var(--light); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        @media (max-width: 640px) {
          .stat-item { padding: 1rem 1.5rem; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .trust-bar { gap: 1.5rem; }
          .hero-actions { flex-direction: column; }
          footer { flex-direction: column; text-align: center; }
        }
      `}</style>

      {/* Nav */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-logo">CK<span>.</span>REPAIRS</div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a href="tel:07771986910" className="nav-call" style={{ background: 'transparent', border: '1px solid rgba(192,57,43,0.4)', fontSize: '0.82rem' }}>
            📱 07771 986 910
          </a>
          <a href="tel:01903367020" className="nav-call">
            📞 01903 367 020
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-status">
            <span className={`status-dot ${isOpen ? 'open' : 'closed'}`} />
            <span>{isOpen ? `Open now · Closes 5pm` : `Closed · Opens 8am Mon–Fri`}</span>
            {time && <span style={{ opacity: 0.5 }}>· {time}</span>}
          </div>
          <p className="hero-eyebrow">Vehicle Repair · Littlehampton</p>
          <h1 className="hero-title">
            Fixed<br />
            <span className="accent">Properly.</span><br />
            First Time.
          </h1>
          <p className="hero-sub">
            Mechanical and electrical repairs, servicing and diagnostics.
            Trusted by drivers across Littlehampton and West Sussex since day one.
          </p>
          <div className="hero-actions">
            <a href="tel:01903367020" className="btn-primary">
              📞 Call Now — 01903 367 020
            </a>
            <a href="#services" className="btn-outline">
              Our Services
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="trust-bar">
        {[
          { icon: '⭐', text: '4.8 Stars on Google' },
          { icon: '✓', text: 'Mechanical & Electrical' },
          { icon: '✓', text: 'MOT Preparation' },
          { icon: '📍', text: 'Littlehampton, BN17' },
        ].map(t => (
          <div key={t.text} className="trust-item">
            <span>{t.icon}</span>
            <span>{t.text}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="stats-bar">
        {[
          { num: '4.8★', label: 'Google Rating' },
          { num: '21', label: 'Verified Reviews' },
          { num: '100%', label: 'Independent' },
          { num: '8am', label: 'Open From' },
        ].map(s => (
          <div key={s.label} className="stat-item">
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Services */}
      <div className="section" id="services">
        <p className="section-eyebrow">What We Do</p>
        <h2 className="section-title">No fuss. No upselling.<br />Just good work.</h2>
        <div className="services-grid">
          {services.map(s => (
            <div key={s.title} className="service-card">
              <div className="service-icon">{s.icon}</div>
              <div className="service-title">{s.title}</div>
              <div className="service-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why CK */}
      <div className="section" style={{ paddingTop: 0 }}>
        <p className="section-eyebrow">Why CK Repairs</p>
        <h2 className="section-title">We treat your car<br />like it's our own.</h2>
        <div className="why-grid">
          {[
            { n: '01', title: 'Honest Diagnosis', desc: 'We tell you exactly what\'s wrong and what it\'ll cost — before we touch anything.' },
            { n: '02', title: 'Electrical Specialists', desc: 'Modern cars are computers on wheels. We have the tools and knowledge to fix them.' },
            { n: '03', title: 'No Hidden Costs', desc: 'The price we quote is the price you pay. No surprises when you collect.' },
            { n: '04', title: 'Local & Trusted', desc: '4.8 stars from real customers in Littlehampton and the surrounding area.' },
          ].map(w => (
            <div key={w.n} className="why-card">
              <div className="why-num">{w.n}</div>
              <div className="why-title">{w.title}</div>
              <div className="why-desc">{w.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="section" style={{ paddingTop: 0 }}>
        <p className="section-eyebrow">Google Reviews</p>
        <h2 className="section-title">4.8 stars from<br />real customers.</h2>
        <div className="reviews-grid">
          {[
            { text: 'Absolutely brilliant service. Diagnosed an electrical fault that two other garages couldn\'t find. Honest and fairly priced.', author: 'Mark T., Littlehampton' },
            { text: 'Been going to CK for years. Always straight with you about what needs doing and what can wait. Wouldn\'t go anywhere else.', author: 'Sarah B., Worthing' },
            { text: 'Squeezed me in at short notice before a long drive. Checked everything over and found a brake issue I had no idea about. Potentially saved my life.', author: 'Dave R., Bognor Regis' },
          ].map(r => (
            <div key={r.author} className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"{r.text}"</p>
              <p className="review-author">— {r.author}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a
            href="https://www.google.com/maps/search/CK+REPAIRS+Unit+21+Quayside+Wick+Littlehampton+BN17+5SF"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#c0392b', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}
          >
            Read all 21 reviews on Google →
          </a>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-bg" />
        <h2 className="cta-title">Got a problem with your car?</h2>
        <p className="cta-sub">Call us now — we'll give you an honest assessment, no obligation.</p>
        <a href="tel:01903367020" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', display: 'inline-flex' }}>
          📞 01903 367 020
        </a>
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(240,237,232,0.25)', position: 'relative' }}>
          Mon–Fri 8am–5pm · Unit 21 Quayside, Wick, Littlehampton
        </p>
      </div>

      {/* Hours & Location */}
      <div className="section">
        <p className="section-eyebrow">Find Us</p>
        <h2 className="section-title">Opening hours<br />& location.</h2>
        <div className="hours-grid">
          <div>
            <div className="hours-table">
              {[
                { day: 'Monday', time: '8:00am – 5:00pm', open: true },
                { day: 'Tuesday', time: '8:00am – 5:00pm', open: true },
                { day: 'Wednesday', time: '8:00am – 5:00pm', open: true },
                { day: 'Thursday', time: '8:00am – 5:00pm', open: true },
                { day: 'Friday', time: '8:00am – 5:00pm', open: true },
                { day: 'Saturday', time: 'Closed', open: false },
                { day: 'Sunday', time: 'Closed', open: false },
              ].map(h => (
                <div key={h.day} className="hours-row">
                  <span className="hours-day">{h.day}</span>
                  <span className={`hours-time ${h.open ? 'open' : 'closed'}`}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="map-box">
            <span className="map-label">Address</span>
            <div className="map-address">
              Unit 21 Quayside<br />
              Wick, Littlehampton<br />
              BN17 5SF
            </div>
            <div className="map-detail">📞 01903 367 020</div>
            <div className="map-detail">📱 07771 986 910</div>
            <a
              href="https://maps.google.com/?q=Unit+21+Quayside+Wick+Littlehampton+BN17+5SF"
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-logo">CK<span>.</span>REPAIRS</div>
        <p className="footer-text">
          Unit 21 Quayside, Wick, Littlehampton BN17 5SF · © {new Date().getFullYear()}
        </p>
        <a href="tel:01903367020" className="footer-phone">01903 367 020</a>
      </footer>

    </main>
  )
}
