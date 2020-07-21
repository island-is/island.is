import { useState, useMemo, useCallback } from 'react'
import minBy from 'lodash/minBy'
import useViewport from './useViewport'

const useScrollSpy = ({
  margin,
}: {
  margin: number
}): [(id: string) => (e: HTMLElement) => void, string | undefined] => {
  const [elements, setElements] = useState<{ [key: string]: HTMLElement }>({})
  const [{ y: scrollTop }, { height: windowHeight }] = useViewport()

  const addRef = useCallback(
    (key: string) => {
      return (e: HTMLElement) => {
        setElements((es) => (es[key] ? es : { ...es, [key]: e }))
      }
    },
    [setElements],
  )

  const current = useMemo(() => {
    const candidates = Array.from(
      Object.entries(elements),
    ).map(([name, elem]) => ({ name, elem }))

    return minBy(candidates, (c) => {
      const { top, height } = c.elem.getBoundingClientRect()
      return Math.min(
        Math.abs(top - margin),
        Math.abs(top + height - margin - 1),
      )
    })
  }, [margin, elements, scrollTop, windowHeight])

  return [addRef, current ? current.name : '']
}

export default useScrollSpy
