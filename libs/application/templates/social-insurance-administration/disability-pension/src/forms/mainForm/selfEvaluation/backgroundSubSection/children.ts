import {
  buildMultiField,
  buildSelectField,
  buildTitleField,
} from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'
import { generateChildrenOptions } from '../../../../utils/options'

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
      options: generateChildrenOptions(m),
    }),
  ],
})
