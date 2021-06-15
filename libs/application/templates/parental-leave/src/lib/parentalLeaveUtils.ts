import eachDayOfInterval from 'date-fns/eachDayOfInterval'
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
import {
  YES,
  NO,
  MANUAL,
  SPOUSE,
  StartDateOptions,
  ParentalRelations,
  MILLISECONDS_IN_A_DAY,
} from '../constants'
import { SchemaFormValues } from '../lib/dataSchema'
import { PregnancyStatusAndRightsResults } from '../dataProviders/Children/Children'
import { daysToMonths } from '../lib/directorateOfLabour.utils'
import {
  ChildInformation,
  ChildrenAndExistingApplications,
} from '../dataProviders/Children/types'
import { Boolean, Period } from '../types'
import { maxDaysToGiveOrReceive, daysInMonth } from '../config'

export function getExpectedDateOfBirth(
  application: Application,
): string | undefined {
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  if (!selectedChild) {
    return undefined
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
  const { periods } = getApplicationAnswers(application.answers)
  const timelinePeriods: TimelinePeriod[] = []

  periods?.forEach((period, index) => {
    const isActualDob =
      index === 0 &&
      application.answers.firstPeriodStart ===
        StartDateOptions.ACTUAL_DATE_OF_BIRTH

    if (isActualDob) {
      timelinePeriods.push({
        actualDob: isActualDob,
        startDate: period.startDate,
        endDate: period.endDate,
        ratio: period.ratio,
        duration: period.duration,
        canDelete: true,
        title: formatMessage(parentalLeaveFormMessages.reviewScreen.period, {
          index: index + 1,
          ratio: period.ratio,
        }),
      })
    }

    if (!isActualDob && period.startDate && period.endDate) {
      timelinePeriods.push({
        startDate: period.startDate,
        endDate: period.endDate,
        ratio: period.ratio,
        duration: period.duration,
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
  // Primary parent decides if rights are transferred or not
  // If the current parent is a secondary parent then the value
  // will be stored in external data
  if (selectedChild.parentalRelation === ParentalRelations.secondary) {
    return selectedChild.transferredDays ?? 0
  }

  // This is a primary parent, let's have a look at the answers
  const {
    isRequestingRights,
    requestDays,
    isGivingRights,
    giveDays,
  } = getApplicationAnswers(application.answers)

  let days = 0

  if (isRequestingRights === YES && requestDays) {
    const requestedDays = Number(requestDays)

    days = requestedDays
  }

  if (selectedChild.hasRights && isGivingRights === YES && giveDays) {
    const givenDays = Number(giveDays)

    days = -givenDays
  }

  return days
}

export const getAvailableRightsInDays = (application: Application) => {
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  if (!selectedChild) {
    throw new Error('Missing selected child')
  }

  if (selectedChild.parentalRelation === ParentalRelations.secondary) {
    // Transferred days are chosen for secondary parent by primary parent
    // so they are persisted into external data
    return selectedChild.remainingDays
  }

  // Primary parent chooses transferred days so they are persisted into answers
  const transferredDays = getTransferredDays(application, selectedChild)

  return selectedChild.remainingDays + transferredDays
}

export const getAvailablePersonalRightsInDays = (application: Application) => {
  const totalDaysAvailable = getAvailableRightsInDays(application)

  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  if (!selectedChild) {
    throw new Error('Missing selected child')
  }

  const totalTransferredDays = getTransferredDays(application, selectedChild)

  return totalDaysAvailable - totalTransferredDays
}

export const getAvailablePersonalRightsInMonths = (application: Application) =>
  daysToMonths(getAvailablePersonalRightsInDays(application))

/**
 * Returns the number of months available for the applicant.
 */
export const getAvailableRightsInMonths = (application: Application) =>
  daysToMonths(getAvailableRightsInDays(application))

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
  const { selectedChild: selectedChildIndex } = getApplicationAnswers(answers)
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
  const {
    dataProvider,
    children,
    existingApplications,
  } = getApplicationExternalData(externalData)

  return (
    dataProvider?.hasActivePregnancy &&
    (children.length > 0 || existingApplications.length > 0) &&
    dataProvider?.remainingDays > 0
  )
}

const calculateNumberOfHalfMonthsBetween = (start: Date, end: Date) => {
  const daysBetween =
    end.getTime() / MILLISECONDS_IN_A_DAY -
    start.getTime() / MILLISECONDS_IN_A_DAY
  const halfMonthsBetween = daysBetween / (daysInMonth / 2)

  // TODO: Refactor. Rough estimate.
  return Math.round(halfMonthsBetween)
}

export const calculatePeriodPercentageBetweenDates = (
  application: Application,
  start: Date,
  end: Date,
) => {
  const availableRights = getAvailableRightsInMonths(application)

  const numberOfHalfMonthsBetween = calculateNumberOfHalfMonthsBetween(
    start,
    end,
  )
  const numberOfHalfMonthsInRights = availableRights * 2

  if (numberOfHalfMonthsBetween <= numberOfHalfMonthsInRights) {
    return 100
  }

  return Math.min(
    100,
    Math.round((numberOfHalfMonthsInRights / numberOfHalfMonthsBetween) * 100),
  )
}

export const calculatePeriodPercentage = (
  application: Application,
  {
    field,
    dates,
  }: {
    field?: Field
    dates?: { startDate: string; endDate: string }
  },
) => {
  const expectedDateOfBirth = getExpectedDateOfBirth(application)

  let startDate: string | undefined = undefined
  let endDate: string | undefined = undefined

  const repeaterIndex = field ? extractRepeaterIndexFromField(field) : -1
  const index = repeaterIndex === -1 ? 0 : repeaterIndex
  const { answers } = application

  startDate = getValueViaPath(
    answers,
    `periods[${index}].startDate`,
    expectedDateOfBirth,
  ) as string

  endDate = getValueViaPath(answers, `periods[${index}].endDate`) as string

  if (dates) {
    startDate = dates?.startDate
    endDate = dates?.endDate
  }

  return calculatePeriodPercentageBetweenDates(
    application,
    parseISO(startDate),
    parseISO(endDate),
  )
}

const getOrFallback = (
  condition: Boolean,
  value: number | undefined = maxDaysToGiveOrReceive,
) => {
  if (condition === YES) {
    return value
  }

  return 0
}

export function getApplicationExternalData(
  externalData: Application['externalData'],
) {
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

  const familyMembers = getValueViaPath(externalData, 'family.data', null) as
    | FamilyMember[]
    | null

  const userEmail = getValueViaPath(
    externalData,
    'userProfile.data.email',
  ) as string

  const userPhoneNumber = getValueViaPath(
    externalData,
    'userProfile.data.mobilePhoneNumber',
  ) as string

  return {
    dataProvider,
    children,
    existingApplications,
    familyMembers,
    userEmail,
    userPhoneNumber,
  }
}

export function getApplicationAnswers(answers: Application['answers']) {
  const otherParent = getValueViaPath(
    answers,
    'otherParent',
  ) as SchemaFormValues['otherParent']

  const otherParentRightOfAccess = getValueViaPath(
    answers,
    'otherParentRightOfAccess',
  ) as SchemaFormValues['otherParentRightOfAccess']

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
    '0',
  ) as string

  const isSelfEmployed = getValueViaPath(
    answers,
    'employer.isSelfEmployed',
  ) as Boolean

  const otherParentName = getValueViaPath(answers, 'otherParentName') as string

  const otherParentId = getValueViaPath(answers, 'otherParentId') as string

  const bank = getValueViaPath(answers, 'payments.bank') as string

  const usePersonalAllowance = getValueViaPath(
    answers,
    'usePersonalAllowance',
    NO,
  ) as Boolean

  const usePersonalAllowanceFromSpouse = getValueViaPath(
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

  const employerNationalRegistryId = getValueViaPath(
    answers,
    'employer.nationalRegistryId',
  ) as string

  const shareInformationWithOtherParent = getValueViaPath(
    answers,
    'shareInformationWithOtherParent',
  ) as Boolean

  const selectedChild = getValueViaPath(answers, 'selectedChild') as string

  const isRequestingRights = getValueViaPath(
    answers,
    'requestRights.isRequestingRights',
  ) as Boolean

  const requestValue = getValueViaPath(answers, 'requestRights.requestDays') as
    | number
    | undefined

  const requestDays = getOrFallback(isRequestingRights, requestValue)

  const isGivingRights = getValueViaPath(
    answers,
    'giveRights.isGivingRights',
  ) as Boolean

  const giveValue = getValueViaPath(answers, 'giveRights.giveDays') as
    | number
    | undefined

  const giveDays = getOrFallback(isGivingRights, giveValue)

  const applicantEmail = getValueViaPath(answers, 'applicant.email') as string

  const applicantPhoneNumber = getValueViaPath(
    answers,
    'applicant.phoneNumber',
  ) as string

  const periods = getValueViaPath(answers, 'periods') as Period[]

  return {
    otherParent,
    otherParentRightOfAccess,
    pensionFund,
    union,
    usePrivatePensionFund,
    privatePensionFund,
    privatePensionFundPercentage,
    isSelfEmployed,
    otherParentName,
    otherParentId,
    bank,
    usePersonalAllowance,
    usePersonalAllowanceFromSpouse,
    personalUseAsMuchAsPossible,
    personalUsage,
    spouseUseAsMuchAsPossible,
    spouseUsage,
    employerEmail,
    employerNationalRegistryId,
    shareInformationWithOtherParent,
    selectedChild,
    isRequestingRights,
    requestDays,
    isGivingRights,
    giveDays,
    applicantEmail,
    applicantPhoneNumber,
    periods,
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

export const otherParentApprovalDescription = (
  answers: Application['answers'],
  formatMessage: FormatMessage,
) => {
  const applicationAnswers = getApplicationAnswers(answers)

  const {
    isRequestingRights,
    usePersonalAllowanceFromSpouse,
  } = applicationAnswers

  const description =
    isRequestingRights === YES && usePersonalAllowanceFromSpouse === YES
      ? parentalLeaveFormMessages.reviewScreen.otherParentDescRequestingBoth
      : isRequestingRights === YES
      ? parentalLeaveFormMessages.reviewScreen.otherParentDescRequestingRights
      : parentalLeaveFormMessages.reviewScreen
          .otherParentDescRequestingPersonalDiscount

  return formatMessage(description)
}

export const allowOtherParent = (answers: Application['answers']) => {
  const { otherParent, otherParentRightOfAccess } = getApplicationAnswers(
    answers,
  )

  return (
    otherParent === SPOUSE ||
    (otherParent === MANUAL && otherParentRightOfAccess === YES)
  )
}
