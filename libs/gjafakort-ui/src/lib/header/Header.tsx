import React from 'react'
import { Logo } from '@island.is/island-ui/core'
import * as styles from './Header.treat'

export const Header = () => {
  return (
    <div className={styles.container}>
      <Logo width={160} />
    </div>
  )
}

export default Header
