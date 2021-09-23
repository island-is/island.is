import React, { ReactNode, useContext, useEffect } from 'react'
import { Box, FormStepper } from '@island.is/island-ui/core'

import * as styles from './FormLayout.treat'

import { Logo } from '@island.is/financial-aid-web/osk/src/components'
import { useRouter } from 'next/router'

import useNavigationTree from '@island.is/financial-aid-web/osk/src/utils/useNavigationTree'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import { NavigationProps } from '@island.is/financial-aid/shared/lib'

interface Props {
  children: ReactNode
}

const FormLayout = ({ children }: Props) => {
  const router = useRouter()

  const { form } = useContext(FormContext)
  const sections = useNavigationTree(Boolean(form?.hasIncome))

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const activeSection = navigation?.activeSectionIndex

  useEffect(() => {
    if (activeSection !== undefined) {
      document.title = 'Umsókn - ' + sections[activeSection].name ?? ''
    }
  }, [activeSection])

  return (
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
          {activeSection !== undefined && (
            <FormStepper
              sections={sections}
              activeSection={activeSection}
              activeSubSection={navigation?.activeSubSectionIndex}
            />
          )}
        </Box>

        <Logo className={styles.logo} />
      </Box>
    </div>
  )
}

export default FormLayout
