import React, { ReactElement } from 'react'

import { Logo } from '../Logo/Logo'

import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import * as styles from './Header.treat'
import { Button } from '../Button/Button'
import { Hidden } from '../Hidden/Hidden'

export interface HeaderProps {
  authenticated?: boolean
  language?: string
  logoRender?: (ReactElement: ReactElement) => ReactElement
  logoutText?: string
  onLogout?: () => void
  switchLanguage?: () => void
  userLogo?: string
  userName?: string
  info?: {
    title: string
    description?: string
  }
}

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

export const Header = ({
  authenticated,
  language,
  logoRender,
  logoutText,
  onLogout,
  switchLanguage,
  userLogo,
  userName = '',
  info,
}: HeaderProps) => {
  const logo = () => {
    if (logoRender) {
      return logoRender(LogoIcon)
    }

    return LogoIcon
  }

  return (
    <Box
      className={styles.container}
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
    >
      {logo()}

      {info && (
        <Box
          className={styles.infoContainer}
          display="flex"
          alignItems="center"
          height="full"
          marginLeft={[1, 1, 2, 4]}
          marginRight="auto"
        >
          <Box marginLeft={[1, 1, 2, 4]}>
            <Text variant="eyebrow">{info.title}</Text>
            {info.description && <Text>{info.description}</Text>}
          </Box>
        </Box>
      )}

      <Box display="flex" alignItems="center">
        {authenticated && (
          <Box
            className={styles.userNameContainer}
            display="flex"
            alignItems="center"
            marginLeft={2}
            marginRight={2}
          >
            {userLogo && (
              <Box marginRight={1} marginBottom={1}>
                <span role="img" aria-label="user">
                  {userLogo}
                </span>
              </Box>
            )}
            <Text variant="eyebrow" truncate>
              {userName}
            </Text>
          </Box>
        )}

        {language && (
          <Button variant="utility" onClick={switchLanguage}>
            {language}
          </Button>
        )}

        {authenticated && (
          <Box marginLeft={2}>
            <Button variant="utility" icon="lockClosed" onClick={onLogout}>
              {logoutText}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}
