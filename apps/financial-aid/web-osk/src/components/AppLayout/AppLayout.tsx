import React, { ReactNode, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, GridContainer } from '@island.is/island-ui/core'

import * as styles from './AppLayout.css'
import { Logo, Header } from '@island.is/financial-aid-web/osk/src/components'

import {
  SideBar,
  Skeleton,
} from '@island.is/financial-aid-web/osk/src/components'

import cn from 'classnames'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'
import { Routes } from '@island.is/financial-aid/shared/lib'

interface Props {
  children: ReactNode
}

const AppLayout = ({ children }: Props) => {
  const { isAuthenticated, user, loadingUser } = useContext(AppContext)
  const router = useRouter()

  useEffect(() => {
    document.title = 'Fjárhagsaðstoð'
  }, [])

  const isUserLoggedIn = isAuthenticated && user
  const shouldRedirect = router.pathname.startsWith(Routes.application)
  const shouldRouteToStatus =
    user?.spouse?.hasFiles ||
    (user?.currentApplicationId && !user?.spouse?.hasPartnerApplied)

  if (isUserLoggedIn && shouldRedirect && shouldRouteToStatus) {
    router.push(Routes.statusPage(user?.currentApplicationId as string))
    return null
  }

  if (isAuthenticated === false || user === undefined || loadingUser) {
    return <Skeleton />
  }
  return (
    <>
      <Header />

      <Box
        paddingY={[3, 3, 3, 6]}
        background="purple100"
        className={styles.processContainer}
      >
        <GridContainer
          className={cn({
            [`${styles.gridContainer}`]: true,
          })}
        >
          <div className={styles.gridRowContainer}>
            <Box
              background="white"
              borderColor="white"
              borderRadius="large"
              className={styles.formContainer}
            >
              {children}
            </Box>

            <Box className={styles.sidebarContent}>
              <SideBar />

              <Logo className={styles.logo} />
            </Box>
          </div>
        </GridContainer>
      </Box>
    </>
  )
}

export default AppLayout
