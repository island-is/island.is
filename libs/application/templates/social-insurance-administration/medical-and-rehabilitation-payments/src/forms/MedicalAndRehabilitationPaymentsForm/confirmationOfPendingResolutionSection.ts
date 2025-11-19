import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { shouldShowConfirmationOfPendingResolution } from '../../utils/conditionUtils'

export const confirmationOfPendingResolutionSection = buildSection({
  id: 'confirmationOfPendingResolutionSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.confirmationOfPendingResolution
      .sectionTitle,
  condition: (_, externalData) =>
    shouldShowConfirmationOfPendingResolution(externalData),
  children: [
    buildMultiField({
      id: 'confirmationOfPendingResolution',
      title:
        medicalAndRehabilitationPaymentsFormMessage
          .confirmationOfPendingResolution.sectionTitle,
      description:
        medicalAndRehabilitationPaymentsFormMessage
          .confirmationOfPendingResolution.description,
      children: [
        buildCustomField({
          id: 'confirmationOfPendingResolution',
          component: 'ConfirmationOfPendingResolution',
        }),
      ],
    }),
  ],
})
