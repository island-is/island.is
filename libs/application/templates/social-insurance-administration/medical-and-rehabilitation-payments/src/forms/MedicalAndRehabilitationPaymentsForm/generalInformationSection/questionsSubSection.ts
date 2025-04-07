import { buildMultiField, buildSubSection } from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const questionsSubSection = buildSubSection({
  id: 'questionsSubSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.generalInformation
      .questionsSubSectionTitle,
  children: [
    buildMultiField({
      id: 'questions',
      title:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .questionsSubSectionTitle,
      description: 'Lorem ipsum texti.. <vantar>',
      children: [],
    }),
  ],
})
