import { buildSection } from '@island.is/application/core'
import { SubSection } from '@island.is/application/types'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { selfAssessmentQuestionnaireSubSection } from './selfAssessmentQuestionnaireSubSection'
import { selfAssessmentQuestionsOneSubSection } from './selfAssessmentQuestionsOneSubSection'
import { selfAssessmentQuestionsThreeSubSection } from './selfAssessmentQuestionsThreeSubSection'
import { selfAssessmentQuestionsTwoSubSection } from './selfAssessmentQuestionsTwoSubSection'

export const MAX_QUESTIONS = 50

const buildRepeatableQuestionnaireSubSections = (): SubSection[] => {
  const sections = [...Array(MAX_QUESTIONS)].map((_key, index) => {
    return selfAssessmentQuestionnaireSubSection(index)
  })
  return sections.flat()
}

export const selfAssessmentSection = buildSection({
  id: 'selfAssessmentSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
  children: [
    selfAssessmentQuestionsOneSubSection,
    selfAssessmentQuestionsTwoSubSection,
    selfAssessmentQuestionsThreeSubSection,
    ...buildRepeatableQuestionnaireSubSections(),
  ],
})
