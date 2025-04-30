import { buildSection } from '@island.is/application/core'
import { selfAssessmentQuestions1SubSection } from './selfAssessmentQuestions1SubSection'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const selfAssessmentSection = buildSection({
  id: 'selfAssessmentSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
  children: [selfAssessmentQuestions1SubSection],
})
