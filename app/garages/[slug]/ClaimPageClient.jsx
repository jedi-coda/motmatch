'use client'

import { useState, useEffect } from 'react'

function getVehicleClasses(garage) {
  const classes = []
  if (garage.class_4 > 0) classes.push('Cars & Vans')
  if (garage.class_7 > 0) classes.push('Light Commercial')
  if (garage.class_1 > 0) classes.push('Motorcycles')
  if (garage.class_3 > 0) classes.push('3-Wheelers')
  if (garage.class_5 > 0) classes.push('Large Vehicles')
  return classes.length > 0 ? classes : ['MOT Testing']
}

function formatAddress(garage) {
  return [garage.address1, garage.address2, garage.address3, garage.town, garage.postcode]
    .filter(Boolean).join(', ')
}

function isClaimed(garage) {
  return garage.claimed === true || garage.status === 'claimed' || garage.status === 'active'
}

// ============================================================
// CLAIMED STATE — Professional Microsite
// ============================================================

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const DAY_LABELS = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday',
  thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
}
const DEFAULT_HOURS = {
  mon: { open: '08:00', close: '17:30' },
  tue: { open: '08:00', close: '17:30' },
  wed: { open: '08:00', close: '17:30' },
  thu: { open: '08:00', close: '17:30' },
  fri: { open: '08:00', close: '17:30' },
  sat: { open: '08:00', close: '12:00' },
  sun: null,
}

