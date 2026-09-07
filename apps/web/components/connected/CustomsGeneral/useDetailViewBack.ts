import { useEffect, useRef } from 'react'

export const useDetailViewBack = (isOpen: boolean, onBack: () => void) => {
  const onBackRef = useRef(onBack)
  onBackRef.current = onBack
  const skipNextRef = useRef(false)

  useEffect(() => {
    if (!isOpen) return
    window.history.pushState(null, '')
    const handler = () => {
      if (skipNextRef.current) {
        skipNextRef.current = false
        return
      }
      onBackRef.current()
    }
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [isOpen])

  return () => {
    skipNextRef.current = true
    onBackRef.current()
    window.history.back()
  }
}
