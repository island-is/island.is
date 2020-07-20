import React, { FC } from 'react'
import { removeToken } from '../../auth/utils'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { usePersistUserInfo } from '../../hooks/usePersistUserInfo/usePersistUserInfo'
import { MOCK_AUTH_KEY } from '@island.is/service-portal/constants'
import { Logo, Box, Hidden, Icon } from '@island.is/island-ui/core'
import MenuButton from '../MenuButton/MenuButton'

import * as styles from './Header.treat'
import UserNavigation from '../UserNavigation/UserNavigation'

export const Header: FC<{}> = () => {
  usePersistUserInfo()
  const history = useHistory()

  const handleLogout = async () => {
    await removeToken()
    // TODO: Remove store state?
    localStorage.removeItem(MOCK_AUTH_KEY)
    history.push('/innskraning')
  }

  return (
    <header className={styles.container}>
      <Box display={'flex'} alignItems={'center'} padding={'gutter'}>
        <Hidden above="sm">
          <Link to="/">
            <Logo width={40} iconOnly />
          </Link>
        </Hidden>
        <Hidden below="md">
          <Link to="/">
            <Logo width={160} />
          </Link>
        </Hidden>
      </Box>
      <div className={styles.infoContainer}>
        <MenuButton onClick={handleLogout}>
          <Icon type="lock" />
        </MenuButton>
      </div>
    </header>
  )
}

export default Header
