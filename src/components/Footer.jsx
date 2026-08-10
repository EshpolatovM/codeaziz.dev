import { useLang } from '../useLang'
import { PROFILE } from '../data'

export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <h2 className="footer-title">
          {t('footer.tagline')} <span className="accent-name">{PROFILE.firstName}</span>
        </h2>
        <p className="footer-note">{t('footer.note')}</p>

        <div className="footer-links">
          <a className="footer-link mono" href={PROFILE.telegram} target="_blank" rel="noopener">
            t.me/{PROFILE.handle}
          </a>
          <a className="footer-link mono" href={PROFILE.github} target="_blank" rel="noopener">
            github/{PROFILE.githubHandle}
          </a>
        </div>

        <p className="footer-copy mono">
          © {year} {PROFILE.handle} — {t('footer.rights')}
        </p>
      </div>
    </footer>
  )
}
