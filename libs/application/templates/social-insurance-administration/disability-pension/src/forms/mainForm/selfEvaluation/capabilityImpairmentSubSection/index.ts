import {
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'
import { MAX_QUESTIONNAIRE_QUESTIONS } from '../../../../types/constants'
import { SelfAssessmentQuestionnaire } from '../../../../types/interfaces'
import { Application } from '@island.is/application/types'
import { getQuestionnaire } from '../../../../utils/getQuestionnaire'

const buildQuestion = (index: number) => {
  return buildMultiField({
    id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers[${index}]`,
    title: m.capabilityImpairment.title,
    children: [
      buildDescriptionField({
        id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers[${index}].description`,
        title: (application, locale) => {
          const selfAssessmentQuestionnaire =
            getValueViaPath<Array<SelfAssessmentQuestionnaire>>(
              application.externalData,
              'socialInsuranceAdministrationDisabilityPensionSelfAssessmentQuestions.data',
            ) ?? []

          const questions =
            selfAssessmentQuestionnaire.find(
              (questionnaire) =>
                questionnaire.language.toLowerCase() === locale,
            )?.questions ?? []

          return questions[index]?.explanationText
        },
        titleVariant: 'h4',
      }),
      buildRadioField({
        id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers[${index}].answer`,
        marginTop: 0,
        title: (application, locale) => {
          const selfAssessmentQuestionnaire =
            getValueViaPath<Array<SelfAssessmentQuestionnaire>>(
              application.externalData,
              'socialInsuranceAdministrationDisabilityPensionSelfAssessmentQuestions.data',
            ) ?? []

          const questions =
            selfAssessmentQuestionnaire.find(
              (questionnaire) =>
                questionnaire.language.toLowerCase() === locale,
            )?.questions ?? []

          return questions[index]?.question
        },
        options: (application, _, locale) => {
          const selfAssessmentQuestionnaire =
            getValueViaPath<Array<SelfAssessmentQuestionnaire>>(
              application.externalData,
              'socialInsuranceAdministrationDisabilityPensionSelfAssessmentQuestions.data',
            ) ?? []

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
        id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers[${index}].id`,
        defaultValue: (application: Application) => {
          const selfAssessmentQuestionnaire =
            getValueViaPath<Array<SelfAssessmentQuestionnaire>>(
              application.externalData,
              'socialInsuranceAdministrationDisabilityPensionSelfAssessmentQuestions.data',
            ) ?? []

          const questions =
            selfAssessmentQuestionnaire.find(
              (questionnaire) => questionnaire.language.toLowerCase() === 'is',
            )?.questions ?? []

          return questions[index]?.questionCode
        },
      }),
    ],
    condition: (_, externalData) => {
      const questions = getQuestionnaire(externalData)
      return index < questions.length && index < MAX_QUESTIONNAIRE_QUESTIONS
    },
  })
}

export const capabilityImpairmentSubSection = buildSubSection({
  id: SectionRouteEnum.CAPABILITY_IMPAIRMENT,
  title: m.capabilityImpairment.tabTitle,
  tabTitle: m.capabilityImpairment.tabTitle,
  children: [
    buildDescriptionField({
      id: SectionRouteEnum.CAPABILITY_IMPAIRMENT,
      title: m.capabilityImpairment.title,
      description: m.capabilityImpairment.description,
    }),
    ...[...Array(MAX_QUESTIONNAIRE_QUESTIONS)].map((_key, index) => buildQuestion(index)),
  ],
})
