/* eslint-disable react-hooks/exhaustive-deps */
import { DependencyList, MutableRefObject, useRef } from 'react'

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

interface ScrollProps {
  prevPos: {
    x: number
    y: number
  }
  currPos: {
    x: number
    y: number
  }
}

interface GetScrollPositionProps {
  element?: MutableRefObject<HTMLElement | null>
  useWindow?: boolean
}

const isBrowser = typeof window !== `undefined`

const getScrollPosition = ({ element, useWindow }: GetScrollPositionProps) => {
  if (!isBrowser) return { x: 0, y: 0 }

  const target = element?.current || document.body
  const position = target.getBoundingClientRect()

  return useWindow
    ? { x: window.scrollX, y: window.scrollY }
    : { x: position.left, y: position.top }
}

export const useScrollPosition = (
  effect: (props: ScrollProps) => void,
  deps?: DependencyList,
  element?: MutableRefObject<HTMLElement | null>,
  useWindow?: boolean,
  wait?: number,
) => {
  const position = useRef(getScrollPosition({ useWindow }))

  // ReturnType because of incompatible setTimeout signatures of Node and the browser.
  // (Tests are run in browser mode)
  let throttleTimeout: ReturnType<typeof setTimeout> | null = null

  const callBack = () => {
    const currPos = getScrollPosition({ element, useWindow })
    effect({ prevPos: position.current, currPos })
    position.current = currPos
    throttleTimeout = null
  }

  useIsomorphicLayoutEffect(() => {
    if (!isBrowser) {
      return
    }

    const handleScroll = () => {
      if (wait) {
        if (throttleTimeout === null) {
          throttleTimeout = setTimeout(callBack, wait)
        }
      } else {
        callBack()
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      throttleTimeout && clearTimeout(throttleTimeout)
    }
  }, deps)
}

export default useScrollPosition
