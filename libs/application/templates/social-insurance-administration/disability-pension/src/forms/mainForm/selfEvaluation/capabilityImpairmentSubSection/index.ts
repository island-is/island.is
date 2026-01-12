import {
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'
import { MAX_QUESTIONNAIRE_QUESTIONS } from '../../../../types/constants'
import { Application } from '@island.is/application/types'
import { getQuestionnaire } from '../../../../utils/getQuestionnaire'
import { getApplicationExternalData } from '../../../../utils'

const buildQuestion = (index: number) => {
  return buildMultiField({
    id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers[${index}]`,
    title: (application, locale) => {
      const { questionnaire } = getApplicationExternalData(
        application.externalData,
      )

      const questions =
        questionnaire?.find((q) => q.language.toLowerCase() === locale)
          ?.questions ?? []

      return {
        ...m.capabilityImpairment.questionnaire,
        values: {
          index: index + 1,
          total: questions.length,
        },
      }
    },
    nextButtonText: (application) => {
      const { questionnaire } = getApplicationExternalData(
        application.externalData,
      )

      const questions =
        questionnaire?.find((q) => q.language.toLowerCase() === 'is')
          ?.questions ?? []

      if (index === questions.length - 1) {
        return m.capabilityImpairment.completeSelfAssessment
      }
    },
    children: [
      buildDescriptionField({
        id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers[${index}].description`,
        title: (application, locale) => {
          const { questionnaire } = getApplicationExternalData(
            application.externalData,
          )

          const questions =
            questionnaire?.find((q) => q.language.toLowerCase() === locale)
              ?.questions ?? []

          return questions[index]?.explanationText
        },
        titleVariant: 'h4',
      }),
      buildRadioField({
        id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers[${index}].answer`,
        marginTop: 0,
        title: (application, locale) => {
          const { questionnaire } = getApplicationExternalData(
            application.externalData,
          )

          const questions =
            questionnaire?.find((q) => q.language.toLowerCase() === locale)
              ?.questions ?? []

          return questions[index]?.question
        },
        options: (application, _, locale) => {
          const { questionnaire } = getApplicationExternalData(
            application.externalData,
          )

          const scale =
            questionnaire?.find((q) => q.language.toLowerCase() === locale)
              ?.scale ?? []

          return (
            scale?.map(({ value, display }) => ({
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
          const { questionnaire } = getApplicationExternalData(
            application.externalData,
          )

          const questions =
            questionnaire?.find((q) => q.language.toLowerCase() === 'is')
              ?.questions ?? []

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
  title: m.capabilityImpairment.title,
  children: [
    buildDescriptionField({
      id: SectionRouteEnum.CAPABILITY_IMPAIRMENT,
      title: m.capabilityImpairment.title,
      description: m.capabilityImpairment.description,
    }),
    ...[...Array(MAX_QUESTIONNAIRE_QUESTIONS)].map((_key, index) =>
      buildQuestion(index),
    ),
  ],
})
