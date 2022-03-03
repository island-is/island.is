import { useMemo } from 'react'

import { Application } from '@island.is/application/core'

import { calculateDaysUsedByPeriods } from '../lib/parentalLeaveUtils'

import { useApplicationAnswers } from './useApplicationAnswers'

export const useDaysAlreadyUsed = (application: Application) => {
  const { periods } = useApplicationAnswers(application)

  return useMemo(() => calculateDaysUsedByPeriods(periods), [periods])
}
