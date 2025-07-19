import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { shouldShowRehabilitationPlan } from '../../utils/conditionUtils'

export const rehabilitationPlanSection = buildSection({
  id: 'rehabilitationPlanSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan.sectionTitle,
  condition: (_, externalData) => shouldShowRehabilitationPlan(externalData),
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
          id: 'rehabilitationPlan',
          component: 'RehabilitationPlan',
        }),
      ],
    }),
  ],
})
