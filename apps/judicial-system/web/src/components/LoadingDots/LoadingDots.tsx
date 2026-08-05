import React from 'react'
import cn from 'classnames'

import * as styles from './LoadingDots.css'

interface LoadingDotsProps {
  single?: boolean
  color?: 'blue' | 'white' | 'black' | 'gradient'
  size?: 'small' | 'medium' | 'large'
  ariaLabel?: string
}

export const LoadingDots = ({
  color = 'blue',
  size = 'medium',
  single,
  ariaLabel = 'Hleður',
}: LoadingDotsProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
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
