import React from 'react'
import cn from 'classnames'
import * as styles from './Swiper.treat'
import { useMeasure } from 'react-use'

const Swiper = ({ children }) => {
  const [ref, { width }] = useMeasure()

  return (
    <div className={styles.root}>
      <div className={cn(styles.container)} ref={ref}>
        <div className={styles.slides}>
          {React.Children.map(children, (child) => (
            <div className={styles.slide} style={{ width: ~~(width * 0.77) }}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Swiper
