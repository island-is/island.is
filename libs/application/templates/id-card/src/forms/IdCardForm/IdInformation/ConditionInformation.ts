import {
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { idInformation } from '../../../lib/messages/idInformation'
import { getChosenApplicant, hasReviewer } from '../../../utils'

export const ConditionInformationSection = buildSubSection({
  id: Routes.CONDITIONINFORMATION,
  title: idInformation.general.conditionSectionTitle,
  condition: (formValue, externalData) => {
    const radioAnswerApplicant = getValueViaPath(
      formValue,
      'chosenApplicants',
    ) as string
    const chosenApplicant = getChosenApplicant(
      externalData,
      radioAnswerApplicant,
    )
    const applicantHasReviewer = hasReviewer(formValue, externalData)

    return !chosenApplicant.isApplicant && applicantHasReviewer
  },
  children: [
    buildDescriptionField({
      id: `${Routes.CONDITIONINFORMATION}MultiField`,
      title: idInformation.general.conditionSectionTitle,
      description: (application) => {
        const radioAnswerApplicant = getValueViaPath(
          application.answers,
          'chosenApplicants',
        ) as string
        const chosenChild = getChosenApplicant(
          application.externalData,
          radioAnswerApplicant,
        )
        return {
          id: idInformation.labels.conditionDescription.id,
          values: { parentBName: chosenChild.secondParentName },
        }
      },
      space: 2,
    }),
  ],
})
