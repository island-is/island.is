import {
    buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { YesOrNoOptions } from '../../../lib/options'
import { backgroundInfoSubSection } from './backgroundSubSection'

export const selfEvaluationRoute = 'selfEvaluation'

export const selfEvaluationSection =
  buildSection({
    id: selfEvaluationRoute,
    title: disabilityPensionFormMessage.selfEvaluation.title,
    children: [
      buildMultiField({
        id: selfEvaluationRoute,
        title: disabilityPensionFormMessage.selfEvaluation.title,
        description: disabilityPensionFormMessage.selfEvaluation.description,
        children: [
          buildRadioField({
            id: `${selfEvaluationRoute}.assistance`,
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
