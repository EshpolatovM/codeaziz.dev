import { useState } from 'react'
import { useLang } from '../useLang'
import { PROFILE } from '../data'

export default function Order() {
  const { t } = useLang()
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    if (status === 'sending') return

    const form = e.currentTarget
    const payload = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      project: form.message.value.trim(),
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data?.error)

      setStatus('success')
      window.open(PROFILE.telegram, '_blank', 'noopener')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="order" className="section order">
      <div className="container">
        <div className="section-head" data-reveal>
          <p className="section-label">
            <span className="label-index">04</span> {t('order.label')}
          </p>
          <h2 className="section-title">{t('order.heading')}</h2>
          <p className="section-sub">{t('order.sub')}</p>
        </div>

        <div className="order-grid">
          <div className="order-left">
            <h3 className="block-title mono">// {t('order.stepsTitle')}</h3>
            <div className="steps" data-reveal>
              {t('order.steps').map((step) => (
                <div className="step" key={step.n}>
                  <span className="step-n mono">{step.n}</span>
                  <div className="step-body">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="block-title mono">// services</h3>
            <div className="services" data-reveal style={{ '--reveal-delay': '0.15s' }}>
              {t('order.services').map((service) => (
                <div className="service" key={service.title}>
                  <h4 className="service-title">{service.title}</h4>
                  <p className="service-desc">{service.desc}</p>
                  <ul className="service-features mono">
                    {service.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="order-right" data-reveal style={{ '--reveal-delay': '0.12s' }}>
            <div className="order-terminal" aria-hidden="true">
              <div className="terminal-bar">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="terminal-title">~/order</span>
              </div>
              <div className="terminal-body">
                <p>
                  <span className="prompt">$</span> {t('order.command')}
                </p>
                <p className="out">
                  <span className="ok">✓</span> {t('order.terminalOut')}
                  <span className="cursor" />
                </p>
              </div>
            </div>

            <form className="order-form" onSubmit={handleSubmit}>
              <label className="field">
                <span className="field-label">{t('order.form.name')}</span>
                <input
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  placeholder={t('order.form.namePh')}
                />
              </label>
              <label className="field">
                <span className="field-label">{t('order.form.phone')}</span>
                <input
                  name="phone"
                  type="tel"
                  required
                  minLength={7}
                  placeholder={t('order.form.phonePh')}
                />
              </label>
              <label className="field">
                <span className="field-label">{t('order.form.message')}</span>
                <textarea
                  name="message"
                  required
                  minLength={5}
                  rows={4}
                  placeholder={t('order.form.messagePh')}
                />
              </label>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? t('order.form.sending') : `${t('order.form.submit')} →`}
              </button>

              {status === 'success' && <p className="form-note ok-note">✓ {t('order.form.success')}</p>}
              {status === 'error' && <p className="form-note err-note">✕ {t('order.form.error')}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
