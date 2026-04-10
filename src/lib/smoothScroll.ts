import gsap from 'gsap'

export const HEADER_SCROLL_EXTRA = 14

export function getScrollTargetY(element: HTMLElement, headerHeight: number): number {
  const top = element.getBoundingClientRect().top + window.scrollY
  return Math.max(0, top - headerHeight - HEADER_SCROLL_EXTRA)
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function scrollToSectionById(
  id: string,
  headerHeight: number,
  existingTween: gsap.core.Tween | null,
): gsap.core.Tween | null {
  const el = document.getElementById(id)
  if (!el) return existingTween

  const targetY = getScrollTargetY(el, headerHeight)

  if (prefersReducedMotion()) {
    window.scrollTo(0, targetY)
    if (history.replaceState) history.replaceState(null, '', `#${id}`)
    return null
  }

  existingTween?.kill()
  const start = window.scrollY
  const dist = Math.abs(targetY - start)
  const duration = Math.min(2.65, Math.max(0.72, dist / 620))
  const state = { y: start }

  return gsap.to(state, {
    y: targetY,
    duration,
    ease: 'power4.inOut',
    overwrite: 'auto',
    onUpdate: () => {
      window.scrollTo(0, state.y)
    },
    onComplete: () => {
      if (history.replaceState) history.replaceState(null, '', `#${id}`)
    },
  })
}
