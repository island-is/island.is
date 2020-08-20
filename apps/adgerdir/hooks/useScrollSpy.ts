import { useEffect, useRef, useState, useCallback } from 'react'
import minBy from 'lodash/minBy'
import useViewport from './useViewport'

const useScrollSpy = ({
  margin = 0,
  initialId = '',
}: {
  margin?: number
  initialId?: string
}): [(id: string) => (e: HTMLElement) => void, string | undefined] => {
  const elements = useRef<{ [key: string]: HTMLElement }>({})
  const [currentId, setCurrentId] = useState(initialId)

  // re-render on scroll or resize
  useViewport()

  // Elements are cleared on each render. After the component that calls this
  // hook has finished rendering, the useEffect hook below runs with
  // elements.current populated by the component using this hook.
  elements.current = {}

  const spy = useCallback(
    (key: string) => {
      return (e: HTMLElement) => {
        elements.current[key] = e
      }
    },
    [elements],
  )

  useEffect(() => {
    const candidates = Array.from(
      Object.entries(elements.current),
    ).map(([name, elem]) => ({ name, elem }))

    const best = minBy(candidates, (c) => {
      const { top, height } = c.elem.getBoundingClientRect()
      return Math.min(
        Math.abs(top - margin),
        Math.abs(top + height - margin - 1),
      )
    })

    if (best && best.name !== currentId) {
      setCurrentId(best.name)
    }
  })

  return [spy, currentId]
}

export default useScrollSpy
