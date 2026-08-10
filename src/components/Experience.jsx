import { useLang } from '../useLang'

export default function Experience() {
  const { t } = useLang()
  const items = t('experience.items')

  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-head">
          <p className="section-label">
            <span className="label-index">03</span> {t('experience.label')}
          </p>
          <h2 className="section-title">{t('experience.heading')}</h2>
        </div>

        <div className="timeline">
          {items.map((item, i) => (
            <div className="timeline-item" key={i}>
              <span className="timeline-dot" />
              <span className="timeline-period mono">{item.period}</span>
              <div className="timeline-card">
                <h3>{item.title}</h3>
                <p className="timeline-place mono">{item.place}</p>
                <p className="timeline-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
