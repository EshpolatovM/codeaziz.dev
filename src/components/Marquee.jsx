import { STACK } from '../data'

export default function Marquee() {
  const items = [...STACK, ...STACK]

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className="marquee-item">
            {item} <span className="marquee-star">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
