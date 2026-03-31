'use client'

import { useState } from 'react'

const SPOTS_REMAINING = 3 // update this manually as you sell

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

export default function ClaimPageClient({ garage }) {
  const [plan, setPlan] = useState(null) // 'free' | 'pro'
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const vehicleClasses = getVehicleClasses(garage)
  const address = formatAddress(garage)

  async function handleSubmit(selectedPlan) {
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
          plan: selectedPlan,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
      setPlan(selectedPlan)
    } catch (e) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <style>{css}</style>
        <div style={styles.successWrap}>
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✓</div>
            <h1 style={styles.successTitle}>You're on the list.</h1>
            <p style={styles.successSub}>
              {plan === 'pro'
                ? "We'll be in touch within 24 hours to get your site and Virtual Receptionist live."
                : "Your free listing is confirmed. We'll send you the details shortly."}
            </p>
            <p style={styles.successGarage}>{garage.trading_name}</p>
            <p style={styles.successRef}>Ref: {garage.site_number.toUpperCase()}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* Top banner */}
      <div style={styles.banner}>
        <span style={styles.bannerDot}>●</span>
        <span>We've built a free listing for your garage — claim it below</span>
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        <span style={styles.logo}>MOT<span style={styles.logoGreen}>match</span></span>
        <a href="/demo/brighton-mot-centre" target="_blank" style={styles.navCta}>
          See Full Demo →
        </a>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.badge}>DVSA APPROVED · {garage.site_number.toUpperCase()}</div>
          <h1 style={styles.heroTitle}>{garage.trading_name}</h1>
          <p style={styles.heroAddress}>{address}</p>
          {garage.phone && (
            <p style={styles.heroPhone}>📞 {garage.phone}</p>
          )}
          <div style={styles.classTags}>
            {vehicleClasses.map(c => (
              <span key={c} style={styles.classTag}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section style={styles.section}>
        <p style={styles.eyebrow}>What MOTmatch gives you</p>
        <h2 style={styles.sectionTitle}>Your garage, found online.</h2>
        <div style={styles.featureGrid}>
          {[
            { icon: '🔍', title: 'Found on Google', desc: 'Your listing appears when local drivers search for MOTs near them.' },
            { icon: '📞', title: 'Virtual Receptionist', desc: 'Answers every call 24/7. Books appointments. Texts you instantly. (Pro)' },
            { icon: '🌐', title: 'Your Own Website', desc: 'Professional microsite with your branding, pricing and services. (Pro)' },
            { icon: '📋', title: 'Booking Capture', desc: 'Every enquiry logged. Name, reg, service, preferred time. (Pro)' },
          ].map(f => (
            <div key={f.title} className="feature-card" style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <div style={styles.featureTitle}>{f.title}</div>
              <div style={styles.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>

        <div style={styles.demoPrompt}>
          <p style={styles.demoText}>See exactly what the Pro version looks like →</p>
          <a href="/demo/brighton-mot-centre" target="_blank" style={styles.demoLink}>
            View Live Demo
          </a>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ ...styles.section, paddingTop: 0 }}>
        <p style={styles.eyebrow}>Simple pricing</p>
        <h2 style={styles.sectionTitle}>Start free. Upgrade when ready.</h2>

        {/* Urgency bar */}
        <div style={styles.urgencyBar}>
          <span style={styles.urgencyDot}>●</span>
          <span>Launch pricing — only <strong>{SPOTS_REMAINING} spots remaining</strong> at £299 setup</span>
        </div>

        <div style={styles.pricingGrid}>
          {/* Free */}
          <div style={styles.pricingCard}>
            <div style={styles.planName}>Free Listing</div>
            <div style={styles.planPrice}>£0<span style={styles.planPer}>/forever</span></div>
            <ul style={styles.planFeatures}>
              {[
                '✓ Listed on MOTmatch',
                '✓ Address & phone visible',
                '✓ DVSA class info shown',
                '✓ Appears in local searches',
                '✗ No website',
                '✗ No Virtual Receptionist',
              ].map(f => (
                <li key={f} style={{ ...styles.planFeature, opacity: f.startsWith('✗') ? 0.35 : 1 }}>{f}</li>
              ))}
            </ul>
            <div style={styles.claimForm}>
              <input
                style={styles.input}
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Email address"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              {error && <p style={styles.errorText}>{error}</p>}
              <button
                style={styles.btnSecondary}
                onClick={() => handleSubmit('free')}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Claim Free Listing'}
              </button>
            </div>
          </div>

          {/* Pro */}
          <div style={{ ...styles.pricingCard, ...styles.pricingCardPro }}>
            <div style={styles.proLabel}>LAUNCH PRICE</div>
            <div style={styles.planName}>Pro — Full Package</div>
            <div style={styles.planPrice}>
              <span style={styles.strikethrough}>£499</span>
              {' '}£299<span style={styles.planPer}> setup</span>
            </div>
            <div style={styles.planMonthly}>
              then <span style={styles.strikethrough}>£99</span> £49<span style={styles.planPer}>/month</span>
            </div>
            <ul style={styles.planFeatures}>
              {[
                '✓ Everything in Free',
                '✓ Professional microsite',
                '✓ Virtual Receptionist 24/7',
                '✓ Local SEO setup',
                '✓ Booking capture & SMS alerts',
                '✓ Live in 48 hours',
              ].map(f => (
                <li key={f} style={styles.planFeature}>{f}</li>
              ))}
            </ul>
            <div style={styles.claimForm}>
              <input
                style={{ ...styles.input, ...styles.inputPro }}
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <input
                style={{ ...styles.input, ...styles.inputPro }}
                placeholder="Email address"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <input
                style={{ ...styles.input, ...styles.inputPro }}
                placeholder="Phone number (optional)"
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
              {error && <p style={styles.errorText}>{error}</p>}
              <button
                style={styles.btnPro}
                onClick={() => handleSubmit('pro')}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Claim Pro — Launch Price →'}
              </button>
              <p style={styles.noCard}>No payment now — we'll be in touch within 24hrs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section style={{ ...styles.section, paddingTop: 0 }}>
        <div style={styles.quoteGrid}>
          {[
            { q: 'Called at 9pm and got booked in instantly. Didn\'t expect that at all.', name: 'Daniel M., Brighton' },
            { q: 'One extra MOT booking a week more than covers the monthly fee.', name: 'Steve K., Worthing' },
            { q: 'Live in 48 hours, exactly as promised. Dead easy to set up.', name: 'Raj P., Hove' },
          ].map(r => (
            <div key={r.name} style={styles.quoteCard}>
              <div style={styles.stars}>★★★★★</div>
              <p style={styles.quoteText}>"{r.q}"</p>
              <p style={styles.quoteName}>— {r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <span style={styles.logo}>MOT<span style={styles.logoGreen}>match</span></span>
        <p style={styles.footerText}>Built for independent UK garages · {garage.site_number.toUpperCase()}</p>
      </footer>
    </div>
  )
}

const styles = {
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
  navCta: {
    background: '#4ade80',
    color: '#0a0a0a',
    padding: '0.5rem 1.2rem',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '0.85rem',
    textDecoration: 'none',
  },
  hero: {
    background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(74,222,128,0.07) 0%, transparent 70%), #0a0a0a',
    padding: '4rem 2rem',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    position: 'relative',
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
    marginBottom: '0.5rem',
  },
  heroPhone: {
    color: 'rgba(240,240,240,0.6)',
    fontSize: '0.95rem',
    marginBottom: '1rem',
  },
  classTags: { display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' },
  classTag: {
    background: 'rgba(74,222,128,0.1)',
    border: '1px solid rgba(74,222,128,0.3)',
    color: '#4ade80',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: 500,
  },
  section: {
    maxWidth: '1000px',
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
    marginBottom: '2rem',
    lineHeight: 1.1,
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '2rem',
  },
  featureCard: {
    background: '#0a0a0a',
    padding: '1.5rem',
    transition: 'background 0.2s',
  },
  featureIcon: { fontSize: '1.3rem', marginBottom: '0.75rem' },
  featureTitle: { fontWeight: 600, fontSize: '0.95rem', color: '#fff', marginBottom: '0.4rem' },
  featureDesc: { fontSize: '0.85rem', color: 'rgba(240,240,240,0.45)', lineHeight: 1.6 },
  demoPrompt: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(74,222,128,0.06)',
    border: '1px solid rgba(74,222,128,0.2)',
    borderRadius: '10px',
    padding: '1rem 1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  demoText: { color: 'rgba(240,240,240,0.7)', fontSize: '0.95rem' },
  demoLink: {
    background: '#4ade80',
    color: '#0a0a0a',
    padding: '0.5rem 1.2rem',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '0.9rem',
    textDecoration: 'none',
  },
  urgencyBar: {
    background: 'rgba(251,191,36,0.08)',
    border: '1px solid rgba(251,191,36,0.25)',
    borderRadius: '8px',
    padding: '0.75rem 1.25rem',
    fontSize: '0.88rem',
    color: '#fbbf24',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  urgencyDot: { fontSize: '0.5rem', animation: 'pulse 1.5s infinite' },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  pricingCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '2rem',
  },
  pricingCardPro: {
    background: 'rgba(74,222,128,0.04)',
    border: '1px solid rgba(74,222,128,0.3)',
  },
  proLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#4ade80',
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
  },
  planName: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '0.75rem',
  },
  planPrice: {
    fontSize: '2.2rem',
    fontWeight: 700,
    color: '#fff',
    fontFamily: "'Barlow Condensed', sans-serif",
    lineHeight: 1,
  },
  planPer: { fontSize: '1rem', fontWeight: 400, color: 'rgba(240,240,240,0.45)' },
  planMonthly: {
    fontSize: '0.9rem',
    color: 'rgba(240,240,240,0.5)',
    marginTop: '0.25rem',
    marginBottom: '1.25rem',
  },
  strikethrough: {
    textDecoration: 'line-through',
    color: 'rgba(240,240,240,0.3)',
    fontSize: '0.85em',
  },
  planFeatures: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 1.5rem 0',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: '1.25rem',
  },
  planFeature: {
    fontSize: '0.88rem',
    color: 'rgba(240,240,240,0.7)',
    padding: '0.3rem 0',
    lineHeight: 1.5,
  },
  claimForm: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#f0f0f0',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
  },
  inputPro: {
    background: 'rgba(74,222,128,0.05)',
    border: '1px solid rgba(74,222,128,0.2)',
  },
  btnSecondary: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#f0f0f0',
    padding: '0.85rem',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  btnPro: {
    background: '#4ade80',
    border: 'none',
    color: '#0a0a0a',
    padding: '0.95rem',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.1s',
  },
  noCard: {
    fontSize: '0.75rem',
    color: 'rgba(240,240,240,0.35)',
    textAlign: 'center',
    margin: 0,
  },
  errorText: { color: '#f87171', fontSize: '0.85rem', margin: 0 },
  quoteGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem',
  },
  quoteCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  stars: { color: '#fbbf24', fontSize: '0.9rem', marginBottom: '0.75rem' },
  quoteText: {
    fontSize: '0.9rem',
    color: 'rgba(240,240,240,0.65)',
    lineHeight: 1.6,
    marginBottom: '0.75rem',
    fontStyle: 'italic',
  },
  quoteName: { fontSize: '0.8rem', color: 'rgba(240,240,240,0.35)' },
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
  successWrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  successBox: {
    textAlign: 'center',
    maxWidth: '400px',
  },
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
  },
  successGarage: {
    fontWeight: 600,
    color: '#fff',
    fontSize: '1rem',
  },
  successRef: {
    fontSize: '0.78rem',
    color: 'rgba(240,240,240,0.3)',
    marginTop: '0.25rem',
  },
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Barlow+Condensed:wght@600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  .feature-card:hover { background: rgba(74,222,128,0.04) !important; }
  input::placeholder { color: rgba(240,240,240,0.25); }
  input:focus { border-color: rgba(74,222,128,0.5) !important; }
  button:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  button:disabled { opacity: 0.6; cursor: not-allowed; }
`
