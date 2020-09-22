import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import * as styles from './Swiper.treat'

const Swiper: FC = ({ children }) => {
  const [width, setWidth] = useState<number>(0)
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

  return (
    <div className={styles.root}>
      <div className={cn(styles.container)} ref={ref}>
        <div className={styles.slides}>
          {React.Children.map(children, (child) => (
            <div className={styles.slide} style={{ width }}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Swiper
