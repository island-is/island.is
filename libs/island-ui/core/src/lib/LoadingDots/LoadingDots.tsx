import React from 'react'
import cn from 'classnames'

import * as styles from './LoadingDots.css'

interface LoadingDotsProps {
  single?: boolean
  large?: boolean
  color?: 'blue' | 'white' | 'gradient'
}

export const LoadingDots = ({
  color = 'blue',
  large,
  single,
}: LoadingDotsProps) => {
  return (
    <div
      className={cn(styles.container, styles.colors[color], {
        [styles.single]: single,
        [styles.large]: large,
      })}
    >
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  )
}

export default LoadingDots
