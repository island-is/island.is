import {
  buildAlertMessageField,
  buildDescriptionField,
  buildImageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { HandShake } from '@island.is/application/assets/graphics'
import { applicantSubmitMessages as asm } from '../../../lib/messages/applicantSubmitMessages'

export const infoSection = buildSection({
  id: 'applicantSubmitInfoSection',
  tabTitle: asm.infoSectionTitle,
  children: [
    buildMultiField({
      id: 'applicantSubmitInfoMultiField',
      title: asm.infoTitle,
      children: [
        buildAlertMessageField({
          id: 'applicantSubmitInfoAlert',
          title: asm.infoAlertTitle,
          message: asm.infoAlertMessage,
          alertType: 'success',
          marginBottom: 4,
        }),
        buildDescriptionField({
          id: 'applicantSubmitInfoDescription',
          description: asm.infoDescription,
          marginBottom: 8,
        }),
        buildImageField({
          id: 'applicantSubmitInfoImage',
          image: HandShake,
          marginBottom: 4,
        }),
      ],
    }),
  ],
})
