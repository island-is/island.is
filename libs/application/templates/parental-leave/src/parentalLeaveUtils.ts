import {
  Application,
  ExternalData,
  FormValue,
  getValueViaPath,
  Option,
} from '@island.is/application/core'
import { theme } from '@island.is/island-ui/theme'
import { FamilyMember } from '@island.is/api/domains/national-registry'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import {
  ParentalLeave,
  PregnancyStatus,
} from '@island.is/api/domains/directorate-of-labour'

import { parentalLeaveFormMessages } from './lib/messages'
import { TimelinePeriod } from './fields/components/Timeline'
import { Period } from './types'
import { YES, NO } from './constants'
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
  const pregnancyStatusAndRights =
    application.externalData.pregnancyStatusAndRights

  if (pregnancyStatusAndRights.status === 'success') {
    const pregnancyStatus = (pregnancyStatusAndRights.data as {
      pregnancyStatus: PregnancyStatus
    }).pregnancyStatus

    if (pregnancyStatus.expectedDateOfBirth) {
      return pregnancyStatus.expectedDateOfBirth
    }

    const parentalLeaves = (pregnancyStatusAndRights.data as {
      parentalLeaves: ParentalLeave[]
    }).parentalLeaves

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
 * Returns the number of months available for the applicant.
 */
export const getAvailableRightsInMonths = (application: Application) => {
  const children = getValueViaPath(
    application.externalData,
    'children',
  ) as PregnancyStatusAndRightsResults
  const requestRights = getValueViaPath(
    application.answers,
    'requestRights',
  ) as SchemaFormValues['requestRights']
  const giveRights = getValueViaPath(
    application.answers,
    'giveRights',
  ) as SchemaFormValues['giveRights']

  let days = children.remainingDays

  if (requestRights?.isRequestingRights === YES && requestRights.requestDays) {
    const requestedDays = requestRights.requestDays

    days = days + requestedDays
  }

  if (
    children.hasRights &&
    giveRights?.isGivingRights === YES &&
    giveRights.giveDays
  ) {
    const givenDays = giveRights.giveDays

    days = days - givenDays
  }

  return daysToMonths(days)
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
    'childrenAndExistingApplications.children',
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
