import { CSSProperties, useEffect, useRef, useState } from 'react'

const style: CSSProperties = {
  height: '1px',
  backgroundColor: 'transparent',
}

const debugStyle: CSSProperties = {
  height: '1px',
  backgroundColor: 'springgreen',
  position: 'relative',
  zIndex: 9999,
}

export interface UseDynamicShadowOptions
  extends Omit<IntersectionObserverInit, 'threshold'> {
  debug?: boolean
  isDisabled?: boolean
}

/**
 * This hooks works by observing if a transparent element is in-view or not.
 * The debug prop will show the pixel element in green and console.log the events.
 */
export const useDynamicShadow = (config: UseDynamicShadowOptions = {}) => {
  const { debug = false, isDisabled = false, ...options } = config
  const ref = useRef<HTMLDivElement>(null)
  const [showShadow, setShowShadow] = useState(false)
  const isObserving = useRef(false)

  useEffect(() => {
    if (debug) {
      console.log('useDynamicShadow, useEffect', ref.current)
    }

    if (!ref.current) return
    if (isObserving.current || isDisabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].intersectionRatio === 0) {
          if (debug) {
            console.log('useDynamicShadow, 🔴 No intersection with screen')
          }
          setShowShadow(true)
        } else if (entries[0].intersectionRatio > 0) {
          if (debug)
            console.log('useDynamicShadow, 🟢 Fully intersects with screen')
          setShowShadow(false)
        }
      },
      { threshold: [0, 1], root: options.root, rootMargin: options.rootMargin },
    )

    if (debug) {
      console.log('useDynamicShadow, 🔌 connect')
    }
    isObserving.current = true
    observer.observe(ref.current)

    return () => {
      if (debug) {
        console.log('useDynamicShadow, ✂️ disconnect')
      }
      isObserving.current = false
      observer.disconnect()
    }
  }, [setShowShadow, debug, isDisabled, options.root, options.rootMargin])

  return {
    showShadow,
    pxProps: {
      ref,
      style: config.debug ? debugStyle : style,
    },
  }
}
