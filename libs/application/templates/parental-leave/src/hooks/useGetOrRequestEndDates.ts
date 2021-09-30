import { useCallback, useState } from 'react'

import { Application } from '@island.is/application/core'

import { useLazyParentalLeavePeriodEndDate } from './useLazyParentalLeavePeriodEndDate'
import { useLazyParentalLeavePeriodLength } from './useLazyParentalLeavePeriodLength'
import { useDaysAlreadyUsed } from './useDaysAlreadyUsed'
import { calculateDaysToPercentage } from '../lib/parentalLeaveUtils'

const loadedEndDates = new Map<
  string,
  {
    date: number
    percentage: number
    days: number
  }
>()

export const useGetOrRequestEndDates = (application: Application) => {
  const lazyGetEndDate = useLazyParentalLeavePeriodEndDate()
  const lazyGetLength = useLazyParentalLeavePeriodLength()
  const [loading, setLoading] = useState(false)
  const daysAlreadyUsed = useDaysAlreadyUsed(application)

  /**
   * We call the API multiple times, because we don't know the final value at first, we start with temporary values before able to request with final parameters
   */
  const getEndDate = useCallback(
    async ({ startDate, length }: { startDate: string; length: number }) => {
      setLoading(true)

      const id = `${startDate}/${length}`

      if (loadedEndDates.has(id)) {
        setLoading(false)

        return loadedEndDates.get(id)
      }

      const { data: endDateData } = await lazyGetEndDate({
        input: {
          startDate,
          length: String(length),
          percentage: '100', // Get end date if
        },
      })

      const endDate = endDateData?.getParentalLeavesPeriodEndDate?.periodEndDate

      if (!endDate) {
        setLoading(false)

        throw new Error(
          `VMST: Cannot calculate temporary end date, startDate/${startDate} length/${length} temporaryLazyEndDate/${temporaryLazyEndDate}`,
        )
      }

      const computedPercentage = calculateDaysToPercentage(
        application,
        length,
        daysAlreadyUsed,
      )

      loadedEndDates.set(id, {
        date: endDate,
        percentage: computedPercentage,
        days: length,
      })
      setLoading(false)

      return {
        date: endDate,
        percentage: computedPercentage,
        days: length,
      }
    },
    [application, daysAlreadyUsed, lazyGetEndDate],
  )

  return {
    getEndDate,
    loading,
  }
}
