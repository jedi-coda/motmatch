import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// ─── GARAGE CONFIG ────────────────────────────────────────────────────────────
// Clone this file for a new garage — only edit this object.
const config = {
  seo: {
    title: 'MOT Amersham — £49.95 | Newtown Garage',
    description:
      'Book your MOT in Amersham from just £49.95. DVSA-approved, while-you-wait service at Newtown Garage, Chesham. Free retest included. Call 01494 77 22 77.',
  },
  garage: {
    name:             'Newtown Garage',
    phone:            '01494 77 22 77',
    phoneTel:         '01494772277',
    website:          'https://newtowngarage.com',
    address:          'Alma Road Industrial Estate, Chesham HP5 3HB',
    locationNote:     'Just 10 minutes from Amersham',
    mapsEmbed:        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2472.112200918285!2d-0.612970622903935!3d51.712689771860646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48765d057ffc1b21%3A0x3808012303af4373!2sNewtown%20Garage%20Chesham!5e0!3m2!1sen!2suk!4v1774531779414!5m2!1sen!2suk',
    mapsDirections:   'https://maps.google.com/?q=Newtown+Garage,Alma+Road,Chesham,HP5+3HB',
    googleReviewsUrl: 'https://www.google.com/maps/place/Newtown+Garage+Chesham',
  },
  hero: {
    keyword:  'MOT in Amersham',
    price:    '£49.95',
    tagline:  'DVSA-approved. While you wait. Free retest included.',
    label:    'DVSA Approved · Newtown Garage',
    // Free Unsplash image — replace src with any 1920-wide image URL
    image:    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&q=80',
  },
  trust: [
    { icon: '✓', label: 'DVSA Approved' },
    { icon: '★', label: '4.8 · 237 Reviews' },
    { icon: '↩', label: 'Free Retest' },
    { icon: '⏱', label: 'While You Wait' },
  ],
  features: [
    {
      emoji: '🔧',
      title: 'Local & Trusted',
      body:  'Serving Amersham and Chesham for over 20 years. Thousands of local cars through our doors every year.',
    },
    {
      emoji: '💷',
      title: 'Transparent Pricing',
      body:  '£49.95 fixed price. No hidden costs, no upselling. You pay what you see — full stop.',
    },
    {
      emoji: '⚡',
      title: 'Fast Turnaround',
      body:  'Most MOTs completed within the hour. Our while-you-wait service means zero disruption to your day.',
    },
  ],
  rating: {
    score: '4.8',
    count: 237,
  },
  reviews: [
    {
      name:  'James R.',
      stars: 5,
      text:  'Booked my MOT online and was in and out in under an hour. Friendly staff, fair price and they didn\'t try to sell me anything I didn\'t need. Will definitely be back.',
    },
    {
      name:  'Sarah T.',
      stars: 5,
      text:  'Been using Newtown Garage for years. Always reliable, always honest. My car failed on a brake issue and they fixed it the same morning. Couldn\'t ask for more.',
    },
    {
      name:  'Daniel M.',
      stars: 5,
      text:  'Drove from Amersham and it was absolutely worth it. £49.95 for the MOT, free retest when a bulb failed. Sorted it quickly and had me back on the road within two hours.',
    },
  ],
  // Opening hours keyed by JS day index: 0=Sun … 6=Sat
  // null = closed all day
  hours: {
    0: null,
    1: { open: '08:00', close: '18:00' },
    2: { open: '08:00', close: '18:00' },
    3: { open: '08:00', close: '18:00' },
    4: { open: '08:00', close: '18:00' },
    5: { open: '08:00', close: '18:00' },
    6: { open: '08:00', close: '13:00' },
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Returns current day index (0–6) and open/closed status in Europe/London time. */
function getUKStatus() {
  // Convert server clock to UK local time
  const londonStr  = new Date().toLocaleString('en-US', { timeZone: 'Europe/London' });
  const londonDate = new Date(londonStr);
  const dayIndex   = londonDate.getDay();
  const nowMins    = londonDate.getHours() * 60 + londonDate.getMinutes();

  const todaySlot  = config.hours[dayIndex];
  let isOpen       = false;

  if (todaySlot) {
    const [oh, om]  = todaySlot.open.split(':').map(Number);
    const [ch, cm]  = todaySlot.close.split(':').map(Number);
    isOpen = nowMins >= oh * 60 + om && nowMins < ch * 60 + cm;
  }

  const hour = londonDate.getHours();
  const greeting = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';

  return { dayIndex, isOpen, greeting };
}

// Grouped rows shown in the hours table
const HOUR_ROWS = [
  { label: 'Mon – Fri', days: [1, 2, 3, 4, 5], slot: config.hours[1] },
  { label: 'Saturday',  days: [6],              slot: config.hours[6] },
  { label: 'Sunday',    days: [0],              slot: config.hours[0] },
];

function formatSlot(slot) {
  if (!slot) return 'Closed';
  return `${slot.open} – ${slot.close}`;
}

// ─── METADATA ────────────────────────────────────────────────────────────────

export const metadata = {
  title:       config.seo.title,
  description: config.seo.description,
};

// Re-render on every request so open/closed status is always accurate
export const dynamic = 'force-dynamic';

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function MOTAmershamPage() {
  const { dayIndex, isOpen, greeting } = getUKStatus();

  return (
    <main
      className={inter.className}
      style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}
    >
      {/* TorqueSites badge — fixed top left */}
      <a
        href="https://torquesites.co.uk"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position:        'fixed',
          top:             '14px',
          left:            '14px',
          zIndex:          50,
          backgroundColor: '#111111',
          border:          '1px solid #2a2a2a',
          borderRadius:    '6px',
          padding:         '4px 10px',
          fontSize:        '11px',
          color:           '#666666',
          textDecoration:  'none',
          letterSpacing:   '0.02em',
        }}
      >
        Powered by TorqueSites
      </a>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight:          '100vh',
          display:            'flex',
          flexDirection:      'column',
          justifyContent:     'center',
          alignItems:         'center',
          textAlign:          'center',
          padding:            '0 24px',
          backgroundImage:    `linear-gradient(rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.72) 100%), url(${config.hero.image})`,
          backgroundSize:     'cover',
          backgroundPosition: 'center',
          backgroundRepeat:   'no-repeat',
        }}
      >
        <p
          style={{
            fontSize:      '12px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color:         '#22c55e',
            marginBottom:  '20px',
            fontWeight:    600,
          }}
        >
          {config.hero.label}
        </p>

        <p
          style={{
            fontSize:     '1.15rem',
            color:        '#ffffff',
            fontStyle:    'italic',
            fontWeight:   300,
            marginBottom: '10px',
            opacity:      0.85,
          }}
        >
          {greeting}
        </p>

        <h1
          style={{
            fontSize:      'clamp(2.4rem, 7vw, 4.5rem)',
            fontWeight:    800,
            lineHeight:    1.08,
            letterSpacing: '-0.02em',
            marginBottom:  '24px',
            maxWidth:      '800px',
          }}
        >
          {config.hero.keyword} —{' '}
          <span style={{ color: '#22c55e' }}>{config.hero.price}</span>
        </h1>

        <p
          style={{
            fontSize:     'clamp(1rem, 2.5vw, 1.2rem)',
            color:        '#d4d4d4',
            marginBottom: '44px',
            maxWidth:     '500px',
            lineHeight:   1.65,
          }}
        >
          {config.hero.tagline}
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href={`tel:${config.garage.phoneTel}`}
            style={{
              backgroundColor: '#22c55e',
              color:           '#000000',
              fontWeight:      700,
              fontSize:        '1rem',
              padding:         '16px 36px',
              borderRadius:    '8px',
              textDecoration:  'none',
              letterSpacing:   '0.01em',
            }}
          >
            Call to Book
          </a>
          <a
            href={config.garage.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              backdropFilter:  'blur(6px)',
              color:           '#ffffff',
              fontWeight:      600,
              fontSize:        '1rem',
              padding:         '16px 36px',
              borderRadius:    '8px',
              textDecoration:  'none',
              border:          '1px solid rgba(255,255,255,0.2)',
              letterSpacing:   '0.01em',
            }}
          >
            Book Online
          </a>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#111111',
          borderTop:       '1px solid #1e1e1e',
          borderBottom:    '1px solid #1e1e1e',
          padding:         '22px 24px',
        }}
      >
        <div
          style={{
            maxWidth:              '900px',
            margin:                '0 auto',
            display:               'grid',
            gridTemplateColumns:   'repeat(auto-fit, minmax(160px, 1fr))',
            gap:                   '12px',
            textAlign:             'center',
          }}
        >
          {config.trust.map(({ icon, label }) => (
            <div
              key={label}
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '8px',
                fontSize:       '0.88rem',
                fontWeight:     600,
                color:          '#e5e5e5',
              }}
            >
              <span style={{ color: '#22c55e', fontSize: '1rem' }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────── */}
      <section style={{ padding: '90px 24px', maxWidth: '1060px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize:      'clamp(1.6rem, 4vw, 2.25rem)',
            fontWeight:    700,
            textAlign:     'center',
            marginBottom:  '52px',
            letterSpacing: '-0.01em',
          }}
        >
          Why Amersham drivers choose us
        </h2>

        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap:                 '24px',
          }}
        >
          {config.features.map(({ emoji, title, body }) => (
            <div
              key={title}
              style={{
                backgroundColor: '#111111',
                border:          '1px solid #1e1e1e',
                borderRadius:    '14px',
                padding:         '40px 36px',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '20px', lineHeight: 1 }}>
                {emoji}
              </div>
              <h3
                style={{
                  fontSize:     '1.1rem',
                  fontWeight:   700,
                  marginBottom: '14px',
                  color:        '#ffffff',
                }}
              >
                {title}
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#a3a3a3', lineHeight: 1.7, margin: 0 }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#0d0d0d',
          borderTop:       '1px solid #1a1a1a',
          borderBottom:    '1px solid #1a1a1a',
          padding:         '90px 24px',
        }}
      >
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize:      'clamp(1.6rem, 4vw, 2.25rem)',
              fontWeight:    700,
              textAlign:     'center',
              marginBottom:  '12px',
              letterSpacing: '-0.01em',
            }}
          >
            {config.rating.score}★ Rated on Google
          </h2>
          <p
            style={{
              textAlign:    'center',
              color:        '#a3a3a3',
              fontSize:     '0.95rem',
              marginBottom: '52px',
            }}
          >
            Based on {config.rating.count} verified reviews
          </p>

          <div
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap:                 '20px',
              marginBottom:        '40px',
            }}
          >
            {config.reviews.map((review) => (
              <div
                key={review.name}
                style={{
                  backgroundColor: '#111111',
                  border:          '1px solid #1e1e1e',
                  borderRadius:    '14px',
                  padding:         '28px 28px 32px',
                }}
              >
                {/* Stars */}
                <div
                  style={{
                    color:        '#f59e0b',
                    fontSize:     '1rem',
                    marginBottom: '16px',
                    letterSpacing: '2px',
                  }}
                >
                  {'★'.repeat(review.stars)}
                </div>
                <p
                  style={{
                    fontSize:     '0.95rem',
                    color:        '#d4d4d4',
                    lineHeight:   1.7,
                    marginBottom: '20px',
                    fontStyle:    'italic',
                  }}
                >
                  "{review.text}"
                </p>
                <p
                  style={{
                    fontSize:   '0.85rem',
                    fontWeight: 600,
                    color:      '#888888',
                    margin:     0,
                  }}
                >
                  — {review.name}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <a
              href={config.garage.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color:          '#22c55e',
                fontSize:       '0.95rem',
                fontWeight:     600,
                textDecoration: 'none',
                letterSpacing:  '0.01em',
              }}
            >
              Read all {config.rating.count} reviews on Google →
            </a>
          </div>
        </div>
      </section>

      {/* ── LOCATION ─────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#0f0f0f',
          borderBottom:    '1px solid #1e1e1e',
          padding:         '90px 24px',
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize:      'clamp(1.6rem, 4vw, 2.25rem)',
              fontWeight:    700,
              marginBottom:  '8px',
              letterSpacing: '-0.01em',
            }}
          >
            {config.garage.locationNote}
          </h2>
          <p style={{ color: '#a3a3a3', fontSize: '1rem', marginBottom: '10px' }}>
            {config.garage.address}
          </p>
          <a
            href={config.garage.mapsDirections}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:        'inline-block',
              color:          '#22c55e',
              fontSize:       '0.9rem',
              fontWeight:     600,
              textDecoration: 'none',
              marginBottom:   '32px',
              letterSpacing:  '0.01em',
            }}
          >
            Get Directions →
          </a>

          <div
            style={{
              borderRadius: '12px',
              overflow:     'hidden',
              border:       '1px solid #1e1e1e',
              aspectRatio:  '16 / 7',
              width:        '100%',
            }}
          >
            <iframe
              title={`${config.garage.name} — Google Maps`}
              src={config.garage.mapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ── OPENING HOURS ────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#0a0a0a',
          padding:         '90px 24px',
        }}
      >
        <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
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
          <div style={{ marginBottom: '40px' }}>
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
                fontSize:        '0.85rem',
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
                }}
              />
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>

          {/* Hours table */}
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
                    padding:         '18px 28px',
                    borderTop:       i === 0 ? 'none' : '1px solid #1e1e1e',
                    backgroundColor: isToday ? 'rgba(34,197,94,0.06)' : 'transparent',
                  }}
                >
                  <span
                    style={{
                      fontSize:   '0.95rem',
                      fontWeight: isToday ? 700 : 400,
                      color:      isToday ? '#22c55e' : '#d4d4d4',
                    }}
                  >
                    {row.label}
                    {isToday && (
                      <span
                        style={{
                          marginLeft:      '10px',
                          fontSize:        '0.7rem',
                          backgroundColor: 'rgba(34,197,94,0.15)',
                          color:           '#22c55e',
                          borderRadius:    '4px',
                          padding:         '2px 7px',
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
                      fontSize:   '0.95rem',
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

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section
        style={{
          padding:         '100px 24px',
          textAlign:       'center',
          backgroundColor: '#0d0d0d',
          borderTop:       '1px solid #1a1a1a',
        }}
      >
        <h2
          style={{
            fontSize:      'clamp(1.8rem, 5vw, 2.75rem)',
            fontWeight:    800,
            marginBottom:  '12px',
            letterSpacing: '-0.02em',
          }}
        >
          Ready to book your MOT?
        </h2>
        <p style={{ color: '#a3a3a3', fontSize: '1rem', marginBottom: '40px' }}>
          Call us now — no forms, no fuss. We&apos;ll get you booked in.
        </p>

        <a
          href={`tel:${config.garage.phoneTel}`}
          style={{
            display:        'block',
            fontSize:       'clamp(1.8rem, 5vw, 3rem)',
            fontWeight:     800,
            color:          '#22c55e',
            textDecoration: 'none',
            letterSpacing:  '-0.02em',
            marginBottom:   '32px',
          }}
        >
          {config.garage.phone}
        </a>

        <a
          href={config.garage.website}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display:         'inline-block',
            backgroundColor: 'transparent',
            color:           '#ffffff',
            fontWeight:      600,
            fontSize:        '1rem',
            padding:         '14px 32px',
            borderRadius:    '8px',
            textDecoration:  'none',
            border:          '1px solid #2a2a2a',
          }}
        >
          Book Online at {config.garage.website.replace('https://', '')}
        </a>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer
        style={{
          backgroundColor: '#080808',
          borderTop:       '1px solid #161616',
          padding:         '28px 24px',
          textAlign:       'center',
        }}
      >
        <p
          style={{
            fontSize:  '0.8rem',
            color:     '#444444',
            margin:    0,
            display:   'flex',
            flexWrap:  'wrap',
            gap:       '6px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span>© 2026 {config.garage.name}</span>
          <span style={{ color: '#2a2a2a' }}>|</span>
          <a href="/privacy" style={{ color: '#444444', textDecoration: 'underline' }}>
            Privacy Policy
          </a>
          <span style={{ color: '#2a2a2a' }}>|</span>
          <a
            href="https://torquesites.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#444444', textDecoration: 'none' }}
          >
            Powered by TorqueSites
          </a>
        </p>
      </footer>
    </main>
  );
}
