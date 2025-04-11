import {
  buildCheckboxField,
  buildMultiField,
  buildSection,
  YES,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { comprehensiveAssessment } from './comprehensiveAssessment'
import { information } from './information'
import { rehabilitationObjective } from './rehabilitationObjective'
import { serviceProvider } from './serviceProvider'

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
        ...serviceProvider,
        ...information,
        ...comprehensiveAssessment,
        ...rehabilitationObjective,
        buildCheckboxField({
          id: 'rehabilitationPlanConfirmation',
          options: [
            {
              value: YES,
              label:
                medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                  .confirm,
            },
          ],
        }),
      ],
    }),
  ],
})
