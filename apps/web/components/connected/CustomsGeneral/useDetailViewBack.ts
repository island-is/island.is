import { useEffect, useRef } from 'react'

export const useDetailViewBack = (isOpen: boolean, onBack: () => void) => {
  const onBackRef = useRef(onBack)
  onBackRef.current = onBack

  useEffect(() => {
    if (!isOpen) return
    window.history.pushState(null, '')
    const handler = () => onBackRef.current()
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [isOpen])
}
