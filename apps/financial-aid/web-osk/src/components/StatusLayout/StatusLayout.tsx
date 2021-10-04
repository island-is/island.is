import React, { ReactNode, useContext, useEffect } from 'react'
import { Box, GridContainer, Text } from '@island.is/island-ui/core'

import * as styles from './StatusLayout.treat'

import { Logo } from '@island.is/financial-aid-web/osk/src/components'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
interface Props {
  children: ReactNode
}

const StatusLayout = ({ children }: Props) => {
  const { isAuthenticated, user } = useContext(UserContext)

  useEffect(() => {
    document.title = 'Fjárhagsaðstoð – Staða'
  }, [])

  if (isAuthenticated === false || user === undefined) {
    return null
  }

  return (
    <Box
      paddingY={[3, 3, 3, 6]}
      background="purple100"
      className={styles.processContainer}
    >
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
              <Text as="h3" variant="h3" marginBottom={[1, 1, 2]}>
                Umsókn um fjárhagsaðstoð hjá Hafnarfjarðarbæ
              </Text>
            </Box>
            <Logo className={styles.logo} />
          </Box>
        </div>
      </GridContainer>
    </Box>
  )
}

export default StatusLayout
