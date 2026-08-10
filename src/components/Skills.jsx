import { useLang } from '../useLang'
import { SKILL_GROUPS } from '../data'

export default function Skills() {
  const { t } = useLang()

  return (
    <section id="skills" className="section section-cream">
      <div className="container">
        <div className="section-head">
          <p className="section-label">
            <span className="label-index">02</span> {t('skills.label')}
          </p>
          <h2 className="section-title">{t('skills.heading')}</h2>
          <p className="section-sub mono">{t('skills.sub')}</p>
        </div>

        <div className="skills-grid">
          {SKILL_GROUPS.map((group) => (
            <div className="skills-col" key={group.key}>
              <h3 className="skills-col-title mono">
                {'//'} {t(`skills.groups.${group.key}`)}
              </h3>
              <ul className="skills-list">
                {group.skills.map((skill, i) => (
                  <li
                    key={skill}
                    className="skill-item"
                    style={{ '--i': i, '--delay': `${(i % 4) * 0.3}s` }}
                  >
                    <span className="skill-item-n mono">0{i + 1}</span>
                    <span className="skill-item-name">{skill}</span>
                    <span className="skill-item-tag mono">{'</>'}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
