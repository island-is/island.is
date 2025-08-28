import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { shouldShowConfirmedTreatment } from '../../utils/conditionUtils'

export const confirmedTreatmentSection = buildSection({
  id: 'confirmedTreatmentSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.confirmedTreatment.sectionTitle,
  condition: (_, externalData) => shouldShowConfirmedTreatment(externalData),
  children: [
    buildMultiField({
      id: 'confirmedTreatment',
      title:
        medicalAndRehabilitationPaymentsFormMessage.confirmedTreatment
          .sectionTitle,
      description:
        medicalAndRehabilitationPaymentsFormMessage.confirmedTreatment
          .description,
      children: [
        buildCustomField({
          id: 'confirmedTreatment',
          component: 'ConfirmedTreatment',
        }),
      ],
    }),
  ],
})
