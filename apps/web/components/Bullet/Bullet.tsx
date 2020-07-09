import React, { FC } from 'react'
import cn from 'classnames'
import * as styles from './Bullet.treat'
import { Icon } from '@island.is/island-ui/core'

interface BulletProps {
  align?: 'left' | 'right'
}

export const Bullet: FC<BulletProps> = ({ align }) => (
  <span
    className={cn(styles.bullet, {
      [styles.bulletLeft]: align === 'left',
      [styles.bulletRight]: align === 'right',
    })}
  >
    <Icon type="bullet" color="red400" />
  </span>
)

export default Bullet
