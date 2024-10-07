import { useCallback, useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

type Position = {
  x: number
  y: number
}

type Rect = {
  width: number
  height: number
}

export const useScrollPosition = (): Position => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })

  const onScroll = useCallback(() => {
    setPosition({ x: window.scrollX, y: window.scrollY })
  }, [])

  useEffect(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])

  return position
}

const useViewport = (): [Position, Rect] => {
  const position = useScrollPosition()
  const size = useWindowSize()

  return [position, size]
}

export default useViewport

export { useWindowSize }
