import { buildMultiField, buildSubSection } from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const sickPaySubSection = buildSubSection({
  id: 'sickPaySubSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.generalInformation
      .sickPaySubSectionTitle,
  children: [
    buildMultiField({
      id: 'sickPay',
      title:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .sickPayTitle,
      description: 'Lorem ipsum texti.. <vantar>',
      children: [],
    }),
  ],
})
