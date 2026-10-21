import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { shouldShowConfirmationOfJobSearch } from '../../utils/conditionUtils'

export const confirmationOfJobSearchSection = buildSection({
  id: 'confirmationOfJobSearchSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.confirmationOfJobSearch
      .sectionTitle,
  condition: (_, externalData) =>
    shouldShowConfirmationOfJobSearch(externalData),
  children: [
    buildMultiField({
      id: 'confirmationOfJobSearch',
      title:
        medicalAndRehabilitationPaymentsFormMessage.confirmationOfJobSearch
          .sectionTitle,
      description:
        medicalAndRehabilitationPaymentsFormMessage.confirmationOfJobSearch
          .description,
      children: [
        buildCustomField({
          id: 'confirmationOfJobSearch',
          component: 'ConfirmationOfJobSearch',
        }),
      ],
    }),
  ],
})
