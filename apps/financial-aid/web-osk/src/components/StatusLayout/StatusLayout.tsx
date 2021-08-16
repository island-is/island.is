import React, { ReactNode, useContext, useEffect } from 'react'
import { Box, GridContainer, FormStepper } from '@island.is/island-ui/core'

import * as styles from './StatusLayout.treat'

import {
  LogoHfj,
  Login,
  HasApplied,
} from '@island.is/financial-aid-web/osk/src/components'

import useNavigationTree from '@island.is/financial-aid-web/osk/src/utils/useNavigationTree'
import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

interface Props {
  children: ReactNode
}

const StatusLayout = ({ children }: Props) => {
  const { isAuthenticated, user } = useContext(UserContext)

  const { form } = useContext(FormContext)
  const sections = useNavigationTree(Boolean(form?.hasIncome))

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
              <LogoHfj className={styles.logo} />
            </Box>
          </div>
        </GridContainer>
      )}{' '}
    </Box>
  )
}

export default StatusLayout
