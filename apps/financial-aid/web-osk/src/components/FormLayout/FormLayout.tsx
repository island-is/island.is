import React, { ReactNode, useContext } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  FormStepper,
} from '@island.is/island-ui/core'

import * as styles from './FormLayout.treat'

import { LogoHfj } from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

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
  const { form, updateForm } = useContext(FormContext)

  const sections = useNavigationTree(form?.hasIncome)

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
