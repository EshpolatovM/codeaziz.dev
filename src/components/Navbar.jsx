import { useState } from 'react'
import { useLang } from '../useLang'

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const [open, setOpen] = useState(false)

  const links = [
    { id: 'about', label: t('nav.about') },
    { id: 'skills', label: t('nav.skills') },
    { id: 'experience', label: t('nav.experience') },
    { id: 'order', label: t('nav.order') },
  ]

  const onNav = () => setOpen(false)

  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="logo" href="#top" onClick={onNav}>
          <span className="logo-mark">M</span>
          <span className="logo-text">codemir.dev</span>
        </a>

        <nav className={`nav-links ${open ? 'is-open' : ''}`}>
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`} onClick={onNav}>
              {link.label}
            </a>
          ))}
          <a className="nav-cta" href="#order" onClick={onNav}>
            {t('nav.cta')}
          </a>
        </nav>

        <div className="nav-right">
          <div className="lang-toggle" role="group" aria-label="Language">
            <button
              type="button"
              className={lang === 'uz' ? 'is-active' : ''}
              onClick={() => setLang('uz')}
            >
              UZ
            </button>
            <button
              type="button"
              className={lang === 'en' ? 'is-active' : ''}
              onClick={() => setLang('en')}
            >
              EN
            </button>
          </div>
          <button
            type="button"
            className={`burger ${open ? 'is-open' : ''}`}
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
