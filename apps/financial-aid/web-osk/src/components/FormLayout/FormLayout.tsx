import React, { ReactNode, useContext, useEffect } from 'react'
import { Box, GridContainer, FormStepper } from '@island.is/island-ui/core'

import * as styles from './FormLayout.treat'

import { LogoHfj } from '@island.is/financial-aid-web/osk/src/components'

import useNavigationTree from '@island.is/financial-aid-web/osk/src/utils/useNavigationTree'

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
    </Box>
  ) : null
}

export default FormLayout
