import { useEffect, useRef, useState } from 'react'

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const lastScrollTop = useRef(0) // Tracks the last scroll position
  const ticking = useRef(false) // To throttle scroll events

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop

          // Determine the scroll direction
          if (scrollTop > lastScrollTop.current) {
            setScrollDirection('down')
          } else if (scrollTop < lastScrollTop.current) {
            setScrollDirection('up')
          }

          // Update the last scroll position, ensuring it doesn't go below 0
          lastScrollTop.current = Math.max(scrollTop, 0)
          ticking.current = false
        })

        ticking.current = true
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, []) // No dependencies needed

  return scrollDirection
}
