import React from 'react'

import { FormStepper } from './FormStepper'
import { FormStepperThemes } from './types'

export default {
  title: 'Navigation/FormStepper',
  component: FormStepper,
}

export const Default = () => {
  const sections = [
    { name: 'Section name #1' },
    {
      name: 'Section name #2',
      children: [
        { type: 'SUB_SECTION', name: 'SubSection #1' },
        { type: 'SUB_SECTION', name: 'SubSection #2' },
        { type: 'SUB_SECTION', name: 'SubSection #3' },
      ],
    },
    { name: 'Section name #3' },
    { name: 'Section name #4' },
    { name: 'Section name #5' },
  ]

  return (
    <FormStepper
      theme={FormStepperThemes.PURPLE}
      formName="Parental Leave"
      sections={sections}
      activeSection={1}
      activeSubSection={1}
    />
  )
}
