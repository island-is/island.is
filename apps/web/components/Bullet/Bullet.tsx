import React from 'react'
import cn from 'classnames'

import * as styles from './Bullet.css'

interface BulletProps {
  align?: 'left' | 'right'
  top?: string | number
  color?: keyof typeof styles.color
}

export const Bullet = ({ align, top, color = 'red' }: BulletProps) => (
  <span
    className={cn(styles.bulletWrapper, {
      [styles.left]: align === 'left',
      [styles.right]: align === 'right',
    })}
    style={{ top }}
  >
    <span className={cn(styles.bullet, styles.color[color])}></span>
  </span>
)

export default Bullet
