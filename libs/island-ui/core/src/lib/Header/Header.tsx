import React, { ReactElement } from 'react'

import { Logo } from '../Logo/Logo'

import { Box } from '../Box/Box'
import { Typography } from '../Typography/Typography'
import * as styles from './Header.treat'
import { Button } from '../Button/Button'
import { Hidden } from '../Hidden/Hidden'

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
  const LogoIcon = (
    <>
      <Hidden above="sm">
        <Logo width={40} iconOnly />
      </Hidden>
      <Hidden below="md">
        <Logo width={160} />
      </Hidden>
    </>
  )
  const logo = () => {
    if (logoRender) {
      return logoRender(LogoIcon)
    }
    return LogoIcon
  }
  return (
    <div className={styles.container}>
      {logo()}
      {authenticated && (
        <div className={styles.actionsContainer}>
          <div className={styles.userNameContainer}>
            {userLogo && (
              <Box marginRight={1} marginBottom={1}>
                <span role="img" aria-label="user">
                  {userLogo}
                </span>
              </Box>
            )}
            <Typography variant="eyebrow" turnicate>
              {userName}
            </Typography>
          </div>
          <Button variant="menu" leftIcon="user" onClick={onLogout}>
            {logoutText}
          </Button>
        </div>
      )}
    </div>
  )
}

export default Header
