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
import { useStore } from '../../store/stateProvider'
import { ActionType } from '../../store/actions'
import { m } from '@island.is/service-portal/core'
import { Link } from 'react-router-dom'
import { useAuth } from '@island.is/auth/react'

interface Props {
  position: number
}
export const Header = ({ position }: Props) => {
  const { formatMessage } = useLocale()
  const [{ mobileMenuState }, dispatch] = useStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { userInfo: user } = useAuth()

  const handleMobileMenuTriggerClick = () =>
    dispatch({
      type: ActionType.SetMobileMenuState,
      payload: mobileMenuState === 'open' ? 'closed' : 'open',
    })

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
            background="white"
            paddingX={[3, 3, 3, 3, 6]}
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
                <Link to={ServicePortalPath.ElectronicDocumentsRoot}>
                  <Button
                    variant="utility"
                    size="small"
                    icon="mail"
                    iconType="outline"
                  >
                    {formatMessage(m.documents)}
                  </Button>
                </Link>

                <UserMenu
                  fullscreen
                  setUserMenuOpen={setUserMenuOpen}
                  userMenuOpen={userMenuOpen}
                />
                <Box marginLeft={[1, 1, 2]}>
                  <Button
                    variant="utility"
                    icon="menu"
                    onClick={handleMobileMenuTriggerClick}
                  ></Button>
                </Box>
                {/* {userMenuOpen && (
                  <Hidden above="md">
                    <Box display="flex" flexDirection="row" alignItems="center">
                      {user && <UserLanguageSwitcher user={user} />}
                      {closeButton(true)}
                    </Box>
                  </Hidden>
                )}
                {!userMenuOpen && (
                  <Hidden above="sm">
                    {mobileMenuState === 'closed' ? (
                      <Box marginLeft={[1, 2]}>
                        <Button
                          variant="utility"
                          icon="menu"
                          onClick={handleMobileMenuTriggerClick}
                        ></Button>
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
                )} */}
              </Box>
            </Hidden>
          </Box>
        </Box>
      </header>
    </div>
  )
}

export default Header
