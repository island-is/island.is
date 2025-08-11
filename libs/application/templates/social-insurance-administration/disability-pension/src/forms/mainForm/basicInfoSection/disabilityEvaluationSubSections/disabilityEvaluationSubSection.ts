import {
  buildAlertMessageField,
  buildMultiField,
  buildRadioField,
  getValueViaPath,
  NO,
  YesOrNo,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { yesOrNoOptions } from '../../../../utils'

export const disabilityEvaluationFields = buildMultiField({
  id: SectionRouteEnum.DISABILITY_APPLIED_BEFORE,
  title: disabilityPensionFormMessage.disabilityEvaluation.title,
  description: disabilityPensionFormMessage.disabilityEvaluation.description,
  space: 'gutter',
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.DISABILITY_APPLIED_BEFORE}.appliedBefore`,
      title:
        disabilityPensionFormMessage.disabilityEvaluation.appliedBeforeTitle,
      required: true,
      width: 'half',
      options: yesOrNoOptions,
    }),
    buildAlertMessageField({
      id: `${SectionRouteEnum.DISABILITY_APPLIED_BEFORE}.alert`,
      message: disabilityPensionFormMessage.disabilityEvaluation.noInfo,
      alertType: 'warning',
      condition: (formValue) => {
        const answer = getValueViaPath<YesOrNo>(
          formValue,
          `${SectionRouteEnum.DISABILITY_APPLIED_BEFORE}.appliedBefore`,
        )
        return answer === NO
      },
    }),
  ],
})
