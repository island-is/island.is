import { Application } from '@island.is/application/types'
import {
  calculateDaysUsedByPeriods,
  getApplicationAnswers,
  getAvailableRightsInDays,
} from '../parentalLeaveUtils'
import { errorMessages } from '../messages'
import { getShortPeriodWithoutPredecessorError } from './utils'

export const validatePeriodsValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  // const periods = newAnswer as Period[]
  const { periods } = getApplicationAnswers(application.answers)

  if (periods.length === 0) {
    return {
      path: 'periods',
      message: errorMessages.periodsEmpty,
    }
  }

  const daysUsedByPeriods = calculateDaysUsedByPeriods(periods)
  const rights = getAvailableRightsInDays(application)

  if (daysUsedByPeriods > rights) {
    return {
      path: 'periods',
      message: errorMessages.periodsExceedRights,
      values: {
        daysUsedByPeriods,
        rights,
      },
    }
  }

  const shortPeriodError = getShortPeriodWithoutPredecessorError(periods)

  if (shortPeriodError) {
    const { values, ...message } = shortPeriodError
    return { path: 'periods', message, values }
  }

  return undefined
}
