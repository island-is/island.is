import { useMemo } from 'react'

import { Application } from '@island.is/application/core'

import { useApplicationAnswers } from './useApplicationAnswers'

export const useDaysAlreadyUsed = (application: Application) => {
  const { periods } = useApplicationAnswers(application)

  return useMemo(
    () =>
      periods.reduce(
        (acc, period) => acc + (period?.days ? Number(period.days) : 0),
        0,
      ),
    [periods],
  )
}
