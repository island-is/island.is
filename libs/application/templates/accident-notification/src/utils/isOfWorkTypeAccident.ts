import { getValueViaPath } from '@island.is/application/core'
import { AccidentNotificationAnswers } from '..'
import { WorkAccidentTypeEnum } from '../types'

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
