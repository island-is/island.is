import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import isSameMonth from 'date-fns/isSameMonth'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import parseISO from 'date-fns/parseISO'
import differenceInMonths from 'date-fns/differenceInMonths'
import differenceInDays from 'date-fns/differenceInDays'
import round from 'lodash/round'

import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  Field,
  FormValue,
  Option,
} from '@island.is/application/types'

import { parentalLeaveFormMessages } from '../lib/messages'
import { TimelinePeriod } from '../fields/components/Timeline/Timeline'
import {
  YES,
  NO,
  MANUAL,
  SPOUSE,
  StartDateOptions,
  ParentalRelations,
  TransferRightsOption,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  PARENTAL_GRANT,
  SINGLE,
} from '../constants'
import { SchemaFormValues } from '../lib/dataSchema'

import {
  calculatePeriodLength,
  daysToMonths,
  monthsToDays,
} from '../lib/directorateOfLabour.utils'
import {
  YesOrNo,
  Period,
  PersonInformation,
  ChildInformation,
  ChildrenAndExistingApplications,
  PregnancyStatusAndRightsResults,
} from '../types'
import { FormatMessage } from '@island.is/localization'
import { currentDateStartTime } from './parentalLeaveTemplateUtils'
import {
  additionalSingleParentMonths,
  daysInMonth,
  defaultMonths,
  minimumPeriodStartBeforeExpectedDateOfBirth,
  multipleBirthsDefaultDays,
} from '../config'
import { OtherParent } from '../fields'

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

export function getBeginningOfThisMonth(): Date {
  const today = new Date()
  return addDays(today, today.getDate() * -1 + 1)
}

export function getLastDayOfLastMonth(): Date {
  const today = new Date()
  return addDays(today, today.getDate() * -1)
}

