import { buildSection } from '@island.is/application/core'
import { selfAssessmentQuestionsOneSubSection } from './selfAssessmentQuestionsOneSubSection'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const selfAssessmentSection = buildSection({
  id: 'selfAssessmentSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
  children: [selfAssessmentQuestionsOneSubSection],
})
