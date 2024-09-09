import {
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { idInformation } from '../../../lib/messages/idInformation'
import { getChosenApplicant, hasReviewer } from '../../../utils'

export const ConditionInformationSection = buildSubSection({
  id: Routes.CONDITIONINFORMATION,
  title: idInformation.general.conditionSectionTitle,
  condition: (formValue, externalData) => {
    const chosenApplicant = getChosenApplicant(formValue, externalData)
    const applicantHasReviewer = hasReviewer(formValue, externalData)

    return !chosenApplicant.isApplicant && applicantHasReviewer
  },
  children: [
    buildDescriptionField({
      id: `${Routes.CONDITIONINFORMATION}MultiField`,
      title: idInformation.general.conditionSectionTitle,
      description: idInformation.labels.conditionDescription,
      space: 2,
    }),
  ],
})
