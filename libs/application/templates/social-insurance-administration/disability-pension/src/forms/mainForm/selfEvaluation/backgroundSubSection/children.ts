import {
  buildMultiField,
  buildSelectField,
  buildTitleField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'

export const childrenField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_CHILDREN,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  children: [
    buildTitleField({
      title: disabilityPensionFormMessage.questions.childrenCountTitle,
      marginBottom: 0,
    }),
    buildSelectField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_CHILDREN}.count`,
      title: disabilityPensionFormMessage.questions.numberOfChildren,
      marginTop: 0,
      options: [
        {
          value: "Engin",
          label: disabilityPensionFormMessage.questions.childrenCountZero,
        },
        {
          value: "1",
          label: disabilityPensionFormMessage.questions.childrenCountOne,
        },
        {
          value: "2",
          label: disabilityPensionFormMessage.questions.childrenCountTwo,
        },
        {
          value: "3",
          label: disabilityPensionFormMessage.questions.childrenCountThree,
        },
        {
          value: "4",
          label: disabilityPensionFormMessage.questions.childrenCountFour,
        },
        {
          value: "5",
          label: disabilityPensionFormMessage.questions.childrenCountFive,
        },
        {
          value: "6+",
          label: disabilityPensionFormMessage.questions.childrenCountSixOrMore,
        },
      ],
    }),
  ],
})
