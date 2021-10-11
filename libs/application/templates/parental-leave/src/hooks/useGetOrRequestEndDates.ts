import { useCallback } from 'react'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import parseISO from 'date-fns/parseISO'

import { Application } from '@island.is/application/core'

import {
  calculateMaxPercentageForPeriod,
  calculatePeriodLength,
} from '../lib/directorateOfLabour.utils'
import { useRemainingRights } from './useRemainingRights'

const loadedEndDates = new Map<
  string,
  {
    date: Date
    percentage: number
    days: number
  }
>()

export const useGetOrRequestEndDates = (application: Application) => {
  const remainingRights = useRemainingRights(application)

  const getEndDate = useCallback(
    ({
      startDate,
      lengthInMonths,
    }: {
      startDate: string
      lengthInMonths: number
    }) => {
      const id = `${startDate}/${lengthInMonths}`

      if (loadedEndDates.has(id)) {
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

      if (maxPercentage === null) {
        throw new Error(
          `Cannot calculate max percentage for period ${start} to ${end} with remaining rights = ${remainingRights}`,
        )
      }

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
  }
}
