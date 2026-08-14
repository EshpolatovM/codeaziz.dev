import { useEffect } from 'react'

/**
 * Scroll "tormoz" + silliqlik effekti:
 *
 *  - Section chegaralariga yaqinlashganda wheel komandasi tabiiy ravishda
 *    sekinlashadi (magnit EMAS — yaqinlikka qarab multiplier o'zgaradi).
 *  - Wheel scroll lerp (easing) orqali amalga oshiriladi — natijada scroll
 *    yumshoq, "iliq" va silliq bo'ladi.
 *  - Touch/trackpad'dagi native smooth scroll buzilmaydi; lerp faqat
 *    desktop wheel uchun qo'llanadi.
 */
export default function useScrollDamping(sectionIds, {
  edgeRatio = 0.18,    // section chegarasidan necha ulush ichida tormoz boshlanadi (0.18 = ±18% vh)
  minMultiplier = 0.32, // tormozning eng kuchli qiymati (1.0 = tormozsiz)
  easing = 0.09,        // lerp tezligi — kichik = yumshoq, katta = chaqqon
} = {}) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    // CSS'dagi scroll-behavior: smooth lerp bilan to'qnashmasligi uchun
    // hook ishlaganda o'chiriladi va tozalashda qaytariladi.
    const html = document.documentElement
    const prevScrollBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'

    let targetY = window.scrollY
    let raf = null

    const getSections = () => sectionIds.map((id) => document.getElementById(id)).filter(Boolean)

    /**
     * Eng yaqin section'ga nisbatan "edge yaqinligi"ni hisoblaydi.
     * Qaytadi: 0 (markazda, tormozsiz) ... 1 (chegara yaqinida, eng kuchli tormoz)
     */
    const proximityFactor = () => {
      const sections = getSections()
      if (!sections.length) return 0

      const vh = window.innerHeight
      const edgePx = vh * edgeRatio

      let minEdgeDist = Infinity

      for (const sec of sections) {
        const rect = sec.getBoundingClientRect()
        const top = rect.top
        const bottom = rect.bottom

        const visibleTop = Math.max(top, 0)
        const visibleBottom = Math.min(bottom, vh)

        if (visibleBottom > visibleTop) {
          const distToTop = visibleTop
          const distToBottom = vh - visibleBottom
          const nearestEdge = Math.min(distToTop, distToBottom)
          if (nearestEdge < minEdgeDist) minEdgeDist = nearestEdge
        }
      }

      if (!isFinite(minEdgeDist)) return 0
      if (minEdgeDist >= edgePx) return 0
      return 1 - minEdgeDist / edgePx
    }

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight

    const animate = () => {
      const diff = targetY - window.scrollY
      window.scrollTo(0, window.scrollY + diff * easing)

      if (Math.abs(diff) > 0.5) {
        raf = requestAnimationFrame(animate)
      } else {
        window.scrollTo(0, targetY)
        raf = null
      }
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(animate)
    }

    const wheelHandler = (e) => {
      e.preventDefault()

      // Trackpad ba'zan deltaMode=lines beradi — px ga normalizatsiya
      const raw = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY

      const factor = proximityFactor()
      // factor 0..1 → multiplier 1.0..minMultiplier
      const multiplier = 1 - factor * (1 - minMultiplier)

      targetY = Math.min(maxScroll(), Math.max(0, targetY + raw * multiplier))
      kick()
    }

    // Lerp faol bo'lmaganda, native scroll (scrollbar, keyboard, touch)
    // targetY bilan sinxron bo'lsin.
    const onScroll = () => {
      if (!raf) targetY = window.scrollY
    }

    // Keyboard scroll (o'qlar, space, PageUp/Down) boshlanganda lerp'ni
    // to'xtatib, native scroll'ga yo'l qo'yamiz — ular o'rtasida urishish bo'lmaydi.
    const onKeyDown = (e) => {
      const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']
      if (!keys.includes(e.key)) return
      if (raf) {
        cancelAnimationFrame(raf)
        raf = null
      }
      targetY = window.scrollY
    }

    // Touch boshlanganda lerp to'xtatiladi — native smooth scroll o'zini o'zi
    // boshqaradi, biz faqat inertsiyada yumshoq deceleration qo'shamiz.
    let touchLastY = 0
    let touchLastT = 0
    let touchVelocity = 0

    const touchStart = (e) => {
      if (raf) {
        cancelAnimationFrame(raf)
        raf = null
      }
      touchLastY = e.touches[0].clientY
      touchLastT = performance.now()
      touchVelocity = 0
    }

    const touchMove = (e) => {
      const y = e.touches[0].clientY
      const now = performance.now()
      const dt = Math.max(now - touchLastT, 1)
      const dy = touchLastY - y
      touchVelocity = dy / dt // px/ms
      touchLastY = y
      touchLastT = now
    }

    const touchEnd = () => {
      if (Math.abs(touchVelocity) < 0.05) return

      let v = touchVelocity // px/ms
      const friction = 0.92 // har frame'da 8% yo'qoladi
      let last = performance.now()

      const step = (now) => {
        const dt = now - last
        last = now
        let delta = v * dt * 16 // 16ms = 1 frame ga normalizatsiya
        if (Math.abs(delta) < 0.5) return

        window.scrollBy({ top: delta, behavior: 'auto' })
        v *= friction
        if (Math.abs(v) < 0.02) return
        requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }

    // passive: false — preventDefault ishlashi uchun kerak
    window.addEventListener('wheel', wheelHandler, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKeyDown, { passive: true })
    window.addEventListener('touchstart', touchStart, { passive: true })
    window.addEventListener('touchmove', touchMove, { passive: true })
    window.addEventListener('touchend', touchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', wheelHandler)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', touchStart)
      window.removeEventListener('touchmove', touchMove)
      window.removeEventListener('touchend', touchEnd)
      if (raf) cancelAnimationFrame(raf)
      html.style.scrollBehavior = prevScrollBehavior
    }
  }, [sectionIds, edgeRatio, minMultiplier, easing])
}
