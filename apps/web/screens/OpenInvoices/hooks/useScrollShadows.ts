import { RefObject, useEffect, useState } from 'react'

interface ScrollShadows {
  atTop: boolean
  atBottom: boolean
}

/**
 * Tracks whether a scroll container is at its top/bottom edge, so callers can
 * show a shadow only when content is actually hidden behind one.
 */
export const useScrollShadows = (
  ref: RefObject<HTMLElement | null>,
): ScrollShadows => {
  const [state, setState] = useState<ScrollShadows>({
    atTop: true,
    atBottom: true,
  })

  useEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      setState((prev) => {
        const atTop = scrollTop <= 1
        // 1px tolerance for fractional scroll heights at non-integer zoom
        const atBottom = scrollTop + clientHeight >= scrollHeight - 1
        return prev.atTop === atTop && prev.atBottom === atBottom
          ? prev
          : { atTop, atBottom }
      })
    }

    update()
    el.addEventListener('scroll', update, { passive: true })
    // The filter changes height when an accordion expands, which moves the
    // bottom edge without any scroll event firing.
    const observer = new ResizeObserver(update)
    observer.observe(el)
    Array.from(el.children).forEach((child) => observer.observe(child))

    return () => {
      el.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [ref])

  return state
}
