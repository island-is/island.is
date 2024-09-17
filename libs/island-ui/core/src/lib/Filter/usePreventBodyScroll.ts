import { useEffect, useRef } from 'react'

export const usePreventBodyScroll = (preventBodyScroll: boolean) => {
  const initialBodyPosition = useRef<string | null>(null)
  const initialScrollPosition = useRef<number | null>(null)

  useEffect(() => {
    const isBrowser = typeof window !== 'undefined'
    if (!isBrowser || !preventBodyScroll) {
      return
    }

    if (initialBodyPosition.current === null) {
      initialBodyPosition.current =
        window.document.body.style.position || 'static'
    }
    if (initialScrollPosition.current === null) {
      initialScrollPosition.current = window.scrollY
    }

    // Prevent scrolling on the body element
    window.document.body.style.position = 'fixed'

    return () => {
      if (initialBodyPosition.current !== null) {
        window.document.body.style.position = initialBodyPosition.current
        initialBodyPosition.current = null
      }
      if (initialScrollPosition.current !== null) {
        // When setting the body position to fixed, the scroll position resets to 0
        // Here we are restoring the scroll position
        window.scrollTo(0, initialScrollPosition.current)
        initialScrollPosition.current = null
      }
    }
  }, [preventBodyScroll])
}
