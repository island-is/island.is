import {
  buildMultiField,
  buildSelectField,
  buildTitleField,
} from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'

export const childrenField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_CHILDREN,
  title: m.selfEvaluation.questionFormTitle,
  children: [
    buildTitleField({
      title: m.questions.childrenCountTitle,
      marginBottom: 0,
    }),
    buildSelectField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_CHILDREN}.count`,
      title: m.questions.numberOfChildren,
      marginTop: 0,
      options: [
        {
          value: 'Engin',
          label: m.questions.childrenCountZero,
        },
        {
          value: '1',
          label: m.questions.childrenCountOne,
        },
        {
          value: '2',
          label: m.questions.childrenCountTwo,
        },
        {
          value: '3',
          label: m.questions.childrenCountThree,
        },
        {
          value: '4',
          label: m.questions.childrenCountFour,
        },
        {
          value: '5',
          label: m.questions.childrenCountFive,
        },
        {
          value: '6+',
          label: m.questions.childrenCountSixOrMore,
        },
      ],
    }),
  ],
})
