import { useCallback, useState } from 'react'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import parseISO from 'date-fns/parseISO'

import { Application } from '@island.is/application/core'

import { getAvailableRightsInDays } from '../lib/parentalLeaveUtils'
import {
  calculateMaxPercentageForPeriod,
  calculatePeriodLength,
} from '../lib/directorateOfLabour.utils'
import { useDaysAlreadyUsed } from './useDaysAlreadyUsed'

const loadedEndDates = new Map<
  string,
  {
    date: Date
    percentage: number
    days: number
  }
>()

export const useGetOrRequestEndDates = (application: Application) => {
  const [loading, setLoading] = useState(false)
  const rights = getAvailableRightsInDays(application)
  const daysAlreadyUsed = useDaysAlreadyUsed(application)
  const remainingRights = rights - daysAlreadyUsed

  /**
   * We call the API multiple times, because we don't know the final value at first, we start with temporary values before able to request with final parameters
   */
  const getEndDate = useCallback(
    async ({
      startDate,
      lengthInMonths,
    }: {
      startDate: string
      lengthInMonths: number
    }) => {
      const id = `${startDate}/${lengthInMonths}`

      if (loadedEndDates.has(id)) {
        setLoading(false)

        return loadedEndDates.get(id)
      }

      const start = parseISO(startDate)

      const wholeMonthsToAdd = Math.floor(lengthInMonths)
      const daysToAdd =
        (Math.round((lengthInMonths - wholeMonthsToAdd) * 100) / 100) * 30

      const end = addDays(addMonths(start, wholeMonthsToAdd), daysToAdd - 1)

      const maxPercentage = calculateMaxPercentageForPeriod(
        start,
        end,
        remainingRights,
      )
      const length = calculatePeriodLength(start, end, maxPercentage)

      const result = {
        date: end,
        percentage: maxPercentage * 100,
        days: length,
      }

      loadedEndDates.set(id, result)
      return result
    },
    [remainingRights],
  )

  return {
    getEndDate,
    loading,
  }
}
