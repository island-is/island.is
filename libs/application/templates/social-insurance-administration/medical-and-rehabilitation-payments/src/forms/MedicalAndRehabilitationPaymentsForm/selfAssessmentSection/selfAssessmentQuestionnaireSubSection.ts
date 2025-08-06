import {
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import {
  getApplicationExternalData,
  getSelfAssessmentQuestionnaireQuestions,
} from '../../../utils/medicalAndRehabilitationPaymentsUtils'

export const selfAssessmentQuestionnaireSubSection = (index: number) =>
  buildSubSection({
    id: 'selfAssessmentQuestionnaireSubSection',
    tabTitle:
      medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
    children: [
      buildMultiField({
        id: `selfAssessment.questionnaire[${index}]`,
        title: (application, locale) => {
          const selfAssessmentQuestionnaireQuestions =
            getSelfAssessmentQuestionnaireQuestions(
              application.externalData,
              locale,
            )

          return {
            ...medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .questionnaire,
            values: {
              index: index + 1,
              total: selfAssessmentQuestionnaireQuestions.length,
            },
          }
        },
        nextButtonText: (application) => {
          const selfAssessmentQuestionnaireQuestions =
            getSelfAssessmentQuestionnaireQuestions(application.externalData)

          if (index === selfAssessmentQuestionnaireQuestions.length - 1) {
            return medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .completeSelfAssessment
          }
        },
        children: [
          buildDescriptionField({
            id: `selfAssessment.questionnaire[${index}].description`,
            title: (application, locale) => {
              const selfAssessmentQuestionnaireQuestions =
                getSelfAssessmentQuestionnaireQuestions(
                  application.externalData,
                  locale,
                )

              return selfAssessmentQuestionnaireQuestions[index].explanationText
            },
            titleVariant: 'h4',
          }),
          buildRadioField({
            id: `selfAssessment.questionnaire[${index}].answer`,
            title: (application, locale) => {
              const selfAssessmentQuestionnaireQuestions =
                getSelfAssessmentQuestionnaireQuestions(
                  application.externalData,
                  locale,
                )

              return selfAssessmentQuestionnaireQuestions[index].question
            },
            options: (application, _, locale) => {
              const { selfAssessmentQuestionnaire } =
                getApplicationExternalData(application.externalData)

              const selfAssessmentQuestionnaireScale =
                selfAssessmentQuestionnaire.find(
                  (questionnaire) =>
                    questionnaire.language.toLowerCase() === locale,
                )?.scale

              return (
                selfAssessmentQuestionnaireScale?.map(({ value, display }) => ({
                  value: value.toString(),
                  label: display,
                })) ?? []
              )
            },
            required: true,
          }),
          buildHiddenInput({
            id: `selfAssessment.questionnaire[${index}].questionId`,
            defaultValue: (application: Application) => {
              const selfAssessmentQuestionnaireQuestions =
                getSelfAssessmentQuestionnaireQuestions(
                  application.externalData,
                )

              return selfAssessmentQuestionnaireQuestions[index].questionCode
            },
          }),
        ],
      }),
    ],
    condition: (_, externalData) => {
      const selfAssessmentQuestionnaireQuestions =
        getSelfAssessmentQuestionnaireQuestions(externalData)

      return index < selfAssessmentQuestionnaireQuestions.length
    },
  })
