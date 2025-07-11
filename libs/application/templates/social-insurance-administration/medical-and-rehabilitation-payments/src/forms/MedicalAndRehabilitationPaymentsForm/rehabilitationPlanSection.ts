import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { isEHApplication } from '../../utils/conditionUtils'

export const rehabilitationPlanSection = buildSection({
  id: 'rehabilitationPlanSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan.sectionTitle,
  condition: (_, externalData) => isEHApplication(externalData),
  children: [
    buildMultiField({
      id: 'rehabilitationPlan',
      title:
        medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
          .sectionTitle,
      description:
        medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
          .description,
      children: [
        buildCustomField({
          id: 'rehabilitationPlanConfirmation',
          component: 'RehabilitationPlan',
        }),
      ],
    }),
  ],
})
