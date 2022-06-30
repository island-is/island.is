import { useMemo } from 'react'

import { Application } from '@island.is/application/core'

import { useApplicationAnswers } from './useApplicationAnswers'
import { calculateDaysUsedByPeriods } from '../lib/parentalLeaveUtils'

export const useDaysAlreadyUsed = (application: Application) => {
  const { periods } = useApplicationAnswers(application)

  return useMemo(() => calculateDaysUsedByPeriods(periods), [periods])
}
