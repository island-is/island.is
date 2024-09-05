import { useEffect } from 'react'

let initialBodyPosition: string | null = null
let initialScrollPosition: number | null = null

export const usePreventBodyScroll = (preventBodyScroll: boolean) => {
  useEffect(() => {
    const isBrowser = typeof window !== 'undefined'
    if (!isBrowser || !preventBodyScroll) {
      return
    }

    if (initialBodyPosition === null) {
      initialBodyPosition = window.document.body.style.position || 'static'
    }
    if (initialScrollPosition === null) {
      initialScrollPosition = window.scrollY
    }

    // Prevent scrolling on the body element
    window.document.body.style.position = 'fixed'

    return () => {
      if (initialBodyPosition !== null) {
        window.document.body.style.position = initialBodyPosition
        initialBodyPosition = null
      }
      if (initialScrollPosition !== null) {
        // When setting the body position to fixed, the scroll position resets to 0
        // Here we are restoring the scroll position
        window.scrollTo(0, initialScrollPosition)
        initialScrollPosition = null
      }
    }
  }, [preventBodyScroll])
}
