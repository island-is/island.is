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

      const temporaryPercentage = '100'

      const { data: temporaryEndDateData } = await lazyGetEndDate({
        input: {
          startDate,
          length: String(length),
          percentage: temporaryPercentage,
        },
      })

      const temporaryLazyEndDate =
        temporaryEndDateData?.getParentalLeavesPeriodEndDate?.periodEndDate

      if (!temporaryLazyEndDate) {
        setLoading(false)

        throw new Error(
          `VMST: Cannot calculate temporary end date, startDate/${startDate} length/${length} temporaryLazyEndDate/${temporaryLazyEndDate}`,
        )
      }

      const { data: lengthData } = await lazyGetLength({
        input: {
          startDate,
          endDate: new Date(temporaryLazyEndDate).toISOString(),
          percentage: temporaryPercentage,
        },
      })

      const startToEndDatesLength =
        lengthData?.getParentalLeavesPeriodLength.periodLength

      if (!startToEndDatesLength) {
        setLoading(false)

        throw new Error(
          `VMST: Cannot calculate length between startDate and calculated endDate, startDate/${startDate} length/${length} temporaryLazyEndDate/${temporaryLazyEndDate} startToEndDatesLength/${startToEndDatesLength}`,
        )
      }

      const computedPercentage = calculateDaysToPercentage(
        application,
        startToEndDatesLength,
        daysAlreadyUsed,
      )

      const computedLength = Math.min(
        100,
        Math.floor((length * computedPercentage) / 100),
      )

      const { data } = await lazyGetEndDate({
        input: {
          startDate,
          length: String(computedLength),
          percentage: String(computedPercentage),
        },
      })

      const lazyEndDate = data?.getParentalLeavesPeriodEndDate?.periodEndDate

      if (!lazyEndDate) {
        setLoading(false)

        throw new Error(
          `VMST: Cannot calculate end date, startDate/${startDate} length/${length} temporaryLazyEndDate/${temporaryLazyEndDate} startToEndDatesLength/${startToEndDatesLength} computedPercentage/${computedPercentage} lazyEndDate/${lazyEndDate}`,
        )
      }

      loadedEndDates.set(id, {
        date: lazyEndDate,
        percentage: computedPercentage,
        days: startToEndDatesLength,
      })
      setLoading(false)

      return {
        date: lazyEndDate,
        percentage: computedPercentage,
        days: startToEndDatesLength,
      }
    },
    [application, daysAlreadyUsed, lazyGetEndDate, lazyGetLength],
  )

  return {
    getEndDate,
    loading,
  }
}
