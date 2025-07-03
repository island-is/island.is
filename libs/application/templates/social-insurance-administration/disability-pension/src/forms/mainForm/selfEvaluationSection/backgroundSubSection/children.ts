import {
    buildMultiField,
  buildSelectField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { ChildrenCountEnum, SectionRouteEnum } from '../../../../types'

export const childrenField =
  buildMultiField({
    id: SectionRouteEnum.BACKGROUND_INFO_CHILDREN,
    title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
    description: disabilityPensionFormMessage.selfEvaluation.questionFormDescription,
    children: [
      buildSelectField({
        id: SectionRouteEnum.BACKGROUND_INFO_CHILDREN,
        title: disabilityPensionFormMessage.questions.childrenCountTitle,
        options: [
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
        ]
      })
    ]
  })
