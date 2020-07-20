import { useEffect, useState, useCallback } from 'react'

const useBoundingClientRect = (): [
  (e: HTMLElement) => void,
  ClientRect | undefined,
] => {
  const [element, setElement] = useState<HTMLElement>()
  const [rect, setRect] = useState<ClientRect>()

  const onChange = useCallback(() => {
    setRect(element?.getBoundingClientRect())
  }, [element])

  useEffect(() => {
    window.addEventListener('scroll', onChange, { passive: true })
    return () => window.removeEventListener('scroll', onChange)
  }, [onChange])

  useEffect(() => {
    window.addEventListener('resize', onChange, { passive: true })
    return () => window.removeEventListener('resize', onChange)
  }, [onChange])

  return [setElement, rect]
}

export default useBoundingClientRect
