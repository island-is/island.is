import {
  buildAlertMessageField,
  buildDescriptionField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
  NO,
  YesOrNo,
} from '@island.is/application/core'
import { SectionRouteEnum } from '../../../types/routes'
import { yesOrNoOptions } from '../../../utils'
import * as m from '../../../lib/messages'

export const disabilityEvaluationSubSection = buildSubSection({
  id: SectionRouteEnum.DISABILITY_APPLIED_BEFORE,
  title: m.disabilityEvaluation.title,
  tabTitle: m.disabilityEvaluation.tabTitle,
  children: [
    buildDescriptionField({
      id: `${SectionRouteEnum.DISABILITY_APPLIED_BEFORE}.description`,
      title: m.disabilityEvaluation.description,
    }),
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
