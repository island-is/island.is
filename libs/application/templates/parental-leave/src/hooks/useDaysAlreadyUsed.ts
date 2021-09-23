import { useMemo } from 'react'

import { Application } from '@island.is/application/core'

import { useApplicationAnswers } from './useApplicationAnswers'

export const useDaysAlreadyUsed = (application: Application) => {
  const { periods } = useApplicationAnswers(application)

  return useMemo(
    () =>
      Math.round(
        periods.reduce((total, period) => {
          const days = period?.days ? Number(period.days) : 0
          const ratio = (period?.ratio ? Number(period.ratio) : 100) / 100

          return total + days * ratio
        }, 0),
      ),
    [periods],
  )
}
