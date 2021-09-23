import React, { ReactNode, useContext, useEffect } from 'react'
import { Box, GridContainer, Text } from '@island.is/island-ui/core'

import * as styles from './AppLayout.treat'
import { Logo } from '@island.is/financial-aid-web/osk/src/components'

import { Login, SideBar } from '@island.is/financial-aid-web/osk/src/components'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import cn from 'classnames'
import HasApplied from '../HasApplied/hasApplied'

interface Props {
  children: ReactNode
}

const AppLayout = ({ children }: Props) => {
  const { isAuthenticated, user } = useContext(UserContext)
  //React helmet, nextjs head
  useEffect(() => {
    document.title = 'Umsókn um fjárhagsaðstoð'
  }, [])

  if (!isAuthenticated) {
    return <Login headline="Skráðu þig inn" />
  }
  if (!user) {
    return null
  }

  return (
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
  )
}

export default AppLayout
