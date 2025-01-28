import React, { FC, MouseEvent } from 'react'
import cn from 'classnames'

import * as styles from './IconBullet.css'

export interface IconBulletProps {
  variant?: 'red' | 'blue' | 'gradient'
  size?: 'small' | 'large'
  center?: boolean
  image?: string
  onClick?: (e: MouseEvent) => void
}

export const IconBullet: FC<React.PropsWithChildren<IconBulletProps>> = ({
  variant = 'blue',
  size = 'large',
  image,
  onClick,
  children,
}) => (
  <div
    className={cn(styles.container, {
      [styles.red]: variant === 'red',
      [styles.gradient]: variant === 'gradient',
      [styles.small]: size === 'small',
      [styles.clickable]: Boolean(onClick),
    })}
    onClick={onClick}
  >
    {image ? <img className={styles.image} src={image} alt="" /> : children}
  </div>
)

export default IconBullet
