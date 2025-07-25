import { buildSection } from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { selfAssessmentQuestionnaireSubSection } from './selfAssessmentQuestionnaireSubSection'
import { selfAssessmentQuestionsOneSubSection } from './selfAssessmentQuestionsOneSubSection'
import { selfAssessmentQuestionsThreeSubSection } from './selfAssessmentQuestionsThreeSubSection'
import { selfAssessmentQuestionsTwoSubSection } from './selfAssessmentQuestionsTwoSubSection'

export const selfAssessmentSection = buildSection({
  id: 'selfAssessmentSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
  children: [
    selfAssessmentQuestionsOneSubSection,
    selfAssessmentQuestionsTwoSubSection,
    selfAssessmentQuestionsThreeSubSection,
    selfAssessmentQuestionnaireSubSection,
  ],
})
