import React from 'react'
import { Logo } from '@island.is/island-ui'

import styles from './Header.scss'

/* eslint-disable-next-line */
export interface HeaderProps {}

export const Header = (props: HeaderProps) => {
  return (
    <div className={styles.container}>
      <Logo width={160} />
    </div>
  )
}

export default Header
