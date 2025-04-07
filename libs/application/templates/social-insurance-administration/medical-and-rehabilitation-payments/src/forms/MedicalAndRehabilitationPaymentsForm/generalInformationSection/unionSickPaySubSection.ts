import { buildMultiField, buildSubSection } from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const unionSickPaySubSection = buildSubSection({
  id: 'unionSickPaySubSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.generalInformation
      .unionSickPaySubSectionTitle,
  children: [
    buildMultiField({
      id: 'unionSickPay',
      title:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .unionSickPayTitle,
      description: 'Lorem ipsum texti.. <vantar>',
      children: [],
    }),
  ],
})
