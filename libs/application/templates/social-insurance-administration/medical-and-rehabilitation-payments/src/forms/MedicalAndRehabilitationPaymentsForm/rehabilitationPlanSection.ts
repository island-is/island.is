import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'

export const rehabilitationPlanSection = buildSection({
  id: 'rehabilitationPlanSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan.sectionTitle,
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
