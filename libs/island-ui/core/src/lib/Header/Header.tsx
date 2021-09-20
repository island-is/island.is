import React, { ReactElement, ReactNode } from 'react'

import { Logo } from '../Logo/Logo'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Hidden } from '../Hidden/Hidden'
import { UserMenu } from './UserMenu/UserMenu'
import { Inline } from '../Inline/Inline'
import * as styles from './Header.treat'

export interface HeaderProps {
  info?: {
    title: string
    description?: string
  }
  logoRender?: (ReactElement: ReactElement) => ReactElement
  logoutText?: string
  headerItems?: ReactNode
  /**
   * @deprecated please pass in a UserMenu or other header items with `headerItems`
   */
  authenticated?: boolean
  /**
   * @deprecated please pass in a UserMenu or other header items with `headerItems`
   */
  onLogout?: () => void
  /**
   * @deprecated please pass in a UserMenu or other header items with `headerItems`
   */
  switchLanguage?: () => void
  /**
   * @deprecated please pass in a UserMenu or other header items with `headerItems`
   */
  userLogo?: string
  /**
   * @deprecated please pass in a UserMenu or other header items with `headerItems`
   */
  userName?: string
  /**
   * @deprecated please pass in a UserMenu or other header items with `headerItems`
   */
  userAsDropdown?: boolean
  /**
   * @deprecated please pass in a UserMenu or other header items with `headerItems`
   */
  dropdownItems?: ReactNode
  /**
   * @deprecated please pass in a UserMenu or other header items with `headerItems`
   */
  language?: string
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
  onLogout,
  switchLanguage,
  userName = '',
  dropdownItems,
  info,
  headerItems,
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

  const renderOldDropdown = () => {
    if (!userName) {
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

  return (
    <Box
      className={styles.container}
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
    >
      <Inline alignY="center">
        {renderLogo()}
        {renderInfo()}
      </Inline>
      <Inline alignY="center" space={2}>
        {renderOldDropdown()}
        {headerItems}
      </Inline>
    </Box>
  )
}
