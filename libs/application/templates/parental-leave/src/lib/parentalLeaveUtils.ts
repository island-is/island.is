import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import differenceInMonths from 'date-fns/differenceInMonths'
import parseISO from 'date-fns/parseISO'

import {
  Application,
  ExternalData,
  extractRepeaterIndexFromField,
  Field,
  FormatMessage,
  FormValue,
  getValueViaPath,
  Option,
} from '@island.is/application/core'
import { FamilyMember } from '@island.is/api/domains/national-registry'

import { parentalLeaveFormMessages } from '../lib/messages'
import { TimelinePeriod } from '../fields/components/Timeline'
import { Period } from '../types'
import { YES, NO, MANUAL, SPOUSE, StartDateOptions } from '../constants'
import { SchemaFormValues } from '../lib/dataSchema'
import { PregnancyStatusAndRightsResults } from '../dataProviders/Children/Children'
import { daysToMonths } from '../lib/directorateOfLabour.utils'
import {
  ChildInformation,
  ChildrenAndExistingApplications,
} from '../dataProviders/Children/types'
import { Boolean } from '../types'

export function getExpectedDateOfBirth(application: Application): string {
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  if (!selectedChild) {
    throw new Error('Missing selected child')
  }

  return selectedChild.expectedDateOfBirth
}

