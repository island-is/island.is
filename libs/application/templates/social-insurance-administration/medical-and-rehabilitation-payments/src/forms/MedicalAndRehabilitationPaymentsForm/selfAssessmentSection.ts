import { buildMultiField, buildSection } from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'

export const selfAssessmentSection = buildSection({
  id: 'selfAssessmentSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
  children: [
    buildMultiField({
      id: 'selfAssessment',
      title:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
      description: 'Lorem ipsum texti.. <vantar>',
      children: [],
    }),
  ],
})
