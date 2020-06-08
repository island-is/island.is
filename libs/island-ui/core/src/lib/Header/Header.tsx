import React, { ReactElement } from 'react'

import { Logo } from '../Logo/Logo'

import * as styles from './Header.treat'
import { Button } from '../Button/Button'

export interface HeaderPorps {
  logoRender?: (ReactElement) => ReactElement
  authenticated?: boolean
  onLogout?: () => void
  logoutText?: string
}

export const Header = ({
  logoRender,
  authenticated,
  onLogout,
  logoutText = 'Útskrá',
}: HeaderPorps) => {
  const LogoIcon = <Logo width={160} />
  const logo = () => {
    if (logoRender) {
      return logoRender(LogoIcon)
    }
    return LogoIcon
  }
  return (
    <div className={styles.container}>
      {logo()}{' '}
      {authenticated && (
        <Button variant="menu" leftIcon="user" onClick={onLogout}>
          {logoutText}
        </Button>
      )}
    </div>
  )
}

export default Header
