import { useCallback, useState } from 'react'

import { Application } from '@island.is/application/core'

import { calculateDaysToPercentage } from '../lib/parentalLeaveUtils'
import { useLazyParentalLeavePeriodLength } from './useLazyParentalLeavePeriodLength'
import { useDaysAlreadyUsed } from './useDaysAlreadyUsed'

export const useGetOrRequestLength = (application: Application) => {
  const lazyGetLength = useLazyParentalLeavePeriodLength()
  const [loading, setLoading] = useState(false)
  const [loadedLengths, setLoadedLengths] = useState<
    Map<string, { length: number; percentage: number }>
  >(new Map())
  const daysAlreadyUsed = useDaysAlreadyUsed(application)

  /**
   * We call the API multiple times, because we don't know the final value at first, we start with temporary values before able to request with final parameters
   */
  const getLength = useCallback(
    async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
      setLoading(true)

      const id = `${startDate}/${endDate}`

      if (loadedLengths.has(id)) {
        setLoading(false)

        return loadedLengths.get(id)!
      }

      const temporaryPercentage = '100'

      const { data: temporaryLength } = await lazyGetLength({
        input: {
          startDate,
          endDate,
          percentage: temporaryPercentage,
        },
      })

      const startToEndDatesLength =
        temporaryLength?.getParentalLeavesPeriodLength?.periodLength

      if (!startToEndDatesLength) {
        setLoading(false)

        throw new Error(
          `VMST: Cannot calculate length between start and end dates, startDate/${startDate} endDate/${endDate} startToEndDatesLength/${startToEndDatesLength}`,
        )
      }

      const computedPercentage = calculateDaysToPercentage(
        application,
        startToEndDatesLength,
        daysAlreadyUsed,
      )

      const { data: lengthData } = await lazyGetLength({
        input: {
          startDate,
          endDate,
          percentage: String(computedPercentage),
        },
      })

      const lazyLength = lengthData?.getParentalLeavesPeriodLength?.periodLength

      if (!lazyLength) {
        setLoading(false)

        throw new Error(
          `VMST: Cannot calculate length for end date, startDate/${startDate} endDate/${endDate} startToEndDatesLength/${startToEndDatesLength} lazyLength/${lazyLength}`,
        )
      }

      setLoadedLengths(
        loadedLengths.set(id, {
          length: lazyLength,
          percentage: computedPercentage,
        }),
      )

      setLoading(false)

      return {
        length: lazyLength,
        percentage: computedPercentage,
      }
    },
    [],
  )

  return {
    getLength,
    loading,
  }
}
