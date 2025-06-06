import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const selfAssessmentQuestionnaireSubSection = buildSubSection({
  id: 'selfAssessmentQuestionnaireSubSection',
  tabTitle:
    medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
  children: [
    buildMultiField({
      id: 'selfAssessmentQuestionnaire',
      title: medicalAndRehabilitationPaymentsFormMessage.selfAssessment.title,
      description:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment.description,
      nextButtonText:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment
          .completeSelfAssessment,
      children: [
        buildCustomField({
          id: 'selfAssessment.questionnaire',
          component: 'SelfAssessmentQuestionnaire',
        }),
      ],
    }),
  ],
})
