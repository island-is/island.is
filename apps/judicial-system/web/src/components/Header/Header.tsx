import React, { useContext } from 'react'
import { useWindowSize } from 'react-use'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { Logo, Text, Box, Button } from '@island.is/island-ui/core'
import { api } from '@island.is/judicial-system-web/src/services'
import { UserContext } from '../UserProvider/UserProvider'
import { UserRole } from '@island.is/judicial-system/types'
import { theme } from '@island.is/island-ui/theme'
import * as Constants from '@island.is/judicial-system/consts'

import * as styles from './Header.css'

const Header: React.FC = () => {
  const router = useRouter()
  const { isAuthenticated, user } = useContext(UserContext)
  const { width } = useWindowSize()
  const isMobile = width <= theme.breakpoints.md

  return (
    <header className={styles.header}>
      <Link
        href={
          !user || !isAuthenticated
            ? '/'
            : user.role === UserRole.DEFENDER
            ? `${Constants.DEFENDER_ROUTE}/${router.query.id}`
            : user.role === UserRole.ADMIN
            ? Constants.USER_LIST_ROUTE
            : Constants.CASE_LIST_ROUTE
        }
        data-testid="link-to-home"
      >
        <Box display="flex" cursor="pointer" className={styles.logoContainer}>
          <Logo width={isMobile ? undefined : 146} iconOnly={isMobile} />
          {router.pathname !== '/' && (
            <span className={styles.logoContainerRvgName}>
              <Text>Réttarvörslugátt</Text>
            </span>
          )}
        </Box>
      </Link>
      {isAuthenticated && (
        <Button
          variant="ghost"
          icon="logOut"
          iconType="outline"
          size="small"
          onClick={async () => {
            await api.logout()
            window.location.assign('/')
          }}
          data-testid="logout-button"
        >
          {user?.name}
        </Button>
      )}
    </header>
  )
}

export default Header
