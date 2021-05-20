import React, { ReactElement, ReactNode } from 'react'

import { Logo } from '../Logo/Logo'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Button } from '../Button/Button'
import { Hidden } from '../Hidden/Hidden'
import { UserMenu } from './UserMenu/UserMenu'
import * as styles from './Header.treat'

export interface HeaderProps {
  authenticated?: boolean
  language?: string
  logoRender?: (ReactElement: ReactElement) => ReactElement
  logoutText?: string
  onLogout?: () => void
  switchLanguage?: () => void
  userLogo?: string
  userName?: string
  userAsDropdown?: boolean
  dropdownItems?: ReactNode
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
  userAsDropdown,
  dropdownItems,
  info,
}: HeaderProps) => {
  const renderLogo = () => {
    if (logoRender) {
      return logoRender(LogoIcon)
    }

    return LogoIcon
  }

  const renderInfo = () => {
    if (!info) {
      return null
    }

    return (
      <Box
        display="flex"
        className={styles.infoContainer}
        alignItems="center"
        height="full"
        marginLeft={[1, 1, 2, 4]}
        marginRight="auto"
      >
        <Box marginLeft={[1, 1, 2, 4]}>
          <Text variant="eyebrow">{info.title}</Text>
          {info.description && (
            <p className={styles.infoDescription}>{info.description}</p>
          )}
        </Box>
      </Box>
    )
  }

  const renderDropdown = () => {
    if (!userAsDropdown) {
      return null
    }

    return (
      <UserMenu
        authenticated={authenticated}
        username={userName}
        language={language}
        dropdownItems={dropdownItems}
        switchLanguage={switchLanguage}
        onLogout={onLogout}
      />
    )
  }

  const renderDefault = () => {
    if (userAsDropdown) {
      return null
    }

    return (
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
    )
  }

  return (
    <Box
      className={styles.container}
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
    >
      {renderLogo()}
      {renderInfo()}
      {renderDropdown()}
      {renderDefault()}
    </Box>
  )
}
