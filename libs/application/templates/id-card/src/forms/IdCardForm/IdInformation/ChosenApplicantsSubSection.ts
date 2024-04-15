import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { idInformation } from '../../../lib/messages/idInformation'

export const ChosenApplicantsSubSection = buildSubSection({
  id: Routes.CHOSENAPPLICANTS,
  title: idInformation.general.chosenApplicantsSectionTitle,
  children: [
    buildMultiField({
      id: Routes.CHOSENAPPLICANTS,
      title: 'todo',
      children: [
        buildDescriptionField({
          id: `${Routes.CHOSENAPPLICANTS}.title`,
          title: 'todo',
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
