import { useEffect, useState } from 'react'

export const useScrolledPassed = (id: string) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        const element = document.getElementById(id)
        const scrollY = window.scrollY

        if (element) {
          const rect = element.getBoundingClientRect()

          // Check if the user scrolled past the element
          if (scrollY > rect.top) {
            setIsScrolled(true)
          } else {
            setIsScrolled(false)
          }
        }
      }, 150)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('touchmove', handleScroll, { passive: true })

    // Initial check in case the user is already scrolled past the element
    handleScroll()

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchmove', handleScroll)
    }
  }, [id])

  return isScrolled
}
