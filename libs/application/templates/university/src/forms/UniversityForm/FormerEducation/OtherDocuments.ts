import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Routes } from '../../../lib/constants'
import { getChosenProgram } from '../../../utils/getChosenProgram'
import { UniversityAnswers } from '../../..'

export const OtherDocumentsSection = buildSubSection({
  id: Routes.OTHERDOCUMENTS,
  title: information.labels.otherDocumentsSection.sectionTitle,
  condition: (formValue, externalData) => {
    const answers = formValue as UniversityAnswers
    const chosenProgram = getChosenProgram(externalData, answers)
    return (
      !!chosenProgram &&
      chosenProgram.extraApplicationFields &&
      chosenProgram.extraApplicationFields.length > 0
    )
  },
  children: [
    buildMultiField({
      id: `${Routes.OTHERDOCUMENTS}MultiField`,
      title: '',
      children: [
        buildDescriptionField({
          id: 'OtherDocuments.description',
          title: information.labels.otherDocumentsSection.title,
          description: information.labels.otherDocumentsSection.subTitle,
        }),
        buildCustomField({
          id: Routes.OTHERDOCUMENTS,
          component: 'OtherDocuments',
        }),
      ],
    }),
  ],
})
