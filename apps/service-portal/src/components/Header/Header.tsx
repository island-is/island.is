import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Box, Hidden } from '@island.is/island-ui/core'
import * as styles from './Header.treat'
import { Logo } from '../Logo/Logo'
import UserMenu from '../UserMenu/UserMenu'
import NotificationMenuTrigger from '../Notifications/NotificationMenuTrigger/NotificationMenuTrigger'
import { ServicePortalPath } from '@island.is/service-portal/core'

export const Header: FC<{}> = () => {
  return (
    <>
      <div className={styles.placeholder} />
      <header className={styles.header}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          height="full"
          paddingLeft={[3, 3, 6, 6]}
          paddingRight={[3, 3, 6, 6]}
        >
          <Link to={ServicePortalPath.MinarSidurRoot}>
            <Hidden above="md">
              <Logo width={40} iconOnly />
            </Hidden>
            <Hidden below="lg">
              <Logo />
            </Hidden>
          </Link>
          <UserMenu />
          <NotificationMenuTrigger />
        </Box>
      </header>
    </>
  )
}

export default Header
