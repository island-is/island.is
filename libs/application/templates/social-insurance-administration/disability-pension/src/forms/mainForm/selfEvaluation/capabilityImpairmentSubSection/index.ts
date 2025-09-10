import {
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { SectionRouteEnum } from '../../../../types'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SelfAssessmentQuestionnaire } from '../../../../types/interfaces'
import { Application } from '@island.is/application/types'
import { getQuestionnaire } from '../../../../utils/getQuestionnaire'

export const MAX_QUESTIONS = 50

const buildQuestion = (index: number) => {
  return buildMultiField({
    id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers.[${index}]`,
    title: disabilityPensionFormMessage.capabilityImpairment.title,
    children: [
      //check if works!
      buildRadioField({
        id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers.[${index}].answer`,
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

          console.log(questions)
          console.log(index)

          return questions[index].questionTitle
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
        id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers.[${index}].id`,
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

          return questions[index].questionCode
        },
      }),
    ],
    condition: (_, externalData) => {
      const questions = getQuestionnaire(externalData)
      return index < questions.length
    },
  })
}

export const capabilityImpairmentSubSection = buildSubSection({
  id: SectionRouteEnum.CAPABILITY_IMPAIRMENT,
  title: disabilityPensionFormMessage.capabilityImpairment.tabTitle,
  tabTitle: disabilityPensionFormMessage.capabilityImpairment.tabTitle,
  children: [
    buildDescriptionField({
      id: SectionRouteEnum.CAPABILITY_IMPAIRMENT,
      title: disabilityPensionFormMessage.capabilityImpairment.title,
      description:
        disabilityPensionFormMessage.capabilityImpairment.description,
    }),
    //TODO: validate and collect correct questions
    ...[...Array(MAX_QUESTIONS)].map((_key, index) => buildQuestion(index)),
  ],
})
