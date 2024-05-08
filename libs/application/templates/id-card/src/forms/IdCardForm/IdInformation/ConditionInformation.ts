import {
  buildSubSection,
  getValueViaPath,
  buildMultiField,
  buildDescriptionField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { idInformation } from '../../../lib/messages/idInformation'

export const ConditionInformationSection = buildSubSection({
  id: Routes.CONDITIONINFORMATION,
  title: idInformation.general.conditionSectionTitle,
  condition: (formvalue, externalData) => {
    const chosenApplicantNationalId = getValueViaPath(
      formvalue,
      Routes.CHOSENAPPLICANTS,
      '',
    ) as string

    const applicantNationalId = getValueViaPath(
      externalData,
      'nationalRegistry.data.nationalId',
      '',
    ) as string
    return chosenApplicantNationalId !== applicantNationalId
  },
  children: [
    buildDescriptionField({
      id: `${Routes.CONDITIONINFORMATION}MultiField`,
      title: idInformation.general.conditionSectionTitle,
      description: idInformation.labels.conditionDescription,
    }),
  ],
})
