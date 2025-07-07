import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'

export const certificateForSicknessAndRehabilitationSection = buildSection({
  id: 'certificateForSicknessAndRehabilitationSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage
      .certificateForSicknessAndRehabilitation.sectionTitle,
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
          id: 'certificateForSicknessAndRehabilitationReferenceId',
          component: 'CertificateForSicknessAndRehabilitation',
        }),
      ],
    }),
  ],
})
