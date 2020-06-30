import React, { ReactElement } from 'react'

import { Logo } from '../Logo/Logo'

import { Box } from '../Box/Box'
import { Typography } from '../Typography/Typography'
import * as styles from './Header.treat'
import { Button } from '../Button/Button'
import { Hidden } from '../Hidden/Hidden'

export interface HeaderPorps {
  authenticated?: boolean
  language?: 'Íslenska' | 'English'
  logoRender?: (ReactElement) => ReactElement
  logoutText?: string
  onLogout?: () => void
  switchLanguage?: () => void
  userLogo?: string
  userName?: string
}

export const Header = ({
  authenticated,
  language,
  logoRender,
  logoutText = 'Útskrá',
  onLogout,
  switchLanguage,
  userLogo,
  userName = '',
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
      <div className={styles.actionsContainer}>
        {authenticated && (
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
        )}
        {language && (
          <Box marginRight={2}>
            <Button variant="menu" onClick={switchLanguage}>
              {language}
            </Button>
          </Box>
        )}
        {authenticated && (
          <Button variant="menu" leftIcon="lock" onClick={onLogout}>
            {logoutText}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Header
