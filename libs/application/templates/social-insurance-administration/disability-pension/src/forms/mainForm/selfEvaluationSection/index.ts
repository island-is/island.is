import {
    buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { YesOrNoOptions } from '../../../lib/options'
import { backgroundInfoSubSection } from './backgroundSubSection'
import { SectionRouteEnum } from '../../../types'

export const selfEvaluationSection =
  buildSection({
    id: SectionRouteEnum.SELF_EVALUATION,
    title: disabilityPensionFormMessage.selfEvaluation.title,
    children: [
      buildMultiField({
        id: SectionRouteEnum.SELF_EVALUATION,
        title: disabilityPensionFormMessage.selfEvaluation.title,
        description: disabilityPensionFormMessage.selfEvaluation.description,
        children: [
          buildRadioField({
            id: `${SectionRouteEnum.SELF_EVALUATION}.assistance`,
            title: disabilityPensionFormMessage.selfEvaluation.assistance,
            width: 'half',
            backgroundColor: 'blue',
            options: YesOrNoOptions,
          }),
        ]
      }),
      backgroundInfoSubSection,
    ]
  })
