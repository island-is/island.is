import React, { ReactNode, useContext, useEffect, useMemo } from 'react'
import { Box, GridContainer, Text } from '@island.is/island-ui/core'

import * as styles from './StatusLayout.treat'

import {
  LogoHfj,
  Login,
  HasApplied,
} from '@island.is/financial-aid-web/osk/src/components'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import { ApplicationState, getState } from '@island.is/financial-aid/shared'

interface Props {
  children: ReactNode
}

const StatusLayout = ({ children }: Props) => {
  const { isAuthenticated, user } = useContext(UserContext)

  const currentState = useMemo(() => {
    if (user?.activeApplication) {
      return getState[user.activeApplication.state]
    }
  }, [user])

  useEffect(() => {
    document.title = 'Fjárhagsaðstoð – Staða'
  }, [])

  if (isAuthenticated === false) {
    return <Login />
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
      {!user.hasAppliedForPeriod ? (
        <div>Þú hefur ekki sótt um?</div>
      ) : (
        <GridContainer className={styles.gridContainer}>
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
              <Box>
                <div className={`tags approve`}>Staða: {currentState}</div>
                <Text as="h3" variant="h3" marginBottom={[1, 1, 2]}>
                  Umsókn um fjárhagsaðstoð hjá Hafnarfjarðarbæ
                </Text>
              </Box>
              <LogoHfj className={styles.logo} />
            </Box>
          </div>
        </GridContainer>
      )}{' '}
    </Box>
  )
}

export default StatusLayout
