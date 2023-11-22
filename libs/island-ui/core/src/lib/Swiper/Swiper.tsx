import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import cn from 'classnames'

import * as styles from './Swiper.css'

const FALLBACK_WIDTH = 10

interface Props {
  width?: number
  className?: string
}

export const Swiper: FC<React.PropsWithChildren<Props>> = ({
  children,
  width,
  className,
}) => {
  const [itemWidth, setItemWidth] = useState<number>(width ?? FALLBACK_WIDTH)
  const ref = useRef<HTMLDivElement>(null)

  const onResize = useCallback(() => {
    if (ref?.current) {
      const w = ref?.current?.offsetWidth as number
      setItemWidth(~~(w * 0.77))
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
        <div className={cn(styles.slides)}>
          {arr.map((child, i) => (
            <div
              key={i}
              className={cn(
                styles.slide,
                className,
                i === 0 && styles.noMargin,
              )}
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
