import { useLang } from '../useLang'
import { PROFILE } from '../data'

function Terminal({ t }) {
  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className="terminal-title">bash</span>
      </div>
      <div className="terminal-body">
        <p>
          <span className="prompt">$</span> {t('hero.terminal.who')}
        </p>
        <p className="out">{t('hero.terminal.whoOut')}</p>
        <p>
          <span className="prompt">$</span> {t('hero.terminal.cat')}
        </p>
        <p className="out">{t('hero.terminal.catOut')}</p>
        <p>
          <span className="prompt">$</span> {t('hero.terminal.ping')}
        </p>
        <p className="out">
          <span className="ok">●</span> {t('hero.terminal.pingOut')}
          <span className="cursor" />
        </p>
      </div>
    </div>
  )
}

function Shape() {
  return (
    <div className="shape" aria-hidden="true">
      <svg viewBox="0 0 320 320" fill="none">
        <rect x="12" y="12" width="180" height="180" rx="14" className="s-rect" />
        <path d="M250 20 L318 128 L250 236 Z" className="s-tri" />
        <circle cx="238" cy="262" r="26" className="s-circle" />
        <rect x="40" y="240" width="120" height="44" rx="8" className="s-bar" transform="rotate(-8 100 262)" />
        <circle cx="80" cy="60" r="10" className="s-dot" />
      </svg>
    </div>
  )
}

const BADGES = [
  { label: 'react', x: '6%', y: '6%', r: '-8deg', d: 0 },
  { label: 'node', x: '72%', y: '4%', r: '5deg', d: 1.2 },
  { label: 'express', x: '-3%', y: '60%', r: '7deg', d: 0.6 },
  { label: 'postgresql', x: '64%', y: '56%', r: '-6deg', d: 1.8 },
]

export default function Hero() {
  const { t } = useLang()

  return (
    <section id="top" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-tag" data-reveal style={{ '--reveal-delay': '0.05s' }}>
            {t('hero.tag')}
          </p>
          <h1 className="hero-title" data-reveal style={{ '--reveal-delay': '0.16s' }}>
            {t('hero.greeting')} <span className="accent-name">{PROFILE.name}</span>
          </h1>
          <p className="hero-sub" data-reveal style={{ '--reveal-delay': '0.27s' }}>
            {t('hero.sub')}
          </p>
          <div className="hero-actions" data-reveal style={{ '--reveal-delay': '0.38s' }}>
            <a className="btn btn-primary" href="#order">
              {t('hero.cta')} <span className="btn-arrow">↓</span>
            </a>
            <a className="btn-link" href="#about">
              {t('hero.secondary')} →
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <Shape />
          <Terminal t={t} />
          {BADGES.map((b) => (
            <span key={b.label} className="badge-float" style={{ left: b.x, top: b.y, '--r': b.r, '--d': `${b.d}s` }}>
              {b.label}
            </span>
          ))}
        </div>
      </div>

      <a className="scroll-hint" href="#about">
        <span className="scroll-line" />
        <span className="scroll-text">{t('hero.scroll')}</span>
      </a>
    </section>
  )
}
