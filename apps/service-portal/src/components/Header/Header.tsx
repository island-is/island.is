import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Box, Hidden } from '@island.is/island-ui/core'
import * as styles from './Header.treat'
import { Logo } from '../Logo/Logo'
import UserMenu from '../UserMenu/UserMenu'
import NotificationMenuTrigger from '../Notifications/NotificationMenuTrigger/NotificationMenuTrigger'

export const Header: FC<{}> = () => {
  return (
    <>
      <div className={styles.placeholder} />
      <header className={styles.header}>
        <Link to="/">
          <Box display="flex" height="full" alignItems="center">
            <Hidden above="md">
              <Logo width={40} iconOnly />
            </Hidden>
            <Hidden below="lg">
              <Logo />
            </Hidden>
          </Box>
        </Link>
        <Box
          display="flex"
          justifyContent="flexEnd"
          height="full"
          alignItems="center"
        >
          <div className={styles.divider} />
          <UserMenu />
          <div className={styles.divider} />
          <NotificationMenuTrigger />
        </Box>
      </header>
    </>
  )
}

export default Header
