import {
  buildMultiField,
  buildSubSection,
  buildRadioField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { idInformation } from '../../../lib/messages/idInformation'

export const ChosenApplicantsSubSection = buildSubSection({
  id: Routes.CHOSENAPPLICANTS,
  title: idInformation.general.chosenApplicantsSectionTitle,
  children: [
    buildMultiField({
      id: `${Routes.CHOSENAPPLICANTS}MultiField`,
      title: idInformation.general.chosenApplicantsSectionTitle,
      description: idInformation.labels.chosenApplicantsDescription,
      children: [
        buildRadioField({
          id: `${Routes.CHOSENAPPLICANTS}.applicant`,
          title: '',
          options: (application) => [
            {
              label: 'application.externalData.nationalRegistry.data.fullName',
              value: 'yes',
            },
          ],
        }),
      ],
    }),
  ],
})
