import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { shouldShowCertificateForSicknessAndRehabilitation } from '../../utils/conditionUtils'

export const certificateForSicknessAndRehabilitationSection = buildSection({
  id: 'certificateForSicknessAndRehabilitationSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage
      .certificateForSicknessAndRehabilitation.sectionTitle,
  condition: (_, externalData) =>
    shouldShowCertificateForSicknessAndRehabilitation(externalData),
  children: [
    buildMultiField({
      id: 'certificateForSicknessAndRehabilitation',
      title:
        medicalAndRehabilitationPaymentsFormMessage
          .certificateForSicknessAndRehabilitation.sectionTitle,
      description:
        medicalAndRehabilitationPaymentsFormMessage
          .certificateForSicknessAndRehabilitation.description,
      children: [
        buildCustomField({
          id: 'certificateForSicknessAndRehabilitation',
          component: 'CertificateForSicknessAndRehabilitation',
        }),
      ],
    }),
  ],
})
