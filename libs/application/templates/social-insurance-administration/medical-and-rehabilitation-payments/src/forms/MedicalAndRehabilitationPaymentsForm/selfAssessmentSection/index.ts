import { buildSection } from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { selfAssessmentQuestionnaireSubSection } from './selfAssessmentQuestionnaireSubSection'
import { selfAssessmentQuestionsThreeSubSection } from './selfAssessmentQuestionsThreeSubSection'

export const selfAssessmentSection = buildSection({
  id: 'selfAssessmentSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
  children: [
    selfAssessmentQuestionsThreeSubSection,
    selfAssessmentQuestionnaireSubSection,
  ],
})
