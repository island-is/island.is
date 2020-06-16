import React, { ReactElement } from 'react'

import { Logo } from '../Logo/Logo'

import * as styles from './Header.treat'
import { Button } from '../Button/Button'

export interface HeaderPorps {
  logoRender?: (ReactElement) => ReactElement
  authenticated?: boolean
  onLogout?: () => void
  logoutText?: string
  userName?: string
}

export const Header = ({
  logoRender,
  authenticated,
  onLogout,
  userName = '',
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
        <div>
          {userName}
          <Button variant="menu" leftIcon="user" onClick={onLogout}>
            {logoutText}
          </Button>
        </div>
      )}
    </div>
  )
}

export default Header
