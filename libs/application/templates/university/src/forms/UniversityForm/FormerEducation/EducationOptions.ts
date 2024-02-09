import { buildCustomField, buildSubSection } from '@island.is/application/core'
import { formerEducation } from '../../../lib/messages/formerEducation'
import { Routes } from '../../../lib/constants'

export const EducationOptionsSubSection = buildSubSection({
  id: Routes.EDUCATIONOPTIONS,
  title: formerEducation.labels.educationOptions.pageTitle,
  children: [
    buildCustomField({
      id: `${Routes.EDUCATIONOPTIONS}`,
      title: formerEducation.labels.educationOptions.pageTitle,
      component: 'EducationOptions',
    }),
  ],
})
