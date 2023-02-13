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
import { UserLanguageSwitcher } from '@island.is/shared/components'
import { useLocale } from '@island.is/localization'
import { UserMenu } from '@island.is/shared/components'
import { m } from '@island.is/service-portal/core'
import { Link } from 'react-router-dom'
import { useAuth } from '@island.is/auth/react'
import { PortalPageLoader } from '@island.is/portals/core'

interface Props {
  position: number
  mobileMenuOpen: boolean
  setMobileMenuOpen: (set: boolean) => void
}
export const Header = ({
  position,
  mobileMenuOpen,
  setMobileMenuOpen,
}: Props) => {
  const { formatMessage } = useLocale()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { userInfo: user } = useAuth()

  const closeButton = (userMenu: boolean) => {
    return (
      <FocusableBox
        display="flex"
        alignItems="center"
        component="button"
        onClick={
          userMenu
            ? () => setUserMenuOpen(false)
            : () => setMobileMenuOpen(false)
        }
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
      <PortalPageLoader />
      {/*  Inline style to dynamicly change position of header because of alert banners */}
      <header className={styles.header} style={{ top: position }}>
        <Box width="full">
          <Box
            display="flex"
            justifyContent={['spaceBetween', 'spaceBetween', 'flexEnd']}
            alignItems="center"
            width="full"
            background="white"
            paddingX={[3, 3, 3, 3, 6]}
          >
            <Hidden above="sm">
              <Link to={ServicePortalPath.MinarSidurRoot}>
                <FocusableBox component="div">
                  <Logo width={40} iconOnly />
                </FocusableBox>
              </Link>
            </Hidden>
            <Hidden print>
              <Box
                display="flex"
                alignItems="center"
                flexWrap="nowrap"
                marginLeft={1}
              >
                <UserMenu
                  fullscreen
                  setUserMenuOpen={setUserMenuOpen}
                  userMenuOpen={userMenuOpen}
                />

                {userMenuOpen && (
                  <Hidden above="md">
                    <Box display="flex" flexDirection="row" alignItems="center">
                      {user && <UserLanguageSwitcher user={user} />}
                      {closeButton(true)}
                    </Box>
                  </Hidden>
                )}
                {!userMenuOpen && (
                  <Hidden above="sm">
                    {!mobileMenuOpen ? (
                      <Box marginLeft={[1, 2]}>
                        <Button
                          variant="utility"
                          icon="menu"
                          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                          {formatMessage(m.menu)}
                        </Button>
                      </Box>
                    ) : (
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                      >
                        {user && <UserLanguageSwitcher user={user} />}
                        {closeButton(false)}
                      </Box>
                    )}
                  </Hidden>
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
