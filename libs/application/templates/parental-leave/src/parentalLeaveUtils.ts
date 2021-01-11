import {
  Application,
  DataProviderResult,
  getValueViaPath,
} from '@island.is/application/core'
import { theme } from '@island.is/island-ui/theme'
import { NationalRegistryFamilyMember } from '@island.is/api/schema'

import { TimelinePeriod } from './fields/components/Timeline'
import { Period } from './types'
import { ParentalLeave, PregnancyStatus } from './dataProviders/APIDataTypes'
import { daysInMonth, defaultMonths } from './config'
import { YES } from './constants'

export function getExpectedDateOfBirth(
  application: Application,
): string | undefined {
  const pregnancyStatusResult = application.externalData
    .pregnancyStatus as DataProviderResult

  if (pregnancyStatusResult.status === 'success') {
    const pregnancyStatus = pregnancyStatusResult.data as PregnancyStatus
    if (pregnancyStatus.pregnancyDueDate)
      return pregnancyStatus.pregnancyDueDate
  }
  // applicant is not a mother giving birth
  const parentalLeavesResult = application.externalData
    .parentalLeaves as DataProviderResult
  if (parentalLeavesResult.status === 'success') {
    const parentalLeaves = parentalLeavesResult.data as ParentalLeave[]
    if (parentalLeaves.length) {
      if (parentalLeaves.length === 1) {
        return parentalLeaves[0].expectedDateOfBirth
      }
      // here we have multiple parental leaves... must store the selected application id or something
    }
  }

  return undefined
}

export function getNameAndIdOfSpouse(
  familyMembers?: NationalRegistryFamilyMember[],
): [string?, string?] {
  const spouse = familyMembers?.find(
    (member) => member.familyRelation === 'spouse',
  )
  if (!spouse) {
    return [undefined, undefined]
  }
  return [spouse.fullName, spouse.nationalId]
}

export function getEstimatedMonthlyPay(application: Application): number {
  // TODO read this value from external data when APIs have arrived
  return 384000
}

export function formatPeriods(
  periods?: Period[],
  otherParentPeriods?: Period[],
): TimelinePeriod[] {
  const timelinePeriods: TimelinePeriod[] = []
  periods?.forEach((period, index) => {
    if (period.startDate && period.endDate) {
      timelinePeriods.push({
        startDate: period.startDate,
        endDate: period.endDate,
        canDelete: true,
        title: `Period ${index + 1} - ${period.ratio ?? 100}%`,
      })
    }
  })
  otherParentPeriods?.forEach((period) => {
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
 *  returns a formatted ISK value "119.000 kr."
 */
export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

/**
 * Uses `daysInMonth`: 30 as the number of days in a month on average
 */
const daysToMonths = (n: number) => n / daysInMonth

/**
 * Returns the maximum number of months available for the applicant.
 * Returns as well the days given or requested by the applicant.
 */
export const getAvailableRights = (application: Application) => {
  const requestRights = getValueViaPath(
    application.answers,
    'requestRights',
  ) as any
  const giveRights = getValueViaPath(application.answers, 'giveRights') as any

  let requestedDays = 0
  let givenDays = 0
  let months = defaultMonths

  if (requestRights?.isRequestingRights === YES) {
    requestedDays = requestRights.requestDays
    months = months + daysToMonths(requestedDays)
  }

  if (giveRights?.isGivingRights === YES) {
    givenDays = giveRights.giveDays
    months = months + daysToMonths(givenDays)
  }

  return {
    requestedDays,
    givenDays,
    months: Number(months.toFixed(1)), // TODO: do we want to truncate decimals?
  }
}
