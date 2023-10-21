import { useState, useEffect, useCallback } from 'react'

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

export const useWindowSize = (): Rect => {
  const [size, setSize] = useState<Rect>({ width: 0, height: 0 })

  const onResize = useCallback(() => {
    setSize({
      width:
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth,
      height:
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight,
    })
  }, [])

  useEffect(() => {
    onResize()
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  return size
}

const useViewport = (): [Position, Rect] => {
  const position = useScrollPosition()
  const size = useWindowSize()

  return [position, size]
}

export default useViewport
