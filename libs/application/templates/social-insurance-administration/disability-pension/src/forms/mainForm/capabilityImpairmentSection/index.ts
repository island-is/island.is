import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'
import { MOCK_QUESTIONS, OptionsValueEnum } from './mockData'

const questions = MOCK_QUESTIONS.map((question, index) => {
  return buildMultiField({
    id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers-${index}`,
    title: question.label,
    children: [
      //check if works!
      buildRadioField({
        id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers-${index}-radio`,
        options: question.options.map((option) => ({
          label: option.title,
          value: option.value,
        })),
        setOnChange: (optionValue, application) => {
          console.log(optionValue)
          console.log(application)

          const questions = getValueViaPath<
            Array<{ id: string; title: string; answer: OptionsValueEnum }>
          >(
            application.answers,
            `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers`,
            [],
          )

          const matchingQuestion = questions?.find((q) => q.id === question.id)
          if (matchingQuestion) {
            return Promise.resolve([
              {
                key: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers.[${matchingQuestion.id}].answer`,
                value: optionValue as OptionsValueEnum,
              },
            ])
          } else {
            return Promise.resolve([
              {
                key: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers`,
                value: [
                  ...(questions ?? []),
                  {
                    id: question.id,
                    title: question.label,
                    answer: optionValue as OptionsValueEnum,
                  },
                ],
              },
            ])
          }
        },
      }),
    ],
  })
})

export const capabilityImpairmentSection = buildSubSection({
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
    ...questions,
  ],
})
