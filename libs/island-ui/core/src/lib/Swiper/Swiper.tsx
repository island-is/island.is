import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import cn from 'classnames'

import * as styles from './Swiper.css'

const FALLBACK_WIDTH = 316

export const Swiper: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const [width, setWidth] = useState<number>(FALLBACK_WIDTH)
  const ref = useRef<HTMLDivElement>(null)

  const onResize = useCallback(() => {
    if (ref?.current) {
      const w = ref?.current?.offsetWidth as number
      setWidth(~~(w * 0.77))
    }
  }, [ref])

  useEffect(() => {
    onResize()
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [onResize])

  const arr = React.Children.map(children, (child) => child) || []

  return (
    <div className={styles.root}>
      <div className={cn(styles.container)} ref={ref}>
        <div className={styles.slides}>
          {arr.map((child, i) => (
            <div
              key={i}
              className={styles.slide}
              style={{
                width,
                aspectRatio: '1/1',
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
