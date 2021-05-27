import eachDayOfInterval from 'date-fns/eachDayOfInterval'

import {
  Application,
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
import { YES, NO, MANUAL } from './constants'
import { SchemaFormValues } from './lib/dataSchema'
import { PregnancyStatusAndRightsResults } from './dataProviders/Children/Children'
import { daysToMonths } from './lib/directorateOfLabour.utils'
import {
  ChildInformation,
  ChildrenAndExistingApplications,
} from './dataProviders/Children/types'

export function getExpectedDateOfBirth(
  application: Application,
): string | undefined {
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  if (selectedChild !== null) {
    return selectedChild.expectedDateOfBirth
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

export const getTransferredDays = (
  application: Application,
  selectedChild: ChildInformation,
) => {
  const requestRights = getValueViaPath(
    application.answers,
    'requestRights',
  ) as SchemaFormValues['requestRights']
  const giveRights = getValueViaPath(
    application.answers,
    'giveRights',
  ) as SchemaFormValues['giveRights']

  let days = 0

  if (requestRights?.isRequestingRights === YES && requestRights.requestDays) {
    const requestedDays = requestRights.requestDays

    days = requestedDays
  }

  if (
    selectedChild.hasRights &&
    giveRights?.isGivingRights === YES &&
    giveRights.giveDays
  ) {
    const givenDays = giveRights.giveDays

    days = -givenDays
  }

  return days
}

/**
 * Returns the number of months available for the applicant.
 */
export const getAvailableRightsInMonths = (application: Application) => {
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  if (!selectedChild) {
    throw new Error('Missing selected child')
  }

  return daysToMonths(
    selectedChild.remainingDays +
      getTransferredDays(application, selectedChild),
  )
}

export const getOtherParentOptions = (application: Application) => {
  const family = getValueViaPath(
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
      value: MANUAL,
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

export const getEndPeriodsDate = (periods: Period[]) => {
  const filledPeriods = periods.filter((p) => p.startDate && p.endDate)

  return filledPeriods.reduce((acc, cur) => {
    const date = new Date(cur.endDate)

    if (date > acc) {
      acc = date
    }

    return acc
  }, new Date(0, 0, 0))
}

export const getStartDateOfLatestPeriod = (periods: Period[]) => {
  const latestPeriod = periods[periods.length - 1]

  return latestPeriod.startDate
}

export const createRange = <T>(
  length: number,
  output: (index: number) => T,
): T[] => {
  return Array(length)
    .fill(1)
    .map((_, i) => output(i))
}

export const getSelectedChild = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const selectedChildIndex = getValueViaPath(answers, 'selectedChild') as string
  const selectedChild = getValueViaPath(
    externalData,
    `children.data.children[${selectedChildIndex}]`,
    null,
  ) as ChildInformation | null

  return selectedChild
}

export const isEligibleForParentalLeave = (
  externalData: ExternalData,
): boolean => {
  const dataProvider = getValueViaPath(
    externalData,
    'children.data',
  ) as PregnancyStatusAndRightsResults

  const children = getValueViaPath(
    externalData,
    'children.data.children',
    [],
  ) as ChildrenAndExistingApplications['children']

  const existingApplications = getValueViaPath(
    externalData,
    'children.data.existingApplications',
    [],
  ) as ChildrenAndExistingApplications['existingApplications']

  return (
    dataProvider?.hasActivePregnancy &&
    (children.length > 0 || existingApplications.length > 0) &&
    dataProvider?.remainingDays > 0
  )
}
