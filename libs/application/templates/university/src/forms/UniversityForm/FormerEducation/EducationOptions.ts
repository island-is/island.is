import {
  buildCheckboxField,
  buildSubSection,
} from '@island.is/application/core'
import { formerEducation } from '../../../lib/messages/formerEducation'
import { Routes } from '../../../lib/constants'

export const EducationOptionsSubSection = buildSubSection({
  id: Routes.EDUCATIONOPTIONS,
  title: formerEducation.labels.educationDetails.pageTitle,
  children: [
    buildCheckboxField({
      id: `${Routes.EDUCATIONOPTIONS}.chosenOption`,
      title: 'TODO',
      options: [
        {
          label: formerEducation.labels.educationOptions.diplomaFinishedLabel,
          subLabel:
            formerEducation.labels.educationOptions.diplomaFinishedDescription,
          value: 'diploma',
        },
        {
          label:
            formerEducation.labels.educationOptions.diplomaNotFinishedLabel,
          subLabel:
            formerEducation.labels.educationOptions
              .diplomaNotFinishedDescription,
          value: 'notFinished',
        },
        {
          label: formerEducation.labels.educationOptions.exemptionLabel,
          subLabel:
            formerEducation.labels.educationOptions.exemptionDescription,
          value: 'exemption',
        },
        {
          label: formerEducation.labels.educationOptions.thirdLevelLabel,
          subLabel:
            formerEducation.labels.educationOptions.thirdLevelDescription,
          value: 'thirdLevel',
        },
      ],
    }),
  ],
})
