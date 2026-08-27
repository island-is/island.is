import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { questionnaire } from '../../lib/messages'

export const questionnaireSection = buildSection({
  id: 'questionnaireSection',
  title: questionnaire.sectionStepTitle,
  condition: (_, externalData) => {
    const showQuestions =
      getValueViaPath<boolean>(
        externalData,
        'jobSearchEligibility.data.isQuestionaireEligible',
      ) || false
    return showQuestions
  },
  children: [
    buildMultiField({
      id: 'questionnaireMultiField',
      title: questionnaire.sectionTitle,
      children: [
        buildAlertMessageField({
          id: 'alertField',
          alertType: 'info',
          title: questionnaire.alertInfoTitle,
          message: questionnaire.alertInfoMessage,
        }),
        buildCustomField({
          id: 'questionnaire',
          component: 'Questionnaire',
        }),
      ],
    }),
  ],
})
