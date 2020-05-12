import React from 'react'
import { Logo } from '@island.is/island-ui/core'

import styles from './Header.scss'

export const Header = () => {
  return (
    <div className={styles.container}>
      <Logo width={160} />
    </div>
  )
}

export default Header
