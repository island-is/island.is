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
import { BetaTag } from '../Logo/BetaTag'
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
      <Box
        borderRadius="circle"
        color="blue400"
        background="blue100"
        onClick={
          userMenu
            ? () => setUserMenuOpen(false)
            : () => handleMobileMenuTriggerClick()
        }
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding={[1, 'p2']}
      >
        <Icon icon="close" color="blue400" />
      </Box>
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
                  <BetaTag />
                </FocusableBox>
              </Link>
            </Hidden>
            <Box display="flex" alignItems="center" flexWrap="nowrap">
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
                    <Box marginLeft={1}>
                      <Button
                        variant="utility"
                        icon="menu"
                        onClick={handleMobileMenuTriggerClick}
                      >
                        {formatMessage(m.menu)}
                      </Button>
                    </Box>
                  ) : (
                    <Box display="flex" flexDirection="row" alignItems="center">
                      {user && <UserLanguageSwitcher user={user} />}
                      {closeButton(false)}
                    </Box>
                  )}
                </Hidden>
              )}
            </Box>
          </Box>
        </Box>
      </header>
    </>
  )
}

export default Header