function ClaimedGarageView({ garage }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const address = formatAddress(garage)
  const vehicleClasses = getVehicleClasses(garage)
  const town = garage.town || ''
  const hours = garage.opening_hours || DEFAULT_HOURS
  const tagline = garage.tagline || `MOT Testing & Vehicle Repairs in ${town}`
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`

  useEffect(() => {
    const checkOpen = () => {
      const now = new Date()
      const dayKey = DAY_KEYS[now.getDay()]
      const dayHours = hours[dayKey]
      if (!dayHours) { setIsOpen(false); return }
      const [oH, oM] = dayHours.open.split(':').map(Number)
      const [cH, cM] = dayHours.close.split(':').map(Number)
      const nowMins = now.getHours() * 60 + now.getMinutes()
      setIsOpen(nowMins >= oH * 60 + oM && nowMins < cH * 60 + cM)
    }
    checkOpen()
    const t = setInterval(checkOpen, 60000)
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => { clearInterval(t); window.removeEventListener('scroll', onScroll) }
  }, [hours])

  const services = []
  if (garage.class_4 > 0 || garage.class_7 > 0) {
    services.push({ icon: '🚗', title: 'MOT Testing', desc: 'DVSA-approved MOT testing. Fast turnaround, honest results.' })
  }
  if (garage.class_7 > 0) {
    services.push({ icon: '🚐', title: 'Light Commercial MOT', desc: 'MOT testing for vans and light commercial vehicles up to 3.5 tonnes.' })
  }
  if (garage.class_1 > 0) {
    services.push({ icon: '🏍️', title: 'Motorcycle MOT', desc: 'Class 1 MOT testing for motorcycles and mopeds.' })
  }
  services.push({ icon: '🔧', title: 'Vehicle Repairs', desc: 'Mechanical repairs carried out by experienced technicians. All makes and models.' })
  if ((garage.additional_services || []).length > 0) {
    garage.additional_services.forEach(s => services.push({ icon: '✓', title: s, desc: '' }))
  }

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", background: '#0f0f0f', color: '#f0f0f0', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{claimedCss}</style>

      {/* Fixed Nav */}
      <nav className={`cm-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="cm-nav-inner">
          <span className="cm-logo">{garage.trading_name}</span>
          <div className="cm-nav-right">
            <span className={`cm-open-badge ${isOpen ? 'open' : 'closed'}`}>
              <span className="cm-dot">●</span>
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
            {garage.phone && (
              <a href={`tel:${garage.phone.replace(/\s/g, '')}`} className="cm-call-btn">
                📞 {garage.phone}
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="cm-hero">
        <div className="cm-hero-bg" />
        <div className="cm-hero-inner">
          <div className="cm-badge-row">
            <span className="cm-badge">DVSA Approved</span>
            {town && <span className="cm-badge">{town}</span>}
          </div>
          <h1 className="cm-h1">{garage.trading_name}</h1>
          <p className="cm-tagline">{tagline}</p>
          <div className="cm-hero-ctas">
            {garage.phone && (
              <a href={`tel:${garage.phone.replace(/\s/g, '')}`} className="cm-btn-primary">
                📞 Call Now — {garage.phone}
              </a>
            )}
            <a href="#services" className="cm-btn-secondary">Our Services</a>
          </div>
          <div className="cm-trust-bar">
            {vehicleClasses.map(c => (
              <span key={c} className="cm-trust-item">✓ {c}</span>
            ))}
            <span className="cm-trust-item">✓ DVSA Approved</span>
            <span className="cm-trust-item">✓ Independent Garage</span>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="cm-section">
        <div className="cm-section-inner">
          <p className="cm-eyebrow">What we do</p>
          <h2 className="cm-h2">Our Services</h2>
          <div className="cm-services-grid">
            {services.map((s, i) => (
              <div key={i} className="cm-service-card">
                <div className="cm-service-icon">{s.icon}</div>
                <h3 className="cm-service-title">{s.title}</h3>
                {s.desc && <p className="cm-service-desc">{s.desc}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="cm-section cm-section-alt">
        <div className="cm-section-inner">
          <p className="cm-eyebrow">About us</p>
          <h2 className="cm-h2">Why Choose {garage.trading_name}?</h2>
          <p className="cm-about-text">
            {garage.description ||
              `Independent DVSA-approved garage serving ${town} and the surrounding area. We're a trusted local workshop with experienced technicians — carrying out MOT testing and vehicle repairs to the highest standard, with honest advice and fast turnaround.`}
          </p>
          <div className="cm-pillars">
            {[
              { icon: '✓', title: 'DVSA Approved', desc: 'Fully authorised MOT testing station.' },
              { icon: '🔧', title: 'Experienced Technicians', desc: 'Expert hands-on service with all makes and models.' },
              { icon: '📍', title: 'Local & Independent', desc: `Proud to serve ${town} and surrounding areas.` },
              { icon: '📞', title: 'Easy to Book', desc: 'Call us for a fast, no-nonsense quote.' },
            ].map(p => (
              <div key={p.title} className="cm-pillar">
                <div className="cm-pillar-icon">{p.icon}</div>
                <h4 className="cm-pillar-title">{p.title}</h4>
                <p className="cm-pillar-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="cm-section">
        <div className="cm-section-inner">
          <p className="cm-eyebrow">Find us</p>
          <h2 className="cm-h2">Contact & Location</h2>
          <div className="cm-contact-grid">
            <div className="cm-contact-info">
              <div className="cm-contact-block">
                <p className="cm-contact-label">Address</p>
                <p className="cm-contact-value">{address}</p>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="cm-directions-btn">
                  Get Directions →
                </a>
              </div>
              {garage.phone && (
                <div className="cm-contact-block">
                  <p className="cm-contact-label">Phone</p>
                  <a href={`tel:${garage.phone.replace(/\s/g, '')}`} className="cm-phone-link">
                    {garage.phone}
                  </a>
                </div>
              )}
              <div className="cm-contact-block">
                <p className="cm-contact-label">Opening Hours</p>
                <div className="cm-hours-grid">
                  {Object.entries(hours).map(([day, h]) => (
                    <div key={day} className="cm-hours-row">
                      <span className="cm-hours-day">{DAY_LABELS[day] || day}</span>
                      <span className="cm-hours-time">
                        {h ? `${h.open} – ${h.close}` : 'Closed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="cm-map-wrap">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '12px', minHeight: '320px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location map"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="cm-footer">
        <p className="cm-footer-name">{garage.trading_name}</p>
        <p className="cm-footer-detail">{address}</p>
        {garage.phone && <p className="cm-footer-detail">{garage.phone}</p>}
        <p className="cm-footer-powered">
          Powered by <a href="https://motmatch.co.uk" className="cm-footer-link">MOTmatch</a>
        </p>
        <p className="cm-footer-copy">© 2026 {garage.trading_name}</p>
      </footer>
    </main>
  )
}

// ============================================================
// UNCLAIMED STATE — Sales Page
// ============================================================

function UnclaimedGarageView({ garage }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const vehicleClasses = getVehicleClasses(garage)
  const address = formatAddress(garage)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email) {
      setError('Please enter your name and email.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garage_id: garage.id,
          site_number: garage.site_number,
          garage_name: garage.trading_name,
          name: form.name,
          email: form.email,
          phone: form.phone,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={u.page}>
        <style>{unclaimedCss}</style>
        <div style={u.successWrap}>
          <div style={u.successBox}>
            <div style={u.successIcon}>✓</div>
            <h1 style={u.successTitle}>You're on the list.</h1>
            <p style={u.successSub}>
              We'll be in touch within 24 hours to get your AI receptionist set up for{' '}
              <strong>{garage.trading_name}</strong>.
            </p>
            <p style={u.successRef}>Ref: {garage.site_number.toUpperCase()}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={u.page}>
      <style>{unclaimedCss}</style>

      {/* Banner */}
      <div style={u.banner}>
        <span style={u.bannerDot}>●</span>
        <span>We've built a free page for your garage — claim it below</span>
      </div>

      {/* Nav */}
      <nav style={u.nav}>
        <span style={u.logo}>MOT<span style={u.logoGreen}>match</span></span>
        <span style={u.navTrust}>16,000+ UK garages indexed</span>
      </nav>

      {/* Hero */}
      <section style={u.hero}>
        <div style={u.heroInner}>
          <div style={u.badge}>DVSA APPROVED · {garage.site_number.toUpperCase()}</div>
          <h1 style={u.heroTitle}>{garage.trading_name}</h1>
          <p style={u.heroAddress}>{address}</p>
          {garage.phone && (
            <a href={`tel:${garage.phone.replace(/\s/g, '')}`} style={u.heroPhone}>
              📞 {garage.phone}
            </a>
          )}
          <div style={u.classTags}>
            {vehicleClasses.map(c => (
              <span key={c} style={u.classTag}>{c}</span>
            ))}
          </div>
          <p style={u.heroHeadline}>
            We've built a free page for your garage — and an AI receptionist to answer your calls.
          </p>
          <a href="#claim" style={u.heroCta}>Claim Your Free Page</a>
        </div>
      </section>

      {/* AI Receptionist */}
      <section style={u.section}>
        <p style={u.eyebrow}>AI Receptionist</p>
        <h2 style={u.sectionTitle}>Never miss a call again.</h2>
        <p style={u.sectionSub}>
          When you're under a car, our AI picks up the phone. It answers enquiries, books MOTs, and texts you the details — 24/7.
        </p>

        <div style={u.demoGrid}>
          <a href="tel:01273115423" style={u.demoCard} className="demo-card">
            <div style={u.demoIcon}>☎</div>
            <div style={u.demoNumber}>01273 115423</div>
            <div style={u.demoLabel}>Hear the male voice demo</div>
          </a>
          <a href="tel:01903802214" style={u.demoCard} className="demo-card">
            <div style={u.demoIcon}>☎</div>
            <div style={u.demoNumber}>01903 802214</div>
            <div style={u.demoLabel}>Hear the female voice demo</div>
          </a>
        </div>

        <p style={u.demoCaption}>
          Like what you hear? We'll set up a personalised version for{' '}
          <strong style={{ color: '#fff' }}>{garage.trading_name}</strong> — with your name, services,
          and hours — completely free for 5 days.
        </p>
      </section>

      {/* What You Get */}
      <section style={{ ...u.section, paddingTop: 0 }}>
        <p style={u.eyebrow}>What's included</p>
        <h2 style={u.sectionTitle}>Everything you need, free.</h2>
        <div style={u.checkList}>
          {[
            'Your own professional webpage (free, forever)',
            'Listed on MOTmatch for local drivers to find you',
            'AI receptionist trial — 5 days free, personalised to your garage',
            'Booking capture — every enquiry logged with name, reg, service needed',
            'Live in 48 hours',
          ].map(item => (
            <div key={item} style={u.checkItem}>
              <span style={u.checkMark}>✓</span>
              <span style={u.checkText}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Claim Form */}
      <section id="claim" style={{ ...u.section, paddingTop: 0 }}>
        <div style={u.formBox}>
          <p style={u.eyebrow}>Claim your page</p>
          <h2 style={u.formTitle}>Takes 30 seconds.</h2>
          <form onSubmit={handleSubmit} style={u.form}>
            <input
              style={u.input}
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              style={u.input}
              placeholder="Email address"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              style={u.input}
              placeholder="Phone number"
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
            {error && <p style={u.errorText}>{error}</p>}
            <button type="submit" style={u.btnPrimary} disabled={loading}>
              {loading ? 'Submitting...' : 'Claim My Free Page'}
            </button>
            <p style={u.disclaimer}>
              No payment needed. No commitment. We'll be in touch within 24hrs to get your AI receptionist set up.
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer style={u.footer}>
        <span style={u.logo}>MOT<span style={u.logoGreen}>match</span></span>
        <p style={u.footerText}>
          Built for independent UK garages · {garage.site_number.toUpperCase()}
        </p>
        <p style={u.footerPowered}>Powered by MOTmatch</p>
      </footer>
    </div>
  )
}

// ============================================================
// MAIN EXPORT
// ============================================================

export default function ClaimPageClient({ garage }) {
  if (isClaimed(garage)) return <ClaimedGarageView garage={garage} />
  return <UnclaimedGarageView garage={garage} />
}

// ============================================================
// UNCLAIMED STYLES
// ============================================================

const u = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    background: '#0a0a0a',
    color: '#f0f0f0',
    minHeight: '100vh',
  },
  banner: {
    background: '#4ade80',
    color: '#0a0a0a',
    textAlign: 'center',
    padding: '0.6rem 1rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  bannerDot: { fontSize: '0.5rem', animation: 'pulse 2s infinite' },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.2rem 2rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  logo: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 800,
    fontSize: '1.5rem',
    letterSpacing: '0.04em',
    color: '#fff',
  },
  logoGreen: { color: '#4ade80' },
  navTrust: {
    fontSize: '0.78rem',
    color: 'rgba(240,240,240,0.35)',
    fontWeight: 500,
  },
  hero: {
    background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(74,222,128,0.07) 0%, transparent 70%), #0a0a0a',
    padding: '4rem 2rem',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  heroInner: { maxWidth: '600px', margin: '0 auto' },
  badge: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#4ade80',
    textTransform: 'uppercase',
    marginBottom: '1rem',
  },
  heroTitle: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.05,
    marginBottom: '0.75rem',
  },
  heroAddress: {
    color: 'rgba(240,240,240,0.5)',
    fontSize: '0.95rem',
    marginBottom: '0.4rem',
  },
  heroPhone: {
    display: 'block',
    color: 'rgba(240,240,240,0.7)',
    fontSize: '1rem',
    fontWeight: 500,
    marginBottom: '1rem',
    textDecoration: 'none',
  },
  classTags: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '2rem',
  },
  classTag: {
    background: 'rgba(74,222,128,0.1)',
    border: '1px solid rgba(74,222,128,0.3)',
    color: '#4ade80',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: 500,
  },
  heroHeadline: {
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    color: 'rgba(240,240,240,0.75)',
    lineHeight: 1.5,
    marginBottom: '2rem',
    maxWidth: '480px',
    margin: '0 auto 2rem',
  },
  heroCta: {
    display: 'inline-block',
    background: '#4ade80',
    color: '#0a0a0a',
    padding: '0.9rem 2rem',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '1rem',
    textDecoration: 'none',
    transition: 'opacity 0.2s, transform 0.1s',
  },
  section: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '4rem 1.5rem',
  },
  eyebrow: {
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    color: '#4ade80',
    textTransform: 'uppercase',
    marginBottom: '0.75rem',
  },
  sectionTitle: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '1rem',
    lineHeight: 1.1,
  },
  sectionSub: {
    color: 'rgba(240,240,240,0.55)',
    fontSize: '1rem',
    lineHeight: 1.6,
    marginBottom: '2.5rem',
    maxWidth: '560px',
  },
  demoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  demoCard: {
    display: 'block',
    background: 'rgba(74,222,128,0.06)',
    border: '2px solid rgba(74,222,128,0.35)',
    borderRadius: '14px',
    padding: '2rem 1.5rem',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'border-color 0.2s, background 0.2s',
    cursor: 'pointer',
  },
  demoIcon: {
    fontSize: '2rem',
    marginBottom: '0.75rem',
  },
  demoNumber: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '1.6rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '0.5rem',
    letterSpacing: '0.02em',
  },
  demoLabel: {
    fontSize: '0.85rem',
    color: 'rgba(240,240,240,0.55)',
  },
  demoCaption: {
    color: 'rgba(240,240,240,0.5)',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    textAlign: 'center',
    maxWidth: '520px',
    margin: '0 auto',
  },
  checkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(255,255,255,0.02)',
  },
  checkMark: {
    color: '#4ade80',
    fontWeight: 700,
    fontSize: '1rem',
    flexShrink: 0,
    marginTop: '0.05em',
  },
  checkText: {
    color: 'rgba(240,240,240,0.75)',
    fontSize: '0.95rem',
    lineHeight: 1.5,
  },
  formBox: {
    background: 'rgba(74,222,128,0.04)',
    border: '1px solid rgba(74,222,128,0.2)',
    borderRadius: '16px',
    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
    maxWidth: '480px',
    margin: '0 auto',
  },
  formTitle: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '2rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '1.5rem',
    lineHeight: 1.1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '0.85rem 1rem',
    color: '#f0f0f0',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
  },
  errorText: { color: '#f87171', fontSize: '0.85rem', margin: 0 },
  btnPrimary: {
    background: '#4ade80',
    border: 'none',
    color: '#0a0a0a',
    padding: '1rem',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.1s',
    marginTop: '0.25rem',
  },
  disclaimer: {
    fontSize: '0.75rem',
    color: 'rgba(240,240,240,0.3)',
    textAlign: 'center',
    margin: 0,
    lineHeight: 1.5,
  },
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: '2rem',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '0.78rem',
    color: 'rgba(240,240,240,0.25)',
    marginTop: '0.5rem',
  },
  footerPowered: {
    fontSize: '0.72rem',
    color: 'rgba(240,240,240,0.15)',
    marginTop: '0.25rem',
  },
  successWrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  successBox: { textAlign: 'center', maxWidth: '400px' },
  successIcon: {
    width: '64px',
    height: '64px',
    background: 'rgba(74,222,128,0.15)',
    border: '2px solid #4ade80',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: '#4ade80',
    margin: '0 auto 1.5rem',
  },
  successTitle: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#fff',
    marginBottom: '1rem',
  },
  successSub: {
    color: 'rgba(240,240,240,0.6)',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
    fontSize: '1rem',
  },
  successRef: {
    fontSize: '0.78rem',
    color: 'rgba(240,240,240,0.3)',
    marginTop: '0.25rem',
  },
}

// ============================================================
// CSS STRINGS
// ============================================================

const unclaimedCss = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Barlow+Condensed:wght@600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  input::placeholder { color: rgba(240,240,240,0.25); }
  input:focus { border-color: rgba(74,222,128,0.5) !important; }
  button:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  button:disabled { opacity: 0.6; cursor: not-allowed; }
  a[href^="tel"]:hover { opacity: 0.85; }
  .demo-card:hover { border-color: rgba(74,222,128,0.7) !important; background: rgba(74,222,128,0.1) !important; }
  @media (max-width: 600px) {
    nav { padding: 1rem !important; }
  }
`

const claimedCss = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Barlow+Condensed:wght@600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .cm-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 1rem 2rem;
    transition: background 0.3s, border-color 0.3s;
  }
  .cm-nav.scrolled {
    background: rgba(15,15,15,0.95);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(74,222,128,0.15);
  }
  .cm-nav-inner {
    max-width: 1100px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem;
  }
  .cm-logo {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800; font-size: 1.4rem;
    color: #f0f0f0; letter-spacing: 0.03em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 220px;
  }
  .cm-nav-right {
    display: flex; align-items: center; gap: 1rem; flex-shrink: 0;
  }
  .cm-open-badge {
    font-size: 0.78rem; font-weight: 600;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .cm-open-badge.open { color: #4ade80; }
  .cm-open-badge.closed { color: rgba(240,240,240,0.35); }
  .cm-dot { font-size: 0.45rem; }
  .cm-call-btn {
    background: #4ade80; color: #0a0a0a;
    padding: 0.5rem 1.1rem; border-radius: 6px;
    font-weight: 600; font-size: 0.85rem; text-decoration: none;
    transition: opacity 0.2s;
    white-space: nowrap;
  }
  .cm-call-btn:hover { opacity: 0.88; }

  .cm-hero {
    min-height: 100vh;
    display: flex; flex-direction: column; justify-content: center;
    padding: 8rem 2rem 5rem;
    position: relative; overflow: hidden;
    background: radial-gradient(ellipse 70% 70% at 60% 50%, rgba(74,222,128,0.08) 0%, transparent 60%), #0f0f0f;
  }
  .cm-hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(74,222,128,0.03) 0%, transparent 60%);
    pointer-events: none;
  }
  .cm-hero-inner {
    max-width: 700px; position: relative; z-index: 1;
  }
  .cm-badge-row {
    display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;
  }
  .cm-badge {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: #4ade80;
    border: 1px solid rgba(74,222,128,0.3);
    padding: 0.25rem 0.7rem; border-radius: 4px;
  }
  .cm-h1 {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 800; color: #fff; line-height: 1.0;
    margin-bottom: 1rem;
  }
  .cm-tagline {
    font-size: clamp(1rem, 2vw, 1.2rem);
    color: rgba(240,240,240,0.55);
    line-height: 1.5; margin-bottom: 2rem;
    max-width: 520px;
  }
  .cm-hero-ctas {
    display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.5rem;
  }
  .cm-btn-primary {
    background: #4ade80; color: #0a0a0a;
    padding: 0.9rem 1.8rem; border-radius: 8px;
    font-weight: 700; font-size: 1rem; text-decoration: none;
    transition: opacity 0.2s, transform 0.1s;
    display: inline-flex; align-items: center; gap: 0.4rem;
  }
  .cm-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .cm-btn-secondary {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(240,240,240,0.8);
    padding: 0.9rem 1.8rem; border-radius: 8px;
    font-weight: 600; font-size: 1rem; text-decoration: none;
    transition: border-color 0.2s;
  }
  .cm-btn-secondary:hover { border-color: rgba(255,255,255,0.4); }
  .cm-trust-bar {
    display: flex; gap: 1rem; flex-wrap: wrap;
  }
  .cm-trust-item {
    font-size: 0.82rem; color: rgba(240,240,240,0.45); font-weight: 500;
  }

  .cm-section {
    padding: 5rem 2rem;
  }
  .cm-section-alt {
    background: #141414;
  }
  .cm-section-inner {
    max-width: 1000px; margin: 0 auto;
  }
  .cm-eyebrow {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; color: #4ade80; margin-bottom: 0.75rem;
  }
  .cm-h2 {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    font-weight: 700; color: #fff; line-height: 1.1;
    margin-bottom: 2rem;
  }

  .cm-services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px; overflow: hidden;
  }
  .cm-service-card {
    background: #0f0f0f; padding: 1.75rem 1.5rem;
    transition: background 0.2s;
  }
  .cm-service-card:hover { background: rgba(74,222,128,0.04); }
  .cm-service-icon { font-size: 1.5rem; margin-bottom: 0.75rem; }
  .cm-service-title {
    font-weight: 600; font-size: 1rem; color: #fff; margin-bottom: 0.5rem;
  }
  .cm-service-desc {
    font-size: 0.85rem; color: rgba(240,240,240,0.4); line-height: 1.6;
  }

  .cm-about-text {
    font-size: 1.05rem; color: rgba(240,240,240,0.6);
    line-height: 1.75; margin-bottom: 2.5rem; max-width: 680px;
  }
  .cm-pillars {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
  }
  .cm-pillar {
    padding: 1.5rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
  }
  .cm-pillar-icon { font-size: 1.3rem; margin-bottom: 0.75rem; }
  .cm-pillar-title {
    font-weight: 600; font-size: 0.95rem; color: #fff; margin-bottom: 0.4rem;
  }
  .cm-pillar-desc {
    font-size: 0.82rem; color: rgba(240,240,240,0.4); line-height: 1.5;
  }

  .cm-contact-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start;
  }
  .cm-contact-block { margin-bottom: 1.75rem; }
  .cm-contact-label {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: rgba(240,240,240,0.3);
    margin-bottom: 0.4rem;
  }
  .cm-contact-value {
    color: rgba(240,240,240,0.75); font-size: 0.95rem; line-height: 1.5;
    margin-bottom: 0.75rem;
  }
  .cm-directions-btn {
    display: inline-block;
    color: #4ade80; font-size: 0.85rem; font-weight: 600;
    text-decoration: none; transition: opacity 0.2s;
  }
  .cm-directions-btn:hover { opacity: 0.75; }
  .cm-phone-link {
    color: #fff; font-size: 1.1rem; font-weight: 600;
    text-decoration: none; transition: color 0.2s;
  }
  .cm-phone-link:hover { color: #4ade80; }
  .cm-hours-grid { display: flex; flex-direction: column; gap: 0.35rem; }
  .cm-hours-row {
    display: flex; justify-content: space-between;
    font-size: 0.85rem; padding: 0.3rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .cm-hours-day { color: rgba(240,240,240,0.45); }
  .cm-hours-time { color: rgba(240,240,240,0.75); font-weight: 500; }
  .cm-map-wrap {
    border-radius: 12px; overflow: hidden;
    border: 1px solid rgba(255,255,255,0.08);
    min-height: 320px;
  }

  .cm-footer {
    background: #0a0a0a;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 2.5rem 2rem;
    text-align: center;
  }
  .cm-footer-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.3rem; font-weight: 700; color: #fff;
    margin-bottom: 0.5rem;
  }
  .cm-footer-detail {
    font-size: 0.82rem; color: rgba(240,240,240,0.3);
    margin-bottom: 0.2rem;
  }
  .cm-footer-powered {
    font-size: 0.72rem; color: rgba(240,240,240,0.2);
    margin-top: 1rem;
  }
  .cm-footer-link { color: #4ade80; text-decoration: none; }
  .cm-footer-copy {
    font-size: 0.72rem; color: rgba(240,240,240,0.15);
    margin-top: 0.25rem;
  }

  @media (max-width: 700px) {
    .cm-nav { padding: 0.85rem 1rem; }
    .cm-hero { padding: 7rem 1.25rem 4rem; }
    .cm-logo { font-size: 1.1rem; max-width: 160px; }
    .cm-call-btn { font-size: 0.8rem; padding: 0.45rem 0.9rem; }
    .cm-contact-grid { grid-template-columns: 1fr; gap: 2rem; }
    .cm-section { padding: 3.5rem 1.25rem; }
    .cm-hero-ctas { flex-direction: column; }
    .cm-btn-primary, .cm-btn-secondary { text-align: center; justify-content: center; }
  }
`
