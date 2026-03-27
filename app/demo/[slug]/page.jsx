import { Inter } from 'next/font/google';
import ClaimForm from './ClaimForm';

const inter = Inter({ subsets: ['latin'] });

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// Edit this object to customise the demo for each garage.
const config = {
  garageName:        'Brighton MOT Centre',
  town:              'Brighton',
  phone:             '01273 115423',
  phoneTel:          '01273115423',
  motPrice:          '£49.95',
  rating:            '4.8',
  reviewCount:       '203',
  address:           'Brighton, East Sussex',
  heroImage:         'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&q=80',
  googleReviewLink:  '#',
  previewText:       'Free preview built for Brighton MOT Centre',
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const HOURS = {
  0: null,
  1: { open: '08:00', close: '18:00' },
  2: { open: '08:00', close: '18:00' },
  3: { open: '08:00', close: '18:00' },
  4: { open: '08:00', close: '18:00' },
  5: { open: '08:00', close: '18:00' },
  6: { open: '08:00', close: '13:00' },
};

const HOUR_ROWS = [
  { label: 'Mon – Fri', days: [1, 2, 3, 4, 5], slot: HOURS[1] },
  { label: 'Saturday',  days: [6],              slot: HOURS[6] },
  { label: 'Sunday',    days: [0],              slot: HOURS[0] },
];

function formatSlot(slot) {
  return slot ? `${slot.open} – ${slot.close}` : 'Closed';
}

function getUKStatus() {
  const londonStr  = new Date().toLocaleString('en-US', { timeZone: 'Europe/London' });
  const londonDate = new Date(londonStr);
  const dayIndex   = londonDate.getDay();
  const hour       = londonDate.getHours();
  const nowMins    = hour * 60 + londonDate.getMinutes();

  const slot   = HOURS[dayIndex];
  let isOpen   = false;
  if (slot) {
    const [oh, om] = slot.open.split(':').map(Number);
    const [ch, cm] = slot.close.split(':').map(Number);
    isOpen = nowMins >= oh * 60 + om && nowMins < ch * 60 + cm;
  }

  const greeting = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';
  return { dayIndex, isOpen, greeting };
}

// ─── METADATA ─────────────────────────────────────────────────────────────────

export const metadata = {
  title:       `MOT ${config.town} — ${config.motPrice} | ${config.garageName}`,
  description: `Book your MOT in ${config.town} from just ${config.motPrice}. DVSA-approved, while-you-wait service at ${config.garageName}. Free retest included. Call ${config.phone}.`,
};

export const dynamic = 'force-dynamic';

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const { dayIndex, isOpen, greeting } = getUKStatus();

  return (
    <>
      {/* Pulse keyframes — inline style tag works in server components */}
      <style>{`
        @keyframes pulse-cta {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.45); }
          60%       { box-shadow: 0 0 0 14px rgba(34,197,94,0); }
        }
        .pulse { animation: pulse-cta 2.2s ease-out infinite; }
      `}</style>

      <main
        className={inter.className}
        style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}
      >

        {/* ── 1. PREVIEW BANNER ──────────────────────────────────────── */}
        <div
          style={{
            position:        'sticky',
            top:             0,
            zIndex:          100,
            backgroundColor: '#f59e0b',
            padding:         '10px 20px',
            textAlign:       'center',
            fontSize:        '0.82rem',
            fontWeight:      600,
            color:           '#1a1a1a',
            lineHeight:      1.5,
          }}
        >
          👋 This is a free example for MOT garages in Brighton
        </div>

        {/* ── 2. HERO ────────────────────────────────────────────────── */}
        <section
          style={{
            minHeight:          '100vh',
            display:            'flex',
            flexDirection:      'column',
            justifyContent:     'center',
            alignItems:         'center',
            textAlign:          'center',
            padding:            '0 24px',
            backgroundImage:    `linear-gradient(rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.75) 100%), url(${config.heroImage})`,
            backgroundSize:     'cover',
            backgroundPosition: 'center',
            backgroundRepeat:   'no-repeat',
          }}
        >
          <p
            style={{
              fontSize:      '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color:         '#22c55e',
              marginBottom:  '18px',
              fontWeight:    600,
            }}
          >
            DVSA Approved · {config.garageName}
          </p>

          <p
            style={{
              fontSize:     '1.1rem',
              color:        '#ffffff',
              fontStyle:    'italic',
              fontWeight:   300,
              marginBottom: '10px',
              opacity:      0.8,
            }}
          >
            {greeting}
          </p>

          <h1
            style={{
              fontSize:      'clamp(2.2rem, 7vw, 4.2rem)',
              fontWeight:    800,
              lineHeight:    1.08,
              letterSpacing: '-0.02em',
              marginBottom:  '20px',
              maxWidth:      '780px',
            }}
          >
            MOT in {config.town} —{' '}
            <span style={{ color: '#22c55e' }}>{config.motPrice}</span>
          </h1>

          <p
            style={{
              fontSize:     'clamp(0.95rem, 2.5vw, 1.15rem)',
              color:        '#d4d4d4',
              marginBottom: '40px',
              maxWidth:     '480px',
              lineHeight:   1.65,
            }}
          >
            DVSA-approved. While you wait. Free retest included.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div>
              <a
                href={`tel:${config.phoneTel}`}
                className="pulse"
                style={{
                  display:         'inline-block',
                  backgroundColor: '#22c55e',
                  color:           '#000000',
                  fontWeight:      700,
                  fontSize:        '1rem',
                  padding:         '16px 32px',
                  borderRadius:    '8px',
                  textDecoration:  'none',
                  letterSpacing:   '0.01em',
                  marginBottom:    '8px',
                }}
              >
                📞 Try the Virtual Receptionist
              </a>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                This is a live demo — try it now
              </p>
            </div>
            <a
              href="#ai-receptionist"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                backdropFilter:  'blur(6px)',
                color:           '#ffffff',
                fontWeight:      600,
                fontSize:        '1rem',
                padding:         '16px 32px',
                borderRadius:    '8px',
                textDecoration:  'none',
                border:          '1px solid rgba(255,255,255,0.18)',
                letterSpacing:   '0.01em',
              }}
            >
              See How It Works
            </a>
          </div>
        </section>

        {/* ── 3. TRUST BAR ───────────────────────────────────────────── */}
        <section
          style={{
            backgroundColor: '#111111',
            borderTop:       '1px solid #1e1e1e',
            borderBottom:    '1px solid #1e1e1e',
            padding:         '20px 24px',
          }}
        >
          <div
            style={{
              maxWidth:            '900px',
              margin:              '0 auto',
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap:                 '10px',
              textAlign:           'center',
            }}
          >
            {[
              { icon: '✓', label: 'DVSA Approved' },
              { icon: '★', label: `${config.rating} · ${config.reviewCount} Reviews` },
              { icon: '↩', label: 'Free Retest' },
              { icon: '⏱', label: 'While You Wait' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  gap:            '7px',
                  fontSize:       '0.85rem',
                  fontWeight:     600,
                  color:          '#e5e5e5',
                }}
              >
                <span style={{ color: '#22c55e' }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. AI RECEPTIONIST ─────────────────────────────────────── */}
        <section
          id="ai-receptionist"
          style={{
            backgroundColor: '#080808',
            borderBottom:    '1px solid #1a1a1a',
            padding:         '90px 24px',
          }}
        >
          <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
            <p
              style={{
                fontSize:      '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color:         '#22c55e',
                marginBottom:  '16px',
                fontWeight:    600,
              }}
            >
              Virtual Receptionist
            </p>
            <h2
              style={{
                fontSize:      'clamp(1.8rem, 5vw, 2.8rem)',
                fontWeight:    800,
                marginBottom:  '16px',
                letterSpacing: '-0.02em',
                lineHeight:    1.1,
              }}
            >
              Never Miss Another Booking
            </h2>
            <p
              style={{
                fontSize:     'clamp(0.95rem, 2vw, 1.1rem)',
                color:        '#a3a3a3',
                marginBottom: '56px',
                maxWidth:     '580px',
                margin:       '0 auto 56px',
                lineHeight:   1.65,
              }}
            >
              Call{' '}
              <a
                href={`tel:${config.phoneTel}`}
                style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 600 }}
              >
                {config.phone}
              </a>{' '}
              right now and hear exactly how your Virtual Receptionist answers — 24 hours a day, 7 days a week.
            </p>

            {/* Feature cards */}
            <div
              style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap:                 '16px',
                marginBottom:        '52px',
                textAlign:           'left',
              }}
            >
              {[
                {
                  emoji: '📞',
                  title: 'Answers Every Call',
                  body:  'Never goes to voicemail. Every caller gets a professional response, every time.',
                },
                {
                  emoji: '📋',
                  title: 'Captures Everything',
                  body:  'Name, vehicle reg, service needed, and preferred time — logged without you lifting a finger.',
                },
                {
                  emoji: '📱',
                  title: 'Instant SMS Alert',
                  body:  'Full booking details sent straight to your phone the moment they hang up.',
                },
              ].map(({ emoji, title, body }) => (
                <div
                  key={title}
                  style={{
                    backgroundColor: '#111111',
                    border:          '1px solid #1e1e1e',
                    borderRadius:    '14px',
                    padding:         '28px 24px',
                  }}
                >
                  <div style={{ fontSize: '1.8rem', marginBottom: '14px', lineHeight: 1 }}>
                    {emoji}
                  </div>
                  <h3
                    style={{
                      fontSize:     '1rem',
                      fontWeight:   700,
                      marginBottom: '10px',
                      color:        '#ffffff',
                    }}
                  >
                    {title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#a3a3a3', lineHeight: 1.65, margin: 0 }}>
                    {body}
                  </p>
                </div>
              ))}
            </div>

            {/* Main pulsing CTA */}
            <a
              href={`tel:${config.phoneTel}`}
              className="pulse"
              style={{
                display:         'inline-block',
                backgroundColor: '#22c55e',
                color:           '#000000',
                fontWeight:      800,
                fontSize:        'clamp(1rem, 3vw, 1.2rem)',
                padding:         '20px 48px',
                borderRadius:    '10px',
                textDecoration:  'none',
                letterSpacing:   '0.01em',
                marginBottom:    '10px',
              }}
            >
              📞 Try the Virtual Receptionist
            </a>
            <p style={{ fontSize: '0.78rem', color: '#555555', margin: 0 }}>
              This is a live demo — try it now
            </p>
          </div>
        </section>

        {/* ── 5. WHY CHOOSE US ───────────────────────────────────────── */}
        <section style={{ padding: '90px 24px', maxWidth: '1020px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize:      'clamp(1.6rem, 4vw, 2.25rem)',
              fontWeight:    700,
              textAlign:     'center',
              marginBottom:  '48px',
              letterSpacing: '-0.01em',
            }}
          >
            Why {config.town} drivers choose us
          </h2>

          <div
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap:                 '20px',
            }}
          >
            {[
              {
                emoji: '🔧',
                title: 'Local & Trusted',
                body:  `Serving ${config.town} and the surrounding area for over 20 years. Thousands of local cars through our doors every year.`,
              },
              {
                emoji: '💷',
                title: 'Transparent Pricing',
                body:  `${config.motPrice} fixed price. No hidden costs, no upselling. You pay what you see — full stop.`,
              },
              {
                emoji: '⚡',
                title: 'Fast Turnaround',
                body:  'Most MOTs completed within the hour. Our while-you-wait service means zero disruption to your day.',
              },
            ].map(({ emoji, title, body }) => (
              <div
                key={title}
                style={{
                  backgroundColor: '#111111',
                  border:          '1px solid #1e1e1e',
                  borderRadius:    '14px',
                  padding:         '36px 30px',
                }}
              >
                <div style={{ fontSize: '1.9rem', marginBottom: '18px', lineHeight: 1 }}>
                  {emoji}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px', color: '#ffffff' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#a3a3a3', lineHeight: 1.7, margin: 0 }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. REVIEWS ─────────────────────────────────────────────── */}
        <section
          style={{
            backgroundColor: '#0d0d0d',
            borderTop:       '1px solid #1a1a1a',
            borderBottom:    '1px solid #1a1a1a',
            padding:         '90px 24px',
          }}
        >
          <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
            <h2
              style={{
                fontSize:      'clamp(1.6rem, 4vw, 2.25rem)',
                fontWeight:    700,
                textAlign:     'center',
                marginBottom:  '10px',
                letterSpacing: '-0.01em',
              }}
            >
              {config.rating}★ Rated on Google
            </h2>
            <p
              style={{
                textAlign:    'center',
                color:        '#a3a3a3',
                fontSize:     '0.92rem',
                marginBottom: '48px',
              }}
            >
              Based on {config.reviewCount} verified reviews
            </p>

            <div
              style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap:                 '16px',
                marginBottom:        '36px',
              }}
            >
              {[
                {
                  name: 'James R.',
                  text: 'Booked my MOT online, in and out in under an hour. Brilliant service.',
                },
                {
                  name: 'Sarah T.',
                  text: 'Been using them for years. Always honest, never try to upsell. Exactly what you want from a garage.',
                },
                {
                  name: 'Daniel M.',
                  text: 'Virtual Receptionist is brilliant — called at 9pm and got booked in instantly. Didn\'t expect that at all.',
                },
              ].map((review) => (
                <div
                  key={review.name}
                  style={{
                    backgroundColor: '#111111',
                    border:          '1px solid #1e1e1e',
                    borderRadius:    '14px',
                    padding:         '26px 26px 30px',
                  }}
                >
                  <div
                    style={{
                      color:         '#f59e0b',
                      fontSize:      '0.95rem',
                      marginBottom:  '14px',
                      letterSpacing: '2px',
                    }}
                  >
                    ★★★★★
                  </div>
                  <p
                    style={{
                      fontSize:     '0.92rem',
                      color:        '#d4d4d4',
                      lineHeight:   1.7,
                      marginBottom: '18px',
                      fontStyle:    'italic',
                    }}
                  >
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#888888', margin: 0 }}>
                    — {review.name}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <a
                href={config.googleReviewLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#22c55e', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}
              >
                Read all {config.reviewCount} reviews on Google →
              </a>
            </div>
          </div>
        </section>

        {/* ── 7. OPENING HOURS ───────────────────────────────────────── */}
        <section style={{ padding: '90px 24px', backgroundColor: '#0a0a0a' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            <h2
              style={{
                fontSize:      'clamp(1.6rem, 4vw, 2.25rem)',
                fontWeight:    700,
                marginBottom:  '12px',
                letterSpacing: '-0.01em',
              }}
            >
              Opening Hours
            </h2>

            {/* Open / Closed pill */}
            <div style={{ marginBottom: '36px' }}>
              <span
                style={{
                  display:         'inline-flex',
                  alignItems:      'center',
                  gap:             '7px',
                  backgroundColor: isOpen ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                  color:           isOpen ? '#22c55e' : '#f87171',
                  border:          `1px solid ${isOpen ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  borderRadius:    '999px',
                  padding:         '6px 16px',
                  fontSize:        '0.83rem',
                  fontWeight:      600,
                  letterSpacing:   '0.03em',
                }}
              >
                <span
                  style={{
                    width:           '7px',
                    height:          '7px',
                    borderRadius:    '50%',
                    backgroundColor: isOpen ? '#22c55e' : '#f87171',
                    display:         'inline-block',
                    flexShrink:      0,
                  }}
                />
                {isOpen ? 'Open Now' : 'Closed'}
              </span>
            </div>

            <div
              style={{
                backgroundColor: '#111111',
                border:          '1px solid #1e1e1e',
                borderRadius:    '14px',
                overflow:        'hidden',
              }}
            >
              {HOUR_ROWS.map((row, i) => {
                const isToday = row.days.includes(dayIndex);
                return (
                  <div
                    key={row.label}
                    style={{
                      display:         'flex',
                      justifyContent:  'space-between',
                      alignItems:      'center',
                      padding:         '17px 26px',
                      borderTop:       i === 0 ? 'none' : '1px solid #1e1e1e',
                      backgroundColor: isToday ? 'rgba(34,197,94,0.06)' : 'transparent',
                    }}
                  >
                    <span
                      style={{
                        fontSize:   '0.92rem',
                        fontWeight: isToday ? 700 : 400,
                        color:      isToday ? '#22c55e' : '#d4d4d4',
                      }}
                    >
                      {row.label}
                      {isToday && (
                        <span
                          style={{
                            marginLeft:      '9px',
                            fontSize:        '0.68rem',
                            backgroundColor: 'rgba(34,197,94,0.15)',
                            color:           '#22c55e',
                            borderRadius:    '4px',
                            padding:         '2px 6px',
                            fontWeight:      600,
                            letterSpacing:   '0.05em',
                            textTransform:   'uppercase',
                            verticalAlign:   'middle',
                          }}
                        >
                          Today
                        </span>
                      )}
                    </span>
                    <span
                      style={{
                        fontSize:   '0.92rem',
                        fontWeight: isToday ? 700 : 400,
                        color:      isToday ? '#22c55e' : (row.slot ? '#d4d4d4' : '#555555'),
                      }}
                    >
                      {formatSlot(row.slot)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 8. CLAIM SECTION ───────────────────────────────────────── */}
        <section
          style={{
            backgroundColor: '#080808',
            borderTop:       '1px solid #1a1a1a',
            padding:         '100px 24px',
            textAlign:       'center',
          }}
        >
          <div style={{ maxWidth: '620px', margin: '0 auto' }}>
            <p
              style={{
                fontSize:      '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color:         '#22c55e',
                marginBottom:  '16px',
                fontWeight:    600,
              }}
            >
              Claim Your Site
            </p>
            <h2
              style={{
                fontSize:      'clamp(1.8rem, 5vw, 2.8rem)',
                fontWeight:    800,
                marginBottom:  '20px',
                letterSpacing: '-0.02em',
                lineHeight:    1.1,
              }}
            >
              Like what you see?
            </h2>
            <p
              style={{
                fontSize:     'clamp(0.95rem, 2vw, 1.05rem)',
                color:        '#a3a3a3',
                marginBottom: '48px',
                lineHeight:   1.7,
              }}
            >
              This is an example of what your garage could look like online. We build high-converting sites
              for MOT stations across Brighton and the surrounding area — with a 24/7 virtual receptionist
              that answers every call, captures every booking, and texts you instantly.
            </p>

            {/* Pricing box */}
            <div
              style={{
                backgroundColor: '#111111',
                border:          '1px solid #22c55e',
                borderRadius:    '16px',
                padding:         '36px 32px',
                marginBottom:    '36px',
                position:        'relative',
                overflow:        'hidden',
              }}
            >
              <p
                style={{
                  fontSize:     '1rem',
                  color:        '#a3a3a3',
                  marginBottom: '24px',
                  fontStyle:    'italic',
                  lineHeight:   1.6,
                }}
              >
                One extra MOT booking covers your first month.
              </p>

              <div
                style={{
                  fontSize:      'clamp(2rem, 6vw, 3rem)',
                  fontWeight:    800,
                  color:         '#22c55e',
                  letterSpacing: '-0.02em',
                  lineHeight:    1,
                  marginBottom:  '16px',
                }}
              >
                £299 setup + £49/month
              </div>

              <p style={{ fontSize: '0.88rem', color: '#a3a3a3', marginBottom: '8px' }}>
                Includes 24/7 Virtual Receptionist
              </p>
              <div
                style={{
                  display:         'inline-block',
                  backgroundColor: '#f59e0b',
                  color:           '#000000',
                  fontSize:        '0.72rem',
                  fontWeight:      700,
                  letterSpacing:   '0.08em',
                  textTransform:   'uppercase',
                  padding:         '4px 12px',
                  borderRadius:    '4px',
                }}
              >
                First 5 garages only — launch price
              </div>
            </div>

            <ClaimForm />
          </div>
        </section>

        {/* ── 9. FOOTER ──────────────────────────────────────────────── */}
        <footer
          style={{
            backgroundColor: '#050505',
            borderTop:       '1px solid #141414',
            padding:         '24px',
            textAlign:       'center',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: '#444444', marginBottom: '4px' }}>
            © 2026 {config.garageName}
          </p>
          <p style={{ fontSize: '0.72rem', color: '#333333', margin: 0 }}>
            Preview page by{' '}
            <a
              href="https://torquesites.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#444444', textDecoration: 'none' }}
            >
              TorqueSites
            </a>
          </p>
        </footer>

      </main>
    </>
  );
}
