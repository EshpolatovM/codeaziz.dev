import { useEffect } from 'react'

/**
 * Scroll "tormoz" effekti: foydalanuvchi tez aylantirsa ham,
 * section chegaralari yaqinida scroll tabiiy ravishda sekinlashadi.
 * Magnit EMAS — yaqinlikka qarab multiplier o'zgaradi:
 *
 *   - section o'rtasida            → multiplier 1.0 (oddiy scroll)
 *   - section chegarasiga yaqin     → multiplier 0.25 (sekin)
 *   - chegaradan uzoq              → multiplier 1.0 (yana tez)
 *
 * Bu yerda foydalanuvchining scroll komandasi kamaytirilmaydi —
 * wheel delta'ga "tormoz" qo'llaniladi, natijada scroll
 * tabiiy deceleration bilan sekinlashadi.
 */
export default function useScrollDamping(sectionIds, {
  edgeRatio = 0.18,   // section chegarasidan necha ulush ichida tormoz boshlanadi (0.18 = ±18% vh)
  minMultiplier = 0.4  // tormozning eng kuchli qiymati (1.0 = tormozsiz). 0.4 — silliq, lekin sekin emas.
} = {}) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    // CSS'dagi scroll-behavior: smooth scrollBy'ga ham ta'sir qiladi —
    // tormoz + smooth animatsiya birgalikda scroll "loaq" bo'lib qolishiga sabab.
    // Faqat hook ishlayotgan paytda smooth'ni o'chirib, tozalashda qaytaramiz.
    const html = document.documentElement
    const prevScrollBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'

    let releaseTimer = null   // tormozdan keyin qisqa muddat o'tkazib yuborish

    const getSections = () =>
      sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean)

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

        // section ekranda ko'rinayotgan bo'lsa, uning tepa yoki pastki qirrasiga
        // qancha qolganni hisoblaymiz — eng yaqin qirra bo'yicha
        const visibleTop = Math.max(top, 0)
        const visibleBottom = Math.min(bottom, vh)

        if (visibleBottom > visibleTop) {
          // section ekranda — tepa yoki pastki qirrasiga masofa
          const distToTop = visibleTop
          const distToBottom = vh - visibleBottom
          const nearestEdge = Math.min(distToTop, distToBottom)
          if (nearestEdge < minEdgeDist) minEdgeDist = nearestEdge
        }
      }

      if (!isFinite(minEdgeDist)) return 0
      if (minEdgeDist >= edgePx) return 0
      // 0 (chegarada) ... 1 (markazga edgePx masofada)
      return 1 - minEdgeDist / edgePx
    }

    const wheelHandler = (e) => {
      // Brauzerning o'z smooth scrollini o'chirib, o'zimiz boshqaramiz
      e.preventDefault()

      const factor = proximityFactor()
      // factor 0..1 → multiplier 1.0..minMultiplier
      const multiplier = 1 - factor * (1 - minMultiplier)

      const delta = e.deltaY * multiplier
      window.scrollBy(0, delta)

      // Juda yaqin bo'lsa, keyingi 80ms ichida ham kichik wheel'larni
      // to'liq qabul qilmasdan, yanada sekinlashtiramiz (silky deceleration)
      if (factor > 0.5 && releaseTimer) clearTimeout(releaseTimer)
      if (factor > 0.5) {
        releaseTimer = setTimeout(() => {
          releaseTimer = null
        }, 120)
      }
    }

    // Touch uchun: barmoq ko'targanda inertial deceleration qilamiz
    let touchStartY = 0
    let touchLastY = 0
    let touchLastT = 0
    let touchVelocity = 0

    const touchStart = (e) => {
      touchStartY = e.touches[0].clientY
      touchLastY = touchStartY
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
      const factor = proximityFactor()
      const multiplier = 1 - factor * (1 - minMultiplier)

      let v = touchVelocity // px/ms
      const friction = 0.92 // har frame'da 8% yo'qoladi
      let last = performance.now()

      const step = (now) => {
        const dt = now - last
        last = now
        // v * dt = px; px/ms * ms = px
        let delta = v * dt * multiplier * 16 // 16ms = 1 frame ga normalizatsiya
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
    window.addEventListener('touchstart', touchStart, { passive: true })
    window.addEventListener('touchmove', touchMove, { passive: true })
    window.addEventListener('touchend', touchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', wheelHandler)
      window.removeEventListener('touchstart', touchStart)
      window.removeEventListener('touchmove', touchMove)
      window.removeEventListener('touchend', touchEnd)
      if (releaseTimer) clearTimeout(releaseTimer)
    }
  }, [sectionIds, edgeRatio, minMultiplier])
}
