import React from 'react'

import { Logo } from '../Logo/Logo'

import * as styles from './Header.treat'

interface PropTypes {
  withPointer?: boolean
}

export const Header = ({ withPointer = false }: PropTypes) => {
  return (
    <div className={styles.container}>
      <div className={withPointer ? styles.pointer : undefined}>
        <Logo width={160} />
      </div>
    </div>
  )
}

export default Header
