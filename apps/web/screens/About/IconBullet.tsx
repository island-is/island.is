import React, { FC } from 'react'
import cn from 'classnames'
import * as styles from './IconBullet.treat'

export interface IconBulletProps {
  variant?: 'red' | 'blue' | 'gradient'
  size?: 'small' | 'large'
  center?: boolean
}

const IconBullet: FC<IconBulletProps> = ({
  variant = 'blue',
  size = 'large',
  center = false,
  children,
}) => (
  <div
    className={cn(styles.container, {
      [styles.red]: variant === 'red',
      [styles.gradient]: variant === 'gradient',
      [styles.small]: size === 'small',
      [styles.center]: center,
    })}
  >
    <span>{children}</span>
  </div>
)

export default IconBullet
