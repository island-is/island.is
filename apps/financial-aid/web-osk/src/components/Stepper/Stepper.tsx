import React, { useContext, useEffect } from 'react'
import { FormStepper } from '@island.is/island-ui/core'

import { useRouter } from 'next/router'

import useNavigationTree from '@island.is/financial-aid-web/osk/src/utils/useNavigationTree'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

import { findSectionIndex } from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

const Stepper = () => {
  const router = useRouter()

  const { form } = useContext(FormContext)
  const sections = useNavigationTree(Boolean(form?.hasIncome))

  const activeSection = findSectionIndex(sections, router.pathname)
    .activeSectionIndex

  const activeSubSectionIndex = findSectionIndex(sections, router.pathname)
    .activeSubSectionIndex

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
      activeSection={activeSection}
      activeSubSection={activeSubSectionIndex}
    />
  )
}

export default Stepper
