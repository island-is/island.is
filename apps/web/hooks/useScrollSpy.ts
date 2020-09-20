import { useEffect, useState, useCallback } from 'react'
import { throttle, debounce } from 'lodash'
import { useEvent } from 'react-use'

const guessVisibleSection = (ids: string[], marginTop: number): string | null => {
  if (ids.length === 0) return null

  // top of the page is a special case because otherwise we might match the
  // second page section if the first one is small enough
  if (window.scrollY <= 0) return ids[0]

  return ids.reduce((match, id) => {
    const el = document.getElementById(id)
    const elPosY = el.getBoundingClientRect().top + window.scrollY
    return window.scrollY + marginTop >= elPosY ? id : match
  }, ids[0])
}

const useScrollSpy = (
  ids: string[],
  { marginTop = 100 }: { marginTop?: number } = {},
): [string | undefined, (id: string) => void] => {
  const [current, setCurrent] = useState(ids[0])

  // flag to ignore scroll event when user navigates manually
  const [ignore, setIgnore] = useState(false)

  // every time scrolling stops we'll reset the ignore flag
  const checkScrollStop = useCallback(
    debounce(() => setIgnore(false), 50),
    [setIgnore],
  )
  useEvent('scroll', checkScrollStop, process.browser && window)

  // function to manually navigate
  const navigate = useCallback(
    (id: string) => {
      setCurrent(id)
      setIgnore(true)
      const rect = document.getElementById(id).getBoundingClientRect()
      window.scrollTo(0, rect.top + window.scrollY - marginTop)
    },
    [setCurrent, setIgnore],
  )

  // throttled function to update the active section id
  const updateCurrent = useCallback(
    throttle(() => {
      if (!ignore) {
        setCurrent(guessVisibleSection(ids, marginTop))
      }
    }, 100),
    [ids, ignore, setCurrent],
  )

  // update if id list changes
  useEffect(updateCurrent, [ids])

  // and call the update function on scroll and resize
  useEvent('scroll', updateCurrent, process.browser && window)
  useEvent('resize', updateCurrent, process.browser && window)

  return [current, navigate]
}

export default useScrollSpy
