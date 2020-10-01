import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Hidden,
  ResponsiveSpace,
  ContentBlock,
  Button,
} from '@island.is/island-ui/core'
import * as styles from './Header.treat'
import { Logo } from '../Logo/Logo'
import UserMenu from '../UserMenu/UserMenu'
import NotificationMenuTrigger from '../Notifications/NotificationMenuTrigger/NotificationMenuTrigger'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { Locale, useLocale, useNamespaces } from '@island.is/localization'

const spacing = [1, 1, 1, 2] as ResponsiveSpace

export const Header: FC<{}> = () => {
  const { lang } = useLocale()
  const { changeLanguage } = useNamespaces(['service.portal'])

  const handleLangClick = (value: Locale) => {
    changeLanguage(value)
  }

  return (
    <>
      <div className={styles.placeholder} />
      <header className={styles.header}>
        <Box width="full">
          <ContentBlock>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              height="full"
              background="white"
              paddingX={[2, 2, 4, 4, 6]}
            >
              <Link to={ServicePortalPath.MinarSidurRoot}>
                <Hidden above="md">
                  <Logo width={40} iconOnly />
                </Hidden>
                <Hidden below="lg">
                  <Logo />
                </Hidden>
              </Link>
              <Box display="flex">
                <Box marginLeft={spacing}>
                  <Button
                    variant="menu"
                    onClick={handleLangClick.bind(
                      null,
                      lang === 'is' ? 'en' : 'is',
                    )}
                  >
                    {lang === 'is' ? 'EN' : 'IS'}
                  </Button>
                </Box>
                <Box marginLeft={spacing}>
                  <UserMenu />
                </Box>
              </Box>
            </Box>
          </ContentBlock>
        </Box>
      </header>
    </>
  )
}

export default Header