export function getNameAndIdOfSpouse(
  familyMembers?: FamilyMember[],
): [string?, string?] {
  const spouse = familyMembers?.find(
    (member) => member.familyRelation === SPOUSE,
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

// TODO: Once we have the data, add the otherParentPeriods here.
export function formatPeriods(
  application: Application,
  formatMessage: FormatMessage,
): TimelinePeriod[] {
  const periods = application.answers.periods as Period[]
  const timelinePeriods: TimelinePeriod[] = []

  periods?.forEach((period, index) => {
    const isActualDob =
      index === 0 &&
      application.answers.firstPeriodStart ===
        StartDateOptions.ACTUAL_DATE_OF_BIRTH

    if (isActualDob) {
      const expectedDateOfBirth = getExpectedDateOfBirth(application)

      timelinePeriods.push({
        actualDob: isActualDob,
        startDate: period.startDate,
        endDate: period.endDate,
        ratio: period.ratio,
        duration: expectedDateOfBirth
          ? differenceInMonths(
              parseISO(period.endDate),
              parseISO(expectedDateOfBirth),
            )
          : 0,
        canDelete: true,
        title: formatMessage(parentalLeaveFormMessages.reviewScreen.period, {
          index: index + 1,
          ratio: period.ratio,
        }),
      })
    }

    if (!isActualDob && period.startDate && period.endDate) {
      timelinePeriods.push({
        actualDob: isActualDob,
        startDate: period.startDate,
        endDate: period.endDate,
        ratio: period.ratio,
        duration: differenceInMonths(
          parseISO(period.endDate),
          parseISO(period.startDate),
        ),
        canDelete: true,
        title: formatMessage(parentalLeaveFormMessages.reviewScreen.period, {
          index: index + 1,
          ratio: period.ratio,
        }),
      })
    }
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

export const getSpouse = (application: Application): FamilyMember | null => {
  const family = getValueViaPath(
    application.externalData,
    'family.data',
    [],
  ) as FamilyMember[]

  if (!family) {
    return null
  }

  const spouse = family.find((member) => member.familyRelation === SPOUSE)

  return spouse ?? null
}

export const getOtherParentOptions = (application: Application) => {
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

  const spouse = getSpouse(application)

  if (spouse) {
    options.unshift({
      value: SPOUSE,
      label: {
        ...parentalLeaveFormMessages.shared.otherParentSpouse,
        values: {
          spouseName: spouse.fullName,
          spouseId: spouse.nationalId,
        },
      },
    })
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
): ChildInformation | null => {
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

export const calculatePeriodPercentage = (
  application: Application,
  field: Field,
  dates?: { startDate: string; endDate: string },
) => {
  const months = getAvailableRightsInMonths(application)
  const expectedDateOfBirth = getExpectedDateOfBirth(application)
  const repeaterIndex = extractRepeaterIndexFromField(field)
  const index = repeaterIndex === -1 ? 0 : repeaterIndex
  const { answers } = application

  const startDate = getValueViaPath(
    answers,
    `periods[${index}].startDate`,
    expectedDateOfBirth,
  ) as string

  const endDate = getValueViaPath(
    answers,
    `periods[${index}].endDate`,
  ) as string

  const difference = differenceInMonths(
    parseISO(dates?.endDate ?? endDate),
    parseISO(dates?.startDate ?? startDate),
  )

  if (difference <= months) {
    return 100
  }

  return Math.min(100, Math.round((months / difference) * 100))
}

export function getApplicationAnswers(answers: Application['answers']) {
  const otherParent = getValueViaPath(
    answers,
    'otherParent',
  ) as SchemaFormValues['otherParent']

  const pensionFund = getValueViaPath(answers, 'payments.pensionFund') as string

  const union = getValueViaPath(answers, 'payments.union') as string

  const usePrivatePensionFund = getValueViaPath(
    answers,
    'usePrivatePensionFund',
  ) as Boolean

  const privatePensionFund = getValueViaPath(
    answers,
    'payments.privatePensionFund',
  ) as string

  const privatePensionFundPercentage = getValueViaPath(
    answers,
    'payments.privatePensionFundPercentage',
  ) as string

  const isSelfEmployed = getValueViaPath(
    answers,
    'employer.isSelfEmployed',
  ) as Boolean

  const otherParentName = getValueViaPath(answers, 'otherParentName') as string

  const otherParentId = getValueViaPath(answers, 'otherParentId') as string

  const bank = getValueViaPath(answers, 'payments.bank') as string

  const personalAllowance = getValueViaPath(
    answers,
    'usePersonalAllowance',
  ) as Boolean

  const personalAllowanceFromSpouse = getValueViaPath(
    answers,
    'usePersonalAllowanceFromSpouse',
    NO,
  ) as Boolean

  const personalUseAsMuchAsPossible = getValueViaPath(
    answers,
    'personalAllowance.useAsMuchAsPossible',
  ) as Boolean

  const personalUsage = getValueViaPath(
    answers,
    'personalAllowance.usage',
  ) as string

  const spouseUseAsMuchAsPossible = getValueViaPath(
    answers,
    'personalAllowanceFromSpouse.useAsMuchAsPossible',
  ) as Boolean

  const spouseUsage = getValueViaPath(
    answers,
    'personalAllowanceFromSpouse.usage',
  ) as string

  const employerEmail = getValueViaPath(answers, 'employer.email') as string

  const shareInformationWithOtherParent = getValueViaPath(
    answers,
    'shareInformationWithOtherParent',
  ) as Boolean

  const selectedChild = getValueViaPath(answers, 'selectedChild') as string

  const isRequestingRights = getValueViaPath(
    answers,
    'requestRights.isRequestingRights',
  ) as Boolean

  const requestDays = getValueViaPath(
    answers,
    'requestRights.requestDays',
  ) as number

  const isGivingRights = getValueViaPath(
    answers,
    'giveRights.isGivingRights',
  ) as Boolean

  const giveDays = getValueViaPath(answers, 'giveRights.giveDays') as number

  const usePersonalAllowanceFromSpouse = getValueViaPath(
    answers,
    'usePersonalAllowanceFromSpouse',
  ) as Boolean

  return {
    otherParent,
    pensionFund,
    union,
    usePrivatePensionFund,
    privatePensionFund,
    privatePensionFundPercentage,
    isSelfEmployed,
    otherParentName,
    otherParentId,
    bank,
    personalAllowance,
    personalAllowanceFromSpouse,
    personalUseAsMuchAsPossible,
    personalUsage,
    usePersonalAllowanceFromSpouse,
    spouseUseAsMuchAsPossible,
    spouseUsage,
    employerEmail,
    shareInformationWithOtherParent,
    selectedChild,
    isRequestingRights,
    requestDays,
    isGivingRights,
    giveDays,
  }
}

export const requiresOtherParentApproval = (
  answers: Application['answers'],
) => {
  const applicationAnswers = getApplicationAnswers(answers)

  const {
    isRequestingRights,
    usePersonalAllowanceFromSpouse,
  } = applicationAnswers

  return isRequestingRights === YES || usePersonalAllowanceFromSpouse === YES
}
