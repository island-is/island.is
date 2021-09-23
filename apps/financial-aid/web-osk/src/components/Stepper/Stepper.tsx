import React, { useContext, useEffect, useState } from 'react'
import { FormStepper } from '@island.is/island-ui/core'

import { useRouter } from 'next/router'

import useNavigationTree from '@island.is/financial-aid-web/osk/src/utils/useNavigationTree'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import { NavigationProps } from '@island.is/financial-aid/shared/lib'

const Stepper = () => {
  const router = useRouter()

  const { form } = useContext(FormContext)
  const sections = useNavigationTree(Boolean(form?.hasIncome))

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const activeSection = navigation.activeSectionIndex

  useEffect(() => {
    if (activeSection !== undefined) {
      document.title = 'Umsókn - ' + sections[activeSection].name ?? ''
    }
  }, [activeSection])

  if (activeSection === undefined) {
    return null
  }
  return (
    <FormStepper
      sections={sections}
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    />
  )
}

export default Stepper
