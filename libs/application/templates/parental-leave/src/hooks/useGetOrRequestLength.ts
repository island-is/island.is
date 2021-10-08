import { useCallback, useState } from 'react'
import parseISO from 'date-fns/parseISO'

import { Application } from '@island.is/application/core'
import { getAvailableRightsInDays } from '../lib/parentalLeaveUtils'
import { useDaysAlreadyUsed } from './useDaysAlreadyUsed'
import {
  calculatePeriodLength,
  calculateMaxPercentageForPeriod,
} from '../lib/directorateOfLabour.utils'

const loadedLengths = new Map<string, { length: number; percentage: number }>()

export const useGetOrRequestLength = (application: Application) => {
  const [loading, setLoading] = useState(false)
  const rights = getAvailableRightsInDays(application)
  const daysAlreadyUsed = useDaysAlreadyUsed(application)
  const remainingRights = rights - daysAlreadyUsed

  const getLength = useCallback(
    async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
      const id = `${startDate}/${endDate}`

      if (loadedLengths.has(id)) {
        setLoading(false)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return loadedLengths.get(id)!
      }

      const start = parseISO(startDate)
      const end = parseISO(endDate)

      const maxPercentage = calculateMaxPercentageForPeriod(
        start,
        end,
        remainingRights,
      )
      const length = calculatePeriodLength(start, end, maxPercentage)

      const result = {
        percentage: maxPercentage * 100,
        length,
      }

      loadedLengths.set(id, result)

      return result
    },
    [remainingRights],
  )

  return {
    getLength,
    loading,
  }
}
