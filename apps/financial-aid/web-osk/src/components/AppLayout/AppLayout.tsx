import React, { ReactNode, useContext, useEffect } from 'react'
import { Box, GridContainer } from '@island.is/island-ui/core'

import * as styles from './AppLayout.treat'
import { Logo, Header } from '@island.is/financial-aid-web/osk/src/components'

import {
  SideBar,
  ServiceCenter,
} from '@island.is/financial-aid-web/osk/src/components'

import cn from 'classnames'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

interface Props {
  children: ReactNode
}

const AppLayout = ({ children }: Props) => {
  const { isAuthenticated, user, userServiceCenter } = useContext(AppContext)

  useEffect(() => {
    document.title = 'Fjárhagsaðstoð'
  }, [])

  if (isAuthenticated === false || user === undefined) {
    return null
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
              {/* Todo: þjóðskrá */}
              {userServiceCenter === undefined || userServiceCenter?.active ? (
                <>{children}</>
              ) : (
                <ServiceCenter serviceCenter={userServiceCenter} />
              )}
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
