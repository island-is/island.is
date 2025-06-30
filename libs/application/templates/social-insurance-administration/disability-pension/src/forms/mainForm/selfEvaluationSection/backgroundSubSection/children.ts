import {
  buildSelectField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { backgroundRoute } from './index'
import { ChildrenCountEnum } from '../../../../lib/constants'

export const childrenField =
  buildSelectField({
    id: `${backgroundRoute}.children`,
    title: disabilityPensionFormMessage.questions.childrenCountTitle,
    options: [
      {
        value: ChildrenCountEnum.one,
        label: disabilityPensionFormMessage.questions.childrenCountOne,
      },
      {
        value: ChildrenCountEnum.two,
        label: disabilityPensionFormMessage.questions.childrenCountTwo,
      },
      {
        value: ChildrenCountEnum.three,
        label: disabilityPensionFormMessage.questions.childrenCountThree,
      },
      {
        value: ChildrenCountEnum.four,
        label: disabilityPensionFormMessage.questions.childrenCountFour,
      },
      {
        value: ChildrenCountEnum.five,
        label: disabilityPensionFormMessage.questions.childrenCountFive,
      },
      {
        value: ChildrenCountEnum.sixOrMore,
        label: disabilityPensionFormMessage.questions.childrenCountSixOrMore,
      },
    ]
  })
