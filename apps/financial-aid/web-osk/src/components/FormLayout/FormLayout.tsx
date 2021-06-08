import React, { ReactNode, useContext, useEffect } from 'react'
import {
  Box,
  GridContainer,
  FormStepper,
  Button,
} from '@island.is/island-ui/core'

import * as styles from './FormLayout.treat'

import { LogoHfj } from '@island.is/financial-aid-web/osk/src/components'
import { useRouter } from 'next/router'

import useNavigationTree from '@island.is/financial-aid-web/osk/src/utils/useNavigationTree'
import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'

interface PageProps {
  children: ReactNode
  activeSection?: number
  activeSubSection?: number
}

const FormLayout: React.FC<PageProps> = ({
  children,
  activeSection,
  activeSubSection,
}) => {
  const router = useRouter()
  const { isAuthenticated, setUser, user } = useContext(UserContext)

  const sections = useNavigationTree()

  useEffect(() => {
    if (activeSection !== undefined) {
      document.title = 'Umsókn - ' + sections[activeSection].name ?? ''
    } else {
      document.title = 'Umsókn um fjárhagsaðstoð'
    }
  }, [activeSection])

  return children ? (
    <Box
      paddingY={[3, 3, 3, 6]}
      background="purple100"
      className={styles.processContainer}
    >
      {isAuthenticated ? (
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
              <Box paddingLeft={[0, 0, 0, 3]}>
                <FormStepper
                  sections={sections}
                  activeSection={activeSection}
                  activeSubSection={activeSubSection}
                />
              </Box>

              <LogoHfj className={styles.logo} />
            </Box>
          </div>
        </GridContainer>
      ) : (
        <GridContainer className={styles.gridContainer}>
          <p>Heyrðu mig nú, þú verður að logga inn</p>
          <Button
            onClick={() => {
              router.push('/api/auth/login?nationalId=0000000000')
            }}
            data-testid="logout-button"
            preTextIconType="filled"
            size="small"
            type="button"
            variant="primary"
          >
            Login
          </Button>
        </GridContainer>
      )}
    </Box>
  ) : null
}

export default FormLayout
