import get from 'lodash/get'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'

import {
  Application,
  DataProviderResult,
  ExternalData,
  FormValue,
  getValueViaPath,
  Option,
} from '@island.is/application/core'
import { theme } from '@island.is/island-ui/theme'
import { FamilyMember } from '@island.is/api/domains/national-registry'

import { parentalLeaveFormMessages } from './lib/messages'

import { TimelinePeriod } from './fields/components/Timeline'
import { Period } from './types'
import {
  ParentalLeave,
  PregnancyStatus,
  ChildInformation,
  ChildrenAndExistingApplications,
} from './dataProviders/APIDataTypes'
import { daysInMonth, defaultMonths } from './config'
import { YES, NO } from './constants'
import { SchemaFormValues } from './lib/dataSchema'

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
  familyMembers?: FamilyMember[],
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
  ) as SchemaFormValues['requestRights']
  const giveRights = getValueViaPath(
    application.answers,
    'giveRights',
  ) as SchemaFormValues['giveRights']

  let requestedDays = 0
  let givenDays = 0
  let days = defaultMonths * daysInMonth
  let months = defaultMonths

  if (requestRights?.isRequestingRights === YES && requestRights.requestDays) {
    requestedDays = requestRights.requestDays
    days = days + requestedDays
    months = months + daysToMonths(requestedDays)
  }

  if (giveRights?.isGivingRights === YES && giveRights.giveDays) {
    givenDays = giveRights.giveDays
    days = days + givenDays
    months = months + daysToMonths(givenDays)
  }

  return {
    requestedDays,
    givenDays,
    days,
    months: Number(months.toFixed(1)), // TODO: do we want to truncate decimals?
  }
}

export const getOtherParentOptions = (application: Application) => {
  const family = get(
    application.externalData,
    'family.data',
    [],
  ) as FamilyMember[]

  const options: Option[] = [
    {
      value: NO,
      label: parentalLeaveFormMessages.shared.noOtherParent,
    },
    {
      value: 'manual',
      label: parentalLeaveFormMessages.shared.otherParentOption,
    },
  ]

  if (family && family.length > 0) {
    const spouse = family.find((member) => member.familyRelation === 'spouse')

    if (spouse) {
      options.unshift({
        value: 'spouse',
        label: {
          ...parentalLeaveFormMessages.shared.otherParentSpouse,
          values: {
            spouseName: spouse.fullName,
            spouseId: spouse.nationalId,
          },
        },
      })
    }
  }

  return options
}

export const getAllPeriodDates = (periods: Period[]) => {
  const filledPeriods = periods.filter((p) => p.startDate && p.endDate)

  const dates = filledPeriods.flatMap((period) =>
    eachDayOfInterval({
      start: new Date(period.startDate),
      end: new Date(period.endDate),
    }),
  )

  return dates.map((d) => new Date(d))
}

export const getSelectedChild = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const selectedChildIndex = get(answers, 'selectedChild') as string
  const selectedChild = get(
    externalData,
    `children.data.children[${selectedChildIndex}]`,
    null,
  ) as ChildInformation | null

  return selectedChild
}

export const isEligibleForParentalLeave = (
  externalData: ExternalData,
): boolean => {
  const { children, existingApplications } = get(
    externalData,
    'children.data',
    {
      children: [],
      existingApplications: [],
    },
  ) as ChildrenAndExistingApplications

  return children.length > 0 || existingApplications.length > 0
}
