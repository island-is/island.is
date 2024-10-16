import { RefObject, useEffect, useState } from 'react'

export const useIsChildFocusedorHovered = (
  ref: RefObject<HTMLElement>,
  focus = true,
) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      if (ref.current?.contains(e.target as Node)) {
        setIsFocused(true)
      } else {
        setIsFocused(false)
      }
    }

    const handleHover = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) {
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    if (focus) {
      document.addEventListener('focusin', handleFocus)
    }
    document.addEventListener('mouseover', handleHover)

    return () => {
      if (focus) {
        document.removeEventListener('focusin', handleFocus)
      }
      document.removeEventListener('mouseover', handleHover)
    }
  }, [ref])

  return isFocused || isHovered
}
