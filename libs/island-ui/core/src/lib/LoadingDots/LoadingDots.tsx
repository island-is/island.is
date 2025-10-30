import React from 'react'
import cn from 'classnames'

import * as styles from './LoadingDots.css'

interface LoadingDotsProps {
  single?: boolean
  color?: 'blue' | 'white' | 'gradient'
  size?: 'small' | 'medium' | 'large'
}

export const LoadingDots = ({
  color = 'blue',
  size = 'medium',
  single,
}: LoadingDotsProps) => {
  return (
    <div
      className={cn(styles.container, styles.colors[color], {
        [styles.single]: single,
        [styles.large]: size === 'large',
        [styles.small]: size === 'small',
      })}
    >
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  )
}

export default LoadingDots
