import { useEffect } from 'react'

export default function useReveal(selector = '[data-reveal]') {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const els = Array.from(document.querySelectorAll(selector))
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [selector])
}
