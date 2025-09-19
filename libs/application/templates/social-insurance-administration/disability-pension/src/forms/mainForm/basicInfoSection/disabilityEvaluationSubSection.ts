import {
  buildAlertMessageField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  NO,
} from '@island.is/application/core'
import { SectionRouteEnum } from '../../../types/routes'
import { getApplicationAnswers, yesOrNoOptions } from '../../../utils'
import * as m from '../../../lib/messages'

export const disabilityEvaluationSubSection = buildSubSection({
  id: SectionRouteEnum.DISABILITY_APPLIED_BEFORE,
  title: m.disabilityEvaluation.tabTitle,
  children: [
    buildMultiField({
      title: m.disabilityEvaluation.title,
      description: m.disabilityEvaluation.description,
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
            const { hasAppliedForDisabilityBefore } =
              getApplicationAnswers(formValue)
            return hasAppliedForDisabilityBefore === NO
          },
        }),
      ],
    }),
  ],
})
