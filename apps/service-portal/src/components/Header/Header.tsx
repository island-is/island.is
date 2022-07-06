import React, { FC, useState } from 'react'
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

export const Header: FC<{}> = () => {
  const { formatMessage } = useLocale()
  const [{ mobileMenuState }, dispatch] = useStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { userInfo: user } = useAuth()

  const handleMobileMenuTriggerClick = () =>
    dispatch({
      type: ActionType.SetMobileMenuState,
      payload: mobileMenuState === 'open' ? 'closed' : 'open',
    })

  const closeButton = (userMenu: boolean) => {
    return (
      <FocusableBox
        display="flex"
        alignItems="center"
        component="button"
        onClick={
          userMenu
            ? () => setUserMenuOpen(false)
            : () => handleMobileMenuTriggerClick()
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
    <>
      <div className={styles.placeholder} />
      <header className={styles.header}>
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
                    {mobileMenuState === 'closed' ? (
                      <Box marginLeft={[1, 2]}>
                        <Button
                          variant="utility"
                          icon="menu"
                          onClick={handleMobileMenuTriggerClick}
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
    </>
  )
}

export default Header
