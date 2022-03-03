import { getValueViaPath } from '@island.is/application/core'

import { WorkAccidentTypeEnum } from '../types'
import { AccidentNotificationAnswers } from '..'

export const isOfWorkAccidentType = (
  answers: Partial<AccidentNotificationAnswers>,
  type: WorkAccidentTypeEnum,
) => {
  const workAccidentType = getValueViaPath(
    answers,
    'workAccident.type',
  ) as WorkAccidentTypeEnum
  return workAccidentType === type
}
