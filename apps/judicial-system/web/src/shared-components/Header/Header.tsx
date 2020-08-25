import React from 'react'
import { Logo } from '@island.is/island-ui/core'

import * as styles from './Header.treat.ts'

const Header: React.FC = () => {
  return (
    <header class={`${styles.header}`}>
      <Logo width={32} iconOnly />
    </header>
  )
}

export default Header
