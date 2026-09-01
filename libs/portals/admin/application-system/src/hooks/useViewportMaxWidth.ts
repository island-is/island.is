import { useEffect, useState } from 'react'

export const useViewportMaxWidth = (
  maxWidthPx: number,
  initialMatches = false,
) => {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(`(max-width: ${maxWidthPx}px)`).matches
      : initialMatches,
  )

  useEffect(() => {
    const mediaQueryList = window.matchMedia(`(max-width: ${maxWidthPx}px)`)
    const update = () => {
      setMatches(mediaQueryList.matches)
    }
    update()
    mediaQueryList.addEventListener('change', update)
    return () => mediaQueryList.removeEventListener('change', update)
  }, [maxWidthPx])

  return matches
}
