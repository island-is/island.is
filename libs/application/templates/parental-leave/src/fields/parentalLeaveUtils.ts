import { Application, DataProviderResult } from '@island.is/application/core'
import { theme } from '@island.is/island-ui/theme'

import { TimelinePeriod } from './components/Timeline'
import { Period } from '../types'

export function getExpectedDateOfBirth(application: Application): string {
  const dataProviderResult = application.externalData
    .expectedDateOfBirth as DataProviderResult
  return dataProviderResult.data as string
}

export function getNameAndIdOfSpouse(
  application: Application,
): [string?, string?] {
  const dataProviderResult = application.externalData
    .spouse as DataProviderResult
  if (!dataProviderResult || dataProviderResult.status === 'failure') {
    // TODO read the correct spouse value
    return ['Jón Jónsson', '123456-7890']
  }
  return [undefined, undefined]
}

export function getEstimatedMonthlyPay(application: Application): number {
  // TODO read this value from external data when APIs have arrived
  return 384000
}

export function formatPeriods(
  periods: Period[],
  otherParentPeriods: Period[],
): TimelinePeriod[] {
  const timelinePeriods: TimelinePeriod[] = []
  periods.forEach((period, index) => {
    if (period.startDate && period.endDate) {
      timelinePeriods.push({
        startDate: period.startDate,
        endDate: period.endDate,
        canDelete: true,
        title: `Period ${index + 1} - ${period.ratio ?? 100}%`,
      })
    }
  })
  otherParentPeriods.forEach((period) => {
    timelinePeriods.push({
      startDate: period.startDate,
      endDate: period.endDate,
      canDelete: false,
      color: theme.color.red200,
      title: `Other parent ${period.ratio ?? 100}%`,
    })
  })
  return timelinePeriods
}

/*
 *  Takes in a number (ex: 119000) and
 *  returns a formated ISK value "119.000 kr."
 */
export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'
