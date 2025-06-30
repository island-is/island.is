import {
    buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { YesOrNoOptions } from '../../../lib/utils'

export const backgroundRoute = 'background'

export const  backgroundSubSection =
  buildSubSection({
    id: backgroundRoute,
    title: disabilityPensionFormMessage.selfEvaluation.title,
    children: [
      buildMultiField({
        id: backgroundRoute,
        title: disabilityPensionFormMessage.selfEvaluation.title,
        description: disabilityPensionFormMessage.selfEvaluation.description,
        children: [
          buildRadioField({
            id: `${backgroundRoute}.assistance`,
            title: disabilityPensionFormMessage.selfEvaluation.assistance,
            width: 'half',
            backgroundColor: 'blue',
            options: YesOrNoOptions,
          }),
        ]
      })
    ]
  })
