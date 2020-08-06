import React, { FC } from 'react'
import cn from 'classnames'
import * as styles from './Bullet.treat'
import { Icon } from '@island.is/island-ui/core'

interface BulletProps {
  align?: 'left' | 'right'
  top: string | number
}

export const Bullet: FC<BulletProps> = ({ align, top }) => (
  <span
    className={cn(styles.bullet, {
      [styles.bulletLeft]: align === 'left',
      [styles.bulletRight]: align === 'right',
    })}
    style={{ top }}
  >
    <Icon type="bullet" color="red400" />
  </span>
)

export default Bullet
