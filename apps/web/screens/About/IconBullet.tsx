import React, { FC } from 'react'
import cn from 'classnames'
import * as styles from './IconBullet.treat'

export interface IconBulletProps {
  variant?: 'red' | 'blue' | 'gradient'
  size?: 'small' | 'large'
  center?: boolean
  image?: string
}

const IconBullet: FC<IconBulletProps> = ({
  variant = 'blue',
  size = 'large',
  center = false,
  image,
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
    {image ? <img className={styles.image} src={image} alt="" /> : children}
  </div>
)

export default IconBullet
