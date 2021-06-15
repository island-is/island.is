import { useCallback, useState } from 'react'

import { Application } from '@island.is/application/core'

import { useLazyParentalLeavePeriodEndDate } from './useLazyParentalLeavePeriodEndDate'
import { calculatePeriodPercentage } from '../lib/parentalLeaveUtils'

export const useGetOrRequestEndDates = (application: Application) => {
  const lazyGetEndDate = useLazyParentalLeavePeriodEndDate()
  const [loadedEndDates, setLoadedEndDates] = useState<
    Map<string, { date: number; percentage: number }>
  >(new Map())

  const getEndDate = useCallback(
    async ({ startDate, length }: { startDate: string; length: number }) => {
      const id = `${startDate}/${length}`

      if (loadedEndDates.has(id)) {
        return loadedEndDates.get(id)!
      }

      /**
       * We need to call twice the API because we are in the chicken/egg situation
       */
      const { data: temporaryData } = await lazyGetEndDate({
        input: {
          startDate,
          length: String(length),
          percentage: '100',
        },
      })

      const temporaryLazyEndDate =
        temporaryData?.getParentalLeavesPeriodEndDate?.periodEndDate

      if (!temporaryLazyEndDate) {
        throw new Error('Cannot calculate temporary end date from VMST.')
      }

      const computedPercentage = calculatePeriodPercentage(application, {
        dates: {
          startDate,
          endDate: new Date(temporaryLazyEndDate).toISOString(),
        },
      })

      const { data } = await lazyGetEndDate({
        input: {
          startDate,
          length: String(length),
          percentage: String(computedPercentage),
        },
      })

      const lazyEndDate = data?.getParentalLeavesPeriodEndDate?.periodEndDate

      if (!lazyEndDate) {
        throw new Error('Cannot calculate end date from VMST.')
      }

      setLoadedEndDates(
        loadedEndDates.set(id, {
          date: lazyEndDate,
          percentage: computedPercentage,
        }),
      )

      return {
        date: lazyEndDate,
        percentage: computedPercentage,
      }
    },
    [],
  )

  return getEndDate
}