// TODO: Once we have the data, add the otherParentPeriods here.
export function formatPeriods(
  application: Application,
  formatMessage: FormatMessage,
): TimelinePeriod[] {
  const { periods, firstPeriodStart } = getApplicationAnswers(
    application.answers,
  )
  const { applicationFundId } = getApplicationExternalData(
    application.externalData,
  )

  const timelinePeriods: TimelinePeriod[] = []

  periods?.forEach((period, index) => {
    const isActualDob =
      index === 0 && firstPeriodStart === StartDateOptions.ACTUAL_DATE_OF_BIRTH

    const calculatedLength = calculatePeriodLengthInMonths(
      period.startDate,
      period.endDate,
    ).toString()

    const startDateDateTime = new Date(period.startDate)
    let canDelete = startDateDateTime.getTime() > currentDateStartTime()
    const today = new Date()

    if (applicationFundId === '') {
      canDelete = true
    } else if (canDelete && today.getDate() >= 20) {
      const startDateBeginOfMonth = addDays(
        startDateDateTime,
        startDateDateTime.getDate() * -1,
      )
      const currentDateBeginOfMonth = getBeginningOfThisMonth()
      if (
        startDateBeginOfMonth.getMonth() ===
          currentDateBeginOfMonth.getMonth() &&
        startDateBeginOfMonth.getFullYear() ===
          currentDateBeginOfMonth.getFullYear()
      ) {
        canDelete = false
      }
    }

    if (isActualDob) {
      timelinePeriods.push({
        actualDob: isActualDob,
        startDate: period.startDate,
        endDate: period.endDate,
        ratio: period.ratio,
        duration: calculatedLength,
        canDelete: canDelete,
        title: formatMessage(parentalLeaveFormMessages.reviewScreen.period, {
          index: index + 1,
          ratio: period.ratio,
        }),
        rawIndex: period.rawIndex ?? index,
      })
    }

    if (!isActualDob && period.startDate && period.endDate) {
      timelinePeriods.push({
        startDate: period.startDate,
        endDate: period.endDate,
        ratio: period.ratio,
        duration: calculatedLength,
        canDelete: canDelete,
        title: formatMessage(parentalLeaveFormMessages.reviewScreen.period, {
          index: index + 1,
          ratio: period.ratio,
        }),
        rawIndex: period.rawIndex ?? index,
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
    otherParent,
  } = getApplicationAnswers(application.answers)

  if (otherParent === NO || otherParent === SINGLE) {
    return 0
  }
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

export const getMultipleBirthsDays = (application: Application) => {
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  if (!selectedChild) {
    throw new Error('Missing selected child')
  }

  if (selectedChild.parentalRelation === ParentalRelations.secondary) {
    return selectedChild.multipleBirthsDays ?? 0
  }

  return getMultipleBirthRequestDays(application.answers)
}

export const getMultipleBirthRequestDays = (
  answers: Application['answers'],
) => {
  const {
    multipleBirthsRequestDays,
    otherParent,
    hasMultipleBirths,
  } = getApplicationAnswers(answers)

  if (otherParent === SINGLE && hasMultipleBirths === YES) {
    return getMaxMultipleBirthsDays(answers)
  }

  return multipleBirthsRequestDays
}

export const getMaxMultipleBirthsDays = (answers: Application['answers']) => {
  const { multipleBirths } = getApplicationAnswers(answers)
  return (multipleBirths - 1) * multipleBirthsDefaultDays
}

export const getMaxMultipleBirthsInMonths = (
  answers: Application['answers'],
) => {
  const maxDays = getMaxMultipleBirthsDays(answers)
  return Math.ceil(maxDays / daysInMonth)
}

export const getMaxMultipleBirthsAndDefaultMonths = (
  answers: Application['answers'],
) => {
  const multipleBirthsDaysInMonths = getMaxMultipleBirthsInMonths(answers)
  return defaultMonths + multipleBirthsDaysInMonths
}

export const getMaxMultipleBirthsAndSingleParenttMonths = (
  application: Application,
) => {
  const multipleBirthsDaysInMonths = getMaxMultipleBirthsInMonths(
    application.answers,
  )
  const singleParentDaysInMonths = getAvailablePersonalRightsSingleParentInMonths(
    application,
  )

  return singleParentDaysInMonths + multipleBirthsDaysInMonths
}

export const getAdditionalSingleParentRightsInDays = (
  application: Application,
) => {
  const { otherParent } = getApplicationAnswers(application.answers)

  return otherParent === SINGLE ? monthsToDays(additionalSingleParentMonths) : 0
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
    return selectedChild.remainingDays ?? 0
  }

  // Primary parent chooses transferred days so they are persisted into answers
  const transferredDays = getTransferredDays(application, selectedChild)
  const multipleBirthsRequestDays = getMultipleBirthRequestDays(
    application.answers,
  )
  const additionalSingleParentDays = getAdditionalSingleParentRightsInDays(
    application,
  )

  return (
    selectedChild.remainingDays +
    additionalSingleParentDays +
    transferredDays +
    multipleBirthsRequestDays
  )
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
  const multipleBirthsDays = getMultipleBirthsDays(application)
  const additionalSingleParentDays = getAdditionalSingleParentRightsInDays(
    application,
  )

  return (
    totalDaysAvailable -
    additionalSingleParentDays -
    totalTransferredDays -
    multipleBirthsDays
  )
}

export const getAvailablePersonalRightsSingleParentInMonths = (
  application: Application,
) =>
  daysToMonths(
    getAvailablePersonalRightsInDays(application) +
      getAdditionalSingleParentRightsInDays(application),
  )

export const getAvailablePersonalRightsInMonths = (application: Application) =>
  daysToMonths(getAvailablePersonalRightsInDays(application))

/**
 * Returns the number of months available for the applicant.
 */
export const getAvailableRightsInMonths = (application: Application) =>
  daysToMonths(getAvailableRightsInDays(application))

export const getSpouse = (
  application: Application,
): PersonInformation['spouse'] | null => {
  const person = getValueViaPath(
    application.externalData,
    'person.data',
    null,
  ) as PersonInformation | null

  if (person?.spouse?.nationalId) {
    return person.spouse
  }

  return null
}

export const getOtherParentOptions = (
  application: Application,
  formatMessage: FormatMessage,
) => {
  const options: Option[] = [
    {
      value: NO,
      dataTestId: 'no-other-parent',
      label: parentalLeaveFormMessages.shared.noOtherParent,
    },
    {
      value: SINGLE,
      label: parentalLeaveFormMessages.shared.singleParentOption,
      subLabel: formatMessage(
        parentalLeaveFormMessages.shared.singleParentDescription,
      ),
    },
    {
      value: MANUAL,
      dataTestId: 'other-parent',
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
          spouseName: spouse.name,
          spouseId: spouse.nationalId,
        },
      },
    })
  }

  return options
}

export const getApplicationTypeOptions = (formatMessage: FormatMessage) => {
  const options: Option[] = [
    {
      value: PARENTAL_LEAVE,
      label: parentalLeaveFormMessages.shared.applicationParentalLeaveTitle,
      subLabel: formatMessage(
        parentalLeaveFormMessages.shared.applicationParentalLeaveSubTitle,
      ),
    },
    {
      value: PARENTAL_GRANT,
      label:
        parentalLeaveFormMessages.shared
          .applicationParentalGrantUnemployedTitle,
      subLabel: formatMessage(
        parentalLeaveFormMessages.shared
          .applicationParentalGrantUnemployedSubTitle,
      ),
    },
    {
      value: PARENTAL_GRANT_STUDENTS,
      label:
        parentalLeaveFormMessages.shared.applicationParentalGrantStudentTitle,
      subLabel: formatMessage(
        parentalLeaveFormMessages.shared
          .applicationParentalGrantStudentSubTitle,
      ),
    },
  ]
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

export const getPeriodIndex = (field?: Field) => {
  const id = field?.id

  if (!id) {
    return -1
  }

  if (id === 'periods') {
    return 0
  }

  return parseInt(id.substring(id.indexOf('[') + 1, id.indexOf(']')), 10)
}

const getOrFallback = (condition: YesOrNo, value: number | undefined = 0) => {
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

  const userEmail = getValueViaPath(
    externalData,
    'userProfile.data.email',
  ) as string

  const userPhoneNumber = getValueViaPath(
    externalData,
    'userProfile.data.mobilePhoneNumber',
  ) as string

  const userBankInfo = getValueViaPath(
    externalData,
    'userProfile.data.bankInfo',
  ) as string

  const applicantGenderCode = getValueViaPath(
    externalData,
    'person.data.genderCode',
  )

  const applicantName = getValueViaPath(
    externalData,
    'person.data.fullName',
    '',
  ) as string

  const navId = getValueViaPath(externalData, 'navId', '') as string

  let applicationFundId = navId
  if (!applicationFundId || applicationFundId === '') {
    applicationFundId = getValueViaPath(
      externalData,
      'sendApplication.data.id',
      '',
    ) as string
  }

  return {
    applicantName,
    applicantGenderCode,
    applicationFundId,
    dataProvider,
    children,
    existingApplications,
    navId,
    userEmail,
    userPhoneNumber,
    userBankInfo,
  }
}

export function getApplicationAnswers(answers: Application['answers']) {
  let applicationType = getValueViaPath(answers, 'applicationType.option')

  if (!applicationType) applicationType = PARENTAL_LEAVE as string
  else applicationType = applicationType as string

  const hasMultipleBirths = getValueViaPath(
    answers,
    'multipleBirths.hasMultipleBirths',
  ) as YesOrNo

  const multipleBirths = getValueViaPath(
    answers,
    'multipleBirths.multipleBirths',
    1,
  ) as number

  const multipleBirthsRequestDaysValue = getValueViaPath(
    answers,
    'multipleBirthsRequestDays',
  ) as number | undefined

  const multipleBirthsRequestDays = getOrFallback(
    hasMultipleBirths,
    multipleBirthsRequestDaysValue,
  ) as number

  const otherParent = (getValueViaPath(
    answers,
    'otherParentObj.chooseOtherParent',
  ) ?? getValueViaPath(answers, 'otherParent')) as string

  const otherParentRightOfAccess = getValueViaPath(
    answers,
    'otherParentRightOfAccess',
  ) as SchemaFormValues['otherParentRightOfAccess']

  const pensionFund = getValueViaPath(answers, 'payments.pensionFund') as string

  const useUnion = getValueViaPath(answers, 'useUnion') as YesOrNo

  const union = getValueViaPath(answers, 'payments.union') as string

  const usePrivatePensionFund = getValueViaPath(
    answers,
    'usePrivatePensionFund',
  ) as YesOrNo

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
  ) as YesOrNo

  let isRecivingUnemploymentBenefits = getValueViaPath(
    answers,
    'isRecivingUnemploymentBenefits',
  ) as YesOrNo

  if (!isRecivingUnemploymentBenefits)
    isRecivingUnemploymentBenefits = NO as YesOrNo

  const unemploymentBenefits = getValueViaPath(
    answers,
    'unemploymentBenefits',
  ) as string

  const otherParentName = (getValueViaPath(
    answers,
    'otherParentObj.otherParentName',
  ) ?? getValueViaPath(answers, 'otherParentName')) as string

  const otherParentId = (getValueViaPath(
    answers,
    'otherParentObj.otherParentId',
  ) ?? getValueViaPath(answers, 'otherParentId')) as string

  const otherParentEmail = getValueViaPath(
    answers,
    'otherParentEmail',
  ) as string

  const otherParentPhoneNumber = getValueViaPath(
    answers,
    'otherParentPhoneNumber',
  ) as string

  const bank = getValueViaPath(answers, 'payments.bank') as string

  const usePersonalAllowance =
    (getValueViaPath(
      answers,
      'personalAllowance.usePersonalAllowance',
    ) as YesOrNo) ??
    (getValueViaPath(answers, 'usePersonalAllowance', NO) as YesOrNo)

  const usePersonalAllowanceFromSpouse =
    (getValueViaPath(
      answers,
      'personalAllowanceFromSpouse.usePersonalAllowance',
    ) as YesOrNo) ??
    (getValueViaPath(answers, 'usePersonalAllowanceFromSpouse', NO) as YesOrNo)

  const personalUseAsMuchAsPossible = getValueViaPath(
    answers,
    'personalAllowance.useAsMuchAsPossible',
  ) as YesOrNo

  const personalUsage = getValueViaPath(
    answers,
    'personalAllowance.usage',
  ) as string

  const spouseUseAsMuchAsPossible = getValueViaPath(
    answers,
    'personalAllowanceFromSpouse.useAsMuchAsPossible',
  ) as YesOrNo

  const spouseUsage = getValueViaPath(
    answers,
    'personalAllowanceFromSpouse.usage',
  ) as string

  const employerEmail = getValueViaPath(answers, 'employer.email') as string

  const employerPhoneNumber = getValueViaPath(
    answers,
    'employerPhoneNumber',
  ) as string

  const employerNationalRegistryId = getValueViaPath(
    answers,
    'employerNationalRegistryId',
  ) as string

  const employerReviewerNationalRegistryId = getValueViaPath(
    answers,
    'employerReviewerNationalRegistryId',
  ) as string

  const shareInformationWithOtherParent = getValueViaPath(
    answers,
    'shareInformationWithOtherParent',
  ) as YesOrNo

  const selectedChild = getValueViaPath(answers, 'selectedChild') as string

  const transferRights = getValueViaPath(
    answers,
    'transferRights',
  ) as TransferRightsOption

  const isRequestingRightsSecondary =
    transferRights === TransferRightsOption.REQUEST
      ? YES
      : (getValueViaPath(
          answers,
          'requestRights.isRequestingRights',
        ) as YesOrNo)
  let isRequestingRights = isRequestingRightsSecondary

  /*
   ** When multiple births is selected and applicant is not using all 'common' rights
   ** Need this check so we are not returning wrong answer
   */
  if (isRequestingRights === YES && hasMultipleBirths === YES) {
    if (
      multipleBirthsRequestDays * 1 !==
      (multipleBirths - 1) * multipleBirthsDefaultDays
    ) {
      isRequestingRights = NO
    }
  }

  const requestValue = getValueViaPath(answers, 'requestRights.requestDays') as
    | number
    | undefined

  const requestDays = getOrFallback(
    isRequestingRights === YES
      ? isRequestingRights
      : isRequestingRightsSecondary,
    requestValue,
  )

  let isGivingRights =
    transferRights === TransferRightsOption.GIVE
      ? YES
      : (getValueViaPath(answers, 'giveRights.isGivingRights') as YesOrNo)

  /*
   ** When multiple births is selected and applicant is not using all 'common' rights
   ** Need this check so we are not returning wrong answer
   */
  if (isGivingRights === YES && hasMultipleBirths === YES) {
    if (multipleBirthsRequestDays * 1 !== 0) {
      isGivingRights = NO
    }
  }

  const giveValue = getValueViaPath(answers, 'giveRights.giveDays') as
    | number
    | undefined

  const giveDays = getOrFallback(isGivingRights, giveValue)

  const applicantEmail = getValueViaPath(answers, 'applicant.email') as string

  const applicantPhoneNumber = getValueViaPath(
    answers,
    'applicant.phoneNumber',
  ) as string

  const rawPeriods = getValueViaPath(answers, 'periods', []) as Period[]
  const periods = filterValidPeriods(rawPeriods)

  const firstPeriodStart =
    periods.length > 0 ? periods[0].firstPeriodStart : undefined

  return {
    applicationType,
    hasMultipleBirths,
    multipleBirths,
    multipleBirthsRequestDays: Number(multipleBirthsRequestDays),
    otherParent,
    otherParentRightOfAccess,
    pensionFund,
    useUnion,
    union,
    usePrivatePensionFund,
    privatePensionFund,
    privatePensionFundPercentage,
    isSelfEmployed,
    otherParentName,
    otherParentId,
    otherParentEmail,
    otherParentPhoneNumber,
    bank,
    usePersonalAllowance,
    usePersonalAllowanceFromSpouse,
    personalUseAsMuchAsPossible,
    personalUsage,
    spouseUseAsMuchAsPossible,
    spouseUsage,
    employerEmail,
    employerPhoneNumber,
    employerNationalRegistryId,
    employerReviewerNationalRegistryId,
    shareInformationWithOtherParent,
    selectedChild,
    transferRights,
    isRequestingRights,
    isRequestingRightsSecondary,
    requestDays: Number(requestDays),
    isGivingRights,
    giveDays: Number(giveDays),
    applicantEmail,
    applicantPhoneNumber,
    periods,
    rawPeriods,
    firstPeriodStart,
    isRecivingUnemploymentBenefits,
    unemploymentBenefits,
  }
}

export const requiresOtherParentApproval = (
  answers: Application['answers'],
  externalData: Application['externalData'],
) => {
  const applicationAnswers = getApplicationAnswers(answers)

  const { otherParent } = applicationAnswers
  if (otherParent === NO || otherParent === SINGLE) {
    return false
  }

  const selectedChild = getSelectedChild(answers, externalData)
  const { navId } = getApplicationExternalData(externalData)

  const {
    isRequestingRights,
    usePersonalAllowanceFromSpouse,
  } = applicationAnswers

  const needsApprovalForRequestingRights =
    selectedChild?.parentalRelation === ParentalRelations.primary

  //if an application has already been sent in then we don't need other parent approval as they are only changing period
  if (navId) {
    return false
  }

  return (
    (isRequestingRights === YES && needsApprovalForRequestingRights) ||
    usePersonalAllowanceFromSpouse === YES
  )
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

export const getOtherParentId = (
  application: Application,
): string | undefined => {
  const { otherParent, otherParentId } = getApplicationAnswers(
    application.answers,
  )

  if (otherParent === SPOUSE) {
    const spouse = getSpouse(application)

    if (!spouse || !spouse.nationalId) {
      return undefined
    }

    return spouse.nationalId
  }

  return otherParentId
}

export const getOtherParentName = (
  application: Application,
): string | undefined => {
  const { otherParent, otherParentName } = getApplicationAnswers(
    application.answers,
  )

  if (otherParent === SPOUSE) {
    const spouse = getSpouse(application)

    if (!spouse || !spouse.name) {
      return undefined
    }

    return spouse.name
  }

  // Second parent always has otherParent marks 'manual'
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )
  if (selectedChild?.parentalRelation === ParentalRelations.secondary) {
    const spouse = getSpouse(application)

    if (!spouse || !spouse.name) {
      return otherParentName
    }

    return spouse.name
  }

  return otherParentName
}

export const applicantIsMale = (application: Application): boolean => {
  const { applicantGenderCode } = getApplicationExternalData(
    application.externalData,
  )

  return applicantGenderCode === '1'
}

interface IncompletePeriod {
  startDate?: string
  endDate?: string
  ratio?: string
}

export const filterValidPeriods = (
  periods: (IncompletePeriod | Period)[],
): Period[] => {
  const filtered = periods
    .map((period, index) => ({
      ...period,
      rawIndex: index,
    }))
    .filter((period) => {
      const hasStartDate = !!period?.startDate
      const hasEndDate = !!period?.endDate
      const hasRatio = !!period?.ratio

      return hasStartDate && hasEndDate && hasRatio
    })

  return filtered as Period[]
}

export const getLastValidPeriodEndDate = (
  application: Application,
): Date | null => {
  const { periods } = getApplicationAnswers(application.answers)

  if (periods.length === 0) {
    return null
  }

  const lastPeriodEndDate = periods[periods.length - 1]?.endDate

  if (!lastPeriodEndDate) {
    return null
  }

  const lastEndDate = new Date(lastPeriodEndDate)

  const today = new Date()
  const beginningOfMonth = getBeginningOfThisMonth()

  // LastPeriod's endDate is in current month
  if (
    lastEndDate.getMonth() === today.getMonth() &&
    lastEndDate.getFullYear() === today.getFullYear()
  ) {
    // Applicant has to start from begining of next month if today is >= 20
    if (today.getDate() >= 20) {
      return addMonths(beginningOfMonth, 1)
    }

    return lastEndDate
  }

  // Current Date is >= 20 and lastEndDate is in the past then Applicant could only start from next month
  if (today.getDate() >= 20 && lastEndDate.getTime() < today.getTime()) {
    return addMonths(beginningOfMonth, 1)
  }

  // LastPeriod's endDate is long in the past then Applicant could only start from beginning of current month
  if (
    lastEndDate.getTime() < today.getTime() &&
    lastEndDate.getMonth() !== today.getMonth()
  ) {
    return beginningOfMonth
  }

  return lastEndDate
}

export const getMinimumStartDate = (application: Application): Date => {
  const expectedDateOfBirth = getExpectedDateOfBirth(application)
  const lastPeriodEndDate = getLastValidPeriodEndDate(application)

  const today = new Date()
  if (lastPeriodEndDate) {
    return lastPeriodEndDate
  } else if (expectedDateOfBirth) {
    const expectedDateOfBirthDate = new Date(expectedDateOfBirth)
    const beginningOfMonth = getBeginningOfThisMonth()
    const leastStartDate = addMonths(
      expectedDateOfBirthDate,
      -minimumPeriodStartBeforeExpectedDateOfBirth,
    )
    if (leastStartDate.getTime() >= beginningOfMonth.getTime()) {
      return leastStartDate
    }

    return beginningOfMonth
  }

  return today
}

export const calculateDaysUsedByPeriods = (periods: Period[]) =>
  Math.round(
    periods.reduce((total, period) => {
      const start = parseISO(period.startDate)
      const end = parseISO(period.endDate)
      const percentage = Number(period.ratio) / 100

      const calculatedLength = period.daysToUse
        ? Number(period.daysToUse)
        : calculatePeriodLength(start, end, percentage)

      return total + calculatedLength
    }, 0),
  )

export const calculateEndDateForPeriodWithStartAndLength = (
  startDate: string,
  lengthInMonths: number,
) => {
  const start = parseISO(startDate)

  const wholeMonthsToAdd = Math.floor(lengthInMonths)
  const daysToAdd =
    (Math.round((lengthInMonths - wholeMonthsToAdd) * 100) / 100) * 30

  const lastMonthBeforeEndDate = addMonths(start, wholeMonthsToAdd)
  let endDate = addDays(lastMonthBeforeEndDate, daysToAdd - 1)
  const daysInMonth = getDaysInMonth(lastMonthBeforeEndDate)

  // If startDay is first day of the month and daysToAdd = 0
  if (daysToAdd === 0 && start.getDate() === 1) {
    return endDate
  }

  // If endDate is the end of February and startDate is 15
  if (daysInMonth === 28 && lastMonthBeforeEndDate.getDate() === 15) {
    endDate = addDays(endDate, -1)
  }

  // February and months with 31 days
  if (!isSameMonth(lastMonthBeforeEndDate, endDate)) {
    if (daysInMonth === 31) {
      endDate = addDays(endDate, 1)
    } else if (daysInMonth === 28) {
      endDate = addDays(endDate, -2)
    } else if (daysInMonth === 29) {
      endDate = addDays(endDate, -1)
    }
  } else {
    // startDate is 16 and months with 31 days
    if (start.getDate() === 16 && daysInMonth === 31) {
      endDate = addDays(endDate, 1)
    }
  }

  return endDate
}

export const calculatePeriodLengthInMonths = (
  startDate: string,
  endDate: string,
) => {
  const start = parseISO(startDate)
  const end = parseISO(endDate)

  const diffMonths = differenceInMonths(end, start)
  const diffDays = differenceInDays(addMonths(end, -diffMonths), start)

  const roundedDays = Math.min((diffDays / 28) * 100, 100) / 100

  return round(diffMonths + roundedDays, 1)
}

const getMobilePhoneNumber = (application: Application) => {
  return (application.externalData.userProfile?.data as {
    mobilePhoneNumber?: string
  })?.mobilePhoneNumber
}

export const removeCountryCode = (application: Application) => {
  return getMobilePhoneNumber(application)?.startsWith('+354')
    ? getMobilePhoneNumber(application)?.slice(4)
    : getMobilePhoneNumber(application)?.startsWith('00354')
    ? getMobilePhoneNumber(application)?.slice(5)
    : getMobilePhoneNumber(application)
}

// Functions that determine dynamic text changes in forms based on application type
export const getPeriodSectionTitle = (application: Application) => {
  const appAnswers = getApplicationAnswers(application.answers)
  if (
    appAnswers.applicationType === PARENTAL_GRANT ||
    appAnswers.applicationType === PARENTAL_GRANT_STUDENTS
  ) {
    return parentalLeaveFormMessages.shared.periodsGrantSection
  }
  return parentalLeaveFormMessages.shared.periodsLeaveSection
}

export const getRightsDescTitle = (application: Application) => {
  const {
    applicationType,
    otherParent,
    hasMultipleBirths,
  } = getApplicationAnswers(application.answers)

  if (
    applicationType === PARENTAL_GRANT ||
    applicationType === PARENTAL_GRANT_STUDENTS
  ) {
    return otherParent === SINGLE && hasMultipleBirths === YES
      ? parentalLeaveFormMessages.shared
          .singleParentGrantMultipleRightsDescription
      : hasMultipleBirths === YES
      ? parentalLeaveFormMessages.shared.grantMultipleRightsDescription
      : otherParent === SINGLE
      ? parentalLeaveFormMessages.shared.singleParentGrantRightsDescription
      : parentalLeaveFormMessages.shared.grantRightsDescription
  }

  return otherParent === SINGLE && hasMultipleBirths === YES
    ? parentalLeaveFormMessages.shared.singleParentMultipleRightsDescription
    : hasMultipleBirths === YES
    ? parentalLeaveFormMessages.shared.multipleRightsDescription
    : otherParent === SINGLE
    ? parentalLeaveFormMessages.shared.singleParentRightsDescription
    : parentalLeaveFormMessages.shared.rightsDescription
}

export const getPeriodImageTitle = (application: Application) => {
  const appAnswers = getApplicationAnswers(application.answers)
  if (
    appAnswers.applicationType === PARENTAL_GRANT ||
    appAnswers.applicationType === PARENTAL_GRANT_STUDENTS
  ) {
    return parentalLeaveFormMessages.shared.periodsImageGrantTitle
  }
  return parentalLeaveFormMessages.shared.periodsImageTitle
}

export const getFirstPeriodTitle = (application: Application) => {
  const appAnswers = getApplicationAnswers(application.answers)
  if (
    appAnswers.applicationType === PARENTAL_GRANT ||
    appAnswers.applicationType === PARENTAL_GRANT_STUDENTS
  ) {
    return parentalLeaveFormMessages.firstPeriodStart.grantTitle
  }
  return parentalLeaveFormMessages.firstPeriodStart.title
}

export const getDurationTitle = (application: Application) => {
  const appAnswers = getApplicationAnswers(application.answers)
  if (
    appAnswers.applicationType === PARENTAL_GRANT ||
    appAnswers.applicationType === PARENTAL_GRANT_STUDENTS
  ) {
    return parentalLeaveFormMessages.duration.grantTitle
  }
  return parentalLeaveFormMessages.duration.title
}

export const getRatioTitle = (application: Application) => {
  const appAnswers = getApplicationAnswers(application.answers)
  if (
    appAnswers.applicationType === PARENTAL_GRANT ||
    appAnswers.applicationType === PARENTAL_GRANT_STUDENTS
  ) {
    return parentalLeaveFormMessages.ratio.grantTitle
  }
  return parentalLeaveFormMessages.ratio.title
}

export const getLeavePlanTitle = (application: Application) => {
  const appAnswers = getApplicationAnswers(application.answers)
  if (
    appAnswers.applicationType === PARENTAL_GRANT ||
    appAnswers.applicationType === PARENTAL_GRANT_STUDENTS
  ) {
    return parentalLeaveFormMessages.leavePlan.grantTitle
  }
  return parentalLeaveFormMessages.leavePlan.title
}

export const getStartDateTitle = (application: Application) => {
  const appAnswers = getApplicationAnswers(application.answers)
  if (
    appAnswers.applicationType === PARENTAL_GRANT ||
    appAnswers.applicationType === PARENTAL_GRANT_STUDENTS
  ) {
    return parentalLeaveFormMessages.startDate.grantTitle
  }
  return parentalLeaveFormMessages.startDate.title
}

export const getStartDateDesc = (application: Application) => {
  const appAnswers = getApplicationAnswers(application.answers)
  if (
    appAnswers.applicationType === PARENTAL_GRANT ||
    appAnswers.applicationType === PARENTAL_GRANT_STUDENTS
  ) {
    return parentalLeaveFormMessages.startDate.grantDescription
  }
  return parentalLeaveFormMessages.startDate.description
}
