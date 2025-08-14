import {
  buildMultiField,
  buildSelectField,
  buildTitleField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { ChildrenCountEnum, SectionRouteEnum } from '../../../../types'

export const childrenField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_CHILDREN,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  children: [
    buildTitleField({
      title: disabilityPensionFormMessage.questions.childrenCountTitle,
      marginBottom: 0,
    }),
    buildSelectField({
      id: SectionRouteEnum.BACKGROUND_INFO_CHILDREN,
      title: disabilityPensionFormMessage.questions.numberOfChildren,
      marginTop: 0,
      options: [
        {
          value: ChildrenCountEnum.ZERO,
          label: disabilityPensionFormMessage.questions.childrenCountZero,
        },
        {
          value: ChildrenCountEnum.ONE,
          label: disabilityPensionFormMessage.questions.childrenCountOne,
        },
        {
          value: ChildrenCountEnum.TWO,
          label: disabilityPensionFormMessage.questions.childrenCountTwo,
        },
        {
          value: ChildrenCountEnum.THREE,
          label: disabilityPensionFormMessage.questions.childrenCountThree,
        },
        {
          value: ChildrenCountEnum.FOUR,
          label: disabilityPensionFormMessage.questions.childrenCountFour,
        },
        {
          value: ChildrenCountEnum.FIVE,
          label: disabilityPensionFormMessage.questions.childrenCountFive,
        },
        {
          value: ChildrenCountEnum.SIX_OR_MORE,
          label: disabilityPensionFormMessage.questions.childrenCountSixOrMore,
        },
      ],
    }),
  ],
})
