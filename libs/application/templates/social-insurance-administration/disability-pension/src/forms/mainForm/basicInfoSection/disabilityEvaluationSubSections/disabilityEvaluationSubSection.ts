import {
  buildAlertMessageField,
  buildMultiField,
  buildRadioField,
  getValueViaPath,
  NO,
  YesOrNo,
} from '@island.is/application/core'
import { SectionRouteEnum } from '../../../../types'
import { yesOrNoOptions } from '../../../../utils'
import * as m from '../../../../lib/messages'

export const disabilityEvaluationFields = buildMultiField({
  id: SectionRouteEnum.DISABILITY_APPLIED_BEFORE,
  title: m.disabilityEvaluation.title,
  description: m.disabilityEvaluation.description,
  space: 'gutter',
  children: [
    buildRadioField({
      id: SectionRouteEnum.DISABILITY_APPLIED_BEFORE,
      title: m.disabilityEvaluation.appliedBeforeTitle,
      required: true,
      width: 'half',
      options: yesOrNoOptions,
    }),
    buildAlertMessageField({
      id: `${SectionRouteEnum.DISABILITY_APPLIED_BEFORE}.alert`,
      message: m.disabilityEvaluation.noInfo,
      alertType: 'warning',
      condition: (formValue) => {
        const answer = getValueViaPath<YesOrNo>(
          formValue,
          SectionRouteEnum.DISABILITY_APPLIED_BEFORE,
        )
        return answer === NO
      },
    }),
  ],
})
