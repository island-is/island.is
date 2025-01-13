import { useEffect, useRef, useState } from 'react'

export const useScrolledPassed = (id: string) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const lastScrollY = useRef(0) // To track the last scroll position
  const ticking = useRef(false) // To track if requestAnimationFrame is already in progress

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const element = document.getElementById(id)
          const scrollY = window.scrollY

          if (element) {
            const rect = element.getBoundingClientRect()

            // Check if the user scrolled past the element or is scrolling up
            if (scrollY <= rect.top) setIsScrolled(false)
            else if (rect.top <= 0 || scrollY < lastScrollY.current) {
              setIsScrolled(true)
            }
          }

          // Update the last scroll position
          lastScrollY.current = scrollY
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('touchmove', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchmove', handleScroll)
    }
  }, [])

  return isScrolled
}
