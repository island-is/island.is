import React, { ReactElement } from 'react'

import { Logo } from '../Logo/Logo'

import { Box } from '../Box/Box'
import { Typography } from '../Typography/Typography'
import * as styles from './Header.treat'
import { Button } from '../Button/Button'

export interface HeaderPorps {
  logoRender?: (ReactElement) => ReactElement
  authenticated?: boolean
  onLogout?: () => void
  logoutText?: string
  userName?: string
  userLogo?: string
}

export const Header = ({
  logoRender,
  authenticated,
  onLogout,
  userName = '',
  userLogo,
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
        <div className={styles.authenticated}>
          <Box display="flex" alignItems="center">
            {userLogo && (
              <Box marginRight={1} marginBottom={1}>
                <span role="img" aria-label="user">
                  {userLogo}
                </span>
              </Box>
            )}
            <Typography variant="eyebrow">{userName}</Typography>
          </Box>
          <div>
            <Button variant="menu" leftIcon="user" onClick={onLogout}>
              {logoutText}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
