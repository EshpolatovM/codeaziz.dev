import { useLang } from '../useLang'
import { PROFILE } from '../data'

export default function About() {
  const { t } = useLang()
  const initials = `${PROFILE.firstName[0]}${PROFILE.lastName[0]}`

  return (
    <section id="about" className="section">
      <div className="container about-grid">
        <div className="about-visual" aria-hidden="true" data-reveal>
          <div className="about-card">
            <div className="about-card-corner" />
            <span className="about-initials">{initials}</span>
            <div className="about-card-bottom">
              <span className="mono">{PROFILE.handle}</span>
              <span className="about-card-line" />
            </div>
          </div>
          <span className="about-tag mono">@ {PROFILE.role}</span>
        </div>

        <div className="about-copy">
          <p className="section-label" data-reveal>
            <span className="label-index">01</span> {t('about.label')}
          </p>
          <h2 className="section-title" data-reveal style={{ '--reveal-delay': '0.08s' }}>
            {t('about.heading')}
          </h2>
          <p className="about-p" data-reveal style={{ '--reveal-delay': '0.16s' }}>
            {t('about.p1')}
          </p>
          <p className="about-p" data-reveal style={{ '--reveal-delay': '0.24s' }}>
            {t('about.p2')}
          </p>

          <div className="stats" data-reveal style={{ '--reveal-delay': '0.32s' }}>
            <div className="stat">
              <span className="stat-num">2+</span>
              <span className="stat-label">{t('about.statYears')}</span>
            </div>
            <div className="stat">
              <span className="stat-num">15+</span>
              <span className="stat-label">{t('about.statProjects')}</span>
            </div>
            <div className="stat">
              <span className="stat-num">10+</span>
              <span className="stat-label">{t('about.statClients')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
