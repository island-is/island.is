import { useMemo } from 'react'

import { Application } from '@island.is/application/types'
import { getApplicationAnswers } from '../lib/parentalLeaveUtils'

import { calculateDaysUsedByPeriods } from '../lib/parentalLeaveUtils'

export const useDaysAlreadyUsed = (application: Application) => {
  const { periods } = getApplicationAnswers(application.answers)

  return useMemo(() => calculateDaysUsedByPeriods(periods), [periods])
}
