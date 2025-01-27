import { useEffect, useState } from 'react'

import useViewport from './useViewport'

const useBoundingClientRect = (): [
  (e: HTMLElement) => void,
  ClientRect | undefined,
] => {
  const [element, setElement] = useState<HTMLElement>()
  const [rect, setRect] = useState<ClientRect>()
  const [position, size] = useViewport()

  useEffect(() => {
    setRect(element?.getBoundingClientRect())
  }, [element, position, size])

  return [setElement, rect]
}

export default useBoundingClientRect
