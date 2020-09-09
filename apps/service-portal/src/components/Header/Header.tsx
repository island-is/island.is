import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Hidden,
  ResponsiveSpace,
  ContentBlock,
} from '@island.is/island-ui/core'
import * as styles from './Header.treat'
import { Logo } from '../Logo/Logo'
import UserMenu from '../UserMenu/UserMenu'
import NotificationMenuTrigger from '../Notifications/NotificationMenuTrigger/NotificationMenuTrigger'
import { ServicePortalPath } from '@island.is/service-portal/core'

const spacing = [1, 1, 1, 2] as ResponsiveSpace

export const Header: FC<{}> = () => {
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
                  <UserMenu />
                </Box>
                <Box marginLeft={spacing}>
                  <NotificationMenuTrigger />
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
