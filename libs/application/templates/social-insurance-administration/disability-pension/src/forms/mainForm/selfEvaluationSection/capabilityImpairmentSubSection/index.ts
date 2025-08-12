import {
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { MOCK_QUESTIONS, } from './mockData'
import { SectionRouteEnum } from '../../../../types'
import { disabilityPensionFormMessage } from '../../../../lib/messages'

const questions = MOCK_QUESTIONS.map((question, index) => {
  return buildMultiField({
    id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers.[${index}]`,
    title: question.label,
    children: [
      //check if works!5
      buildRadioField({
        id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers.[${index}].answer`,
        options: question.options.map((option) => ({
          label: option.title,
          value: option.value,
        })),
        required: true,
      }),
      buildHiddenInput({
        id: `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers.[${index}].id`,
        defaultValue: () => {
          return question.id
        },
      })
    ],
  })
})

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
    ...questions,
  ],
})

console.log(questions)
