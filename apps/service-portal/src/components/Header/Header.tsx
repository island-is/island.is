import React, { useState } from 'react'
import {
  Box,
  Hidden,
  Button,
  Logo,
  FocusableBox,
  Icon,
} from '@island.is/island-ui/core'
import * as styles from './Header.css'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { UserLanguageSwitcher, UserMenu } from '@island.is/shared/components'
import { m } from '@island.is/service-portal/core'
import { Link } from 'react-router-dom'
import { useAuth } from '@island.is/auth/react'

interface Props {
  position: number
  sideMenuOpen: boolean
  setSideMenuOpen: (set: boolean) => void
}
export const Header = ({ position, sideMenuOpen, setSideMenuOpen }: Props) => {
  const { formatMessage } = useLocale()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { userInfo: user } = useAuth()

  const closeButton = () => {
    return (
      <FocusableBox
        display="flex"
        alignItems="center"
        component="button"
        onClick={() => setSideMenuOpen(false)}
        padding={1}
        borderRadius="circle"
        background="blue100"
        className={styles.closeButton}
      >
        <Icon icon="close" color="blue400" />
      </FocusableBox>
    )
  }

  return (
    <div className={styles.placeholder}>
      {/*  Inline style to dynamicly change position of header because of alert banners */}
      <header className={styles.header} style={{ top: position }}>
        <Box width="full">
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            width="full"
            paddingX={3}
          >
            <Link to={ServicePortalPath.MinarSidurRoot}>
              <FocusableBox component="div">
                <Hidden above="sm">
                  <Logo width={24} height={22} iconOnly id="header-mobile" />
                </Hidden>
                <Hidden below="md">
                  <Logo width={136} height={22} id="header" />
                </Hidden>
              </FocusableBox>
            </Link>
            <Hidden print>
              <Box
                display="flex"
                alignItems="center"
                flexWrap="nowrap"
                marginLeft={[1, 1, 2]}
              >
                <Box marginRight={[1, 1, 2]}>
                  <Link to={ServicePortalPath.ElectronicDocumentsRoot}>
                    <Button
                      variant="ghost"
                      size="small"
                      icon="mail"
                      iconType="outline"
                    >
                      {formatMessage(m.documents)}
                    </Button>
                  </Link>
                </Box>
                <UserMenu
                  fullscreen
                  setUserMenuOpen={setUserMenuOpen}
                  userMenuOpen={userMenuOpen}
                />

                {userMenuOpen && (
                  <Hidden above="md">
                    <Box display="flex" flexDirection="row" alignItems="center">
                      {user && <UserLanguageSwitcher user={user} />}
                      {closeButton()}
                    </Box>
                  </Hidden>
                )}

                {!sideMenuOpen ? (
                  <Box marginLeft={[1, 2]}>
                    <Button
                      variant="utility"
                      icon="menu"
                      onClick={() => setSideMenuOpen(true)}
                    >
                      {formatMessage(m.menu)}
                    </Button>
                  </Box>
                ) : (
                  <Box display="flex" flexDirection="row" alignItems="center">
                    {user && <UserLanguageSwitcher user={user} />}
                    {closeButton()}
                  </Box>
                )}
              </Box>
            </Hidden>
          </Box>
        </Box>
      </header>
    </div>
  )
}

export default Header
