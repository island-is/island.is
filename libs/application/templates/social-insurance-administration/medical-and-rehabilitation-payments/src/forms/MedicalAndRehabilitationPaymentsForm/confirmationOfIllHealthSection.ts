import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { shouldShowConfirmationOfIllHealth } from '../../utils/conditionUtils'

export const confirmationOfIllHealthSection = buildSection({
  id: 'confirmationOfIllHealthSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.confirmationOfIllHealth
      .sectionTitle,
  condition: (_, externalData) =>
    shouldShowConfirmationOfIllHealth(externalData),
  children: [
    buildMultiField({
      id: 'confirmationOfIllHealth',
      title:
        medicalAndRehabilitationPaymentsFormMessage.confirmationOfIllHealth
          .sectionTitle,
      description:
        medicalAndRehabilitationPaymentsFormMessage.confirmationOfIllHealth
          .description,
      children: [
        buildCustomField({
          id: 'confirmationOfIllHealth',
          component: 'ConfirmationOfIllHealth',
        }),
      ],
    }),
  ],
})
