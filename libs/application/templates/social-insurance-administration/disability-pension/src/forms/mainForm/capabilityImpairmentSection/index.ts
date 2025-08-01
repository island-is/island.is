import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'
import { MOCK_QUESTIONS, OptionsValueEnum } from './mockData'

const questions = MOCK_QUESTIONS.map(question => {
  return buildMultiField({
    id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers`,
    title: question.label,
    children: [
      //check if works!
      buildRadioField({
        id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers`,
        title: disabilityPensionFormMessage.questions.employmentImportanceTitle,
        options: question.options.map(option => ({
          label: option.title,
          value: option.value,
        })),
        setOnChange: (optionValue, application) => {
          console.log(optionValue)
          console.log(application)

          const questions = getValueViaPath<Array<{ id: string, title: string, answer: OptionsValueEnum }>>(
            application.answers,
            `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers`,
            [],
          )

          const matchingQuestion = questions?.find(q => q.id === question.id)
          if (matchingQuestion) {
            return Promise.resolve([{
              key: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers.[${matchingQuestion.id}].answer`,
              value: optionValue as OptionsValueEnum,
            }])
          }
          else {
            return Promise.resolve([{
              key: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers`,
              value: [
                ...questions ?? [],
                {
                  id: question.id,
                  title: question.label,
                  answer: optionValue as OptionsValueEnum,
                }
              ]
            }])
          }
        }
      })
    ]
  })
})

export const capabilityImpairmentSection =
  buildSection({
    id: SectionRouteEnum.CAPABILITY_IMPAIRMENT,
    tabTitle: disabilityPensionFormMessage.capabilityImpairment.tabTitle,
    children: [
      buildDescriptionField({
        id: SectionRouteEnum.CAPABILITY_IMPAIRMENT,
        title: disabilityPensionFormMessage.capabilityImpairment.title,
        description: disabilityPensionFormMessage.capabilityImpairment.description,
      }),
      ...questions,
    ]
  })
