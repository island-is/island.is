/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import { Icon } from '@island.is/island-ui/core'
import * as styles from './BigLink.treat'

export interface BigLinkProps {
  href: string
  color?: 'blue' | 'white'
}

const BigLink: FC<BigLinkProps> = ({ children, color = 'blue', href }) => (
  <div
    className={cn(styles.container, {
      [styles.containerWhite]: color === 'white',
    })}
  >
    <Link href={href}>
      <a className={cn(styles.link, { [styles.linkWhite]: color === 'white' })}>
        {children}{' '}
        <span className={styles.icon}>
          <Icon
            type="arrowRight"
            width="13"
            height="13"
            color={color === 'blue' ? 'blue400' : 'white'}
          />
        </span>
      </a>
    </Link>
  </div>
)

export default BigLink
