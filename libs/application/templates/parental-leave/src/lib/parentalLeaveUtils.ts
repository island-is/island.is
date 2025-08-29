import { getValueViaPath, NO, YES, YesOrNo } from '@island.is/application/core'
import {
  Application,
  ApplicationLifecycle,
  ExternalData,
  Field,
  FormValue,
  Option,
  PendingAction,
  RepeaterProps,
} from '@island.is/application/types'
import { FormatMessage } from '@island.is/localization'
import { dateFormat } from '@island.is/shared/constants'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import differenceInDays from 'date-fns/differenceInDays'
import differenceInMonths from 'date-fns/differenceInMonths'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import format from 'date-fns/format'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import isEqual from 'date-fns/isEqual'
import isSameMonth from 'date-fns/isSameMonth'
import isThisMonth from 'date-fns/isThisMonth'
import parseISO from 'date-fns/parseISO'
import subDays from 'date-fns/subDays'
import subMonths from 'date-fns/subMonths'
import round from 'lodash/round'
import set from 'lodash/set'
import { MessageDescriptor } from 'react-intl'
import {
  additionalSingleParentMonths,
  daysInMonth,
  defaultMonths,
  minimumPeriodStartBeforeExpectedDateOfBirth,
  minPeriodDays,
  multipleBirthsDefaultDays,
} from '../config'
import {
  ADOPTION,
  AttachmentLabel,
  AttachmentTypes,
  FileType,
  MANUAL,
  OTHER_NO_CHILDREN_FOUND,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  PERMANENT_FOSTER_CARE,
  ParentalRelations,
  Roles,
  SINGLE,
  SPOUSE,
  StartDateOptions,
  States,
  TransferRightsOption,
  UnEmployedBenefitTypes,
} from '../constants'
import { TimelinePeriod } from '../fields/components/Timeline/Timeline'
import { SchemaFormValues } from '../lib/dataSchema'
import {
  calculatePeriodLength,
  daysToMonths,
  monthsToDays,
} from '../lib/directorateOfLabour.utils'
import { parentalLeaveFormMessages, statesMessages } from '../lib/messages'
import {
  Attachments,
  ChildInformation,
  EmployerRow,
  FileUpload,
  Files,
  OtherParentObj,
  Period,
  PersonInformation,
  PregnancyStatusAndRightsResults,
  SelectOption,
  VMSTPeriod,
  VMSTOtherParent,
} from '../types'
import { currentDateStartTime } from './parentalLeaveTemplateUtils'
import { ApplicationRights } from '@island.is/clients/vmst'
import isSameDay from 'date-fns/isSameDay'

export const getExpectedDateOfBirthOrAdoptionDateOrBirthDate = (
  application: Application,
  returnBirthDate = false,
): string | undefined => {
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  if (!selectedChild) {
    return undefined
  }

  if (returnBirthDate) {
    const { dateOfBirth } = getApplicationExternalData(application.externalData)

    if (dateOfBirth?.data?.dateOfBirth) return dateOfBirth?.data?.dateOfBirth
  }

  if (selectedChild.expectedDateOfBirth === '')
    return selectedChild.adoptionDate

  return selectedChild.expectedDateOfBirth
}

export const getBeginningOfThisMonth = (): Date => {
  const today = new Date()
  return addDays(today, today.getDate() * -1 + 1)
}

export const getBeginningOfMonth3MonthsAgo = (): Date => {
  return addMonths(getBeginningOfThisMonth(), -3)
}

export const getLastDayOfLastMonth = (): Date => {
  const today = new Date()
  return addDays(today, today.getDate() * -1)
}

// TODO: Once we have the data, add the otherParentPeriods here.
export const formatPeriods = (
  application: Application,
  formatMessage: FormatMessage,
): TimelinePeriod[] => {
  const { periods, firstPeriodStart, addPeriods, tempPeriods } =
    getApplicationAnswers(application.answers)
  const { applicationFundId } = getApplicationExternalData(
    application.externalData,
  )

  const timelinePeriods: TimelinePeriod[] = []

  const periodsArray =
    application.state === States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS
      ? addPeriods === YES
        ? periods
        : tempPeriods
      : periods

  periodsArray?.forEach((period, index) => {
    const isActualDob =
      index === 0 && firstPeriodStart === StartDateOptions.ACTUAL_DATE_OF_BIRTH

    const calculatedLength = calculatePeriodLengthInMonths(
      period.startDate,
      period.endDate,
    ).toString()

    const startDateDateTime = new Date(period.startDate)
    let canDelete = startDateDateTime.getTime() > currentDateStartTime()
    const today = new Date()

    if (!applicationFundId || applicationFundId === '') {
      canDelete = true
    } else if (isThisMonth(startDateDateTime)) {
      if (canDelete && today.getDate() >= 24) {
        canDelete = false
      } else if (!canDelete && today.getDate() < 24) {
        canDelete = true
      }
    }

    const timelinePeriod = {
      startDate: period.startDate,
      endDate: period.endDate,
      ratio: period.ratio,
      duration: calculatedLength,
      canDelete: canDelete,
      title: formatMessage(
        'approved' in period
          ? parentalLeaveFormMessages.reviewScreen.vmstPeriod
          : parentalLeaveFormMessages.reviewScreen.period,
        {
          index: index + 1,
          ratio: period.ratio,
        },
      ),
      rawIndex: period.rawIndex ?? index,
      paid: period.paid,
    }

    if (isActualDob) {
      timelinePeriods.push({
        ...timelinePeriod,
        actualDob: isActualDob,
      })
    }

    if (!isActualDob && period.startDate && period.endDate) {
      timelinePeriods.push(timelinePeriod)
    }
  })

  return timelinePeriods
}

export const formatBankInfo = (bankInfo: string) => {
  const formattedBankInfo = bankInfo.replace(/[^0-9]/g, '')
  if (formattedBankInfo && formattedBankInfo.length === 12) {
    return formattedBankInfo
  }

  return bankInfo
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

export const getPersonalDays = (application: Application) => {
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )
  if (!selectedChild) {
    throw new Error('Missing selected child')
  }
  const maximumDaysToSpend = getAvailableRightsInDays(application)
  const maximumMultipleBirthsDaysToSpend = getMultipleBirthsDays(application)
  const maximumAdditionalSingleParentDaysToSpend =
    getAdditionalSingleParentRightsInDays(application)
  const transferredDays = getTransferredDays(application, selectedChild)
  const personalDays =
    maximumDaysToSpend -
    maximumAdditionalSingleParentDaysToSpend -
    maximumMultipleBirthsDaysToSpend -
    Math.max(transferredDays, 0)
  return personalDays
}

export const getPersonalDaysInMonths = (application: Application) =>
  daysToMonths(getPersonalDays(application)).toFixed(1)

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

export const getMultipleBirthsDaysInMonths = (application: Application) =>
  daysToMonths(getMultipleBirthsDays(application)).toFixed(1)

export const getMultipleBirthRequestDays = (
  answers: Application['answers'],
) => {
  const { multipleBirthsRequestDays, otherParent, hasMultipleBirths } =
    getApplicationAnswers(answers)

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
  const singleParentDaysInMonths =
    getAvailablePersonalRightsSingleParentInMonths(application)

  return singleParentDaysInMonths + multipleBirthsDaysInMonths
}

export const getAdditionalSingleParentRightsInDays = (
  application: Application,
) => {
  const { otherParent } = getApplicationAnswers(application.answers)

  return otherParent === SINGLE ? monthsToDays(additionalSingleParentMonths) : 0
}

export const getAvailableRightsInDays = (application: Application) => {
  const { VMSTApplicationRights } = getApplicationExternalData(
    application.externalData,
  )
  if (VMSTApplicationRights) {
    const VMSTDays = VMSTApplicationRights.reduce(
      (acc, right) => acc + Number(right.days),
      0,
    )

    return VMSTDays
  }

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
  const additionalSingleParentDays =
    getAdditionalSingleParentRightsInDays(application)

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
  const additionalSingleParentDays =
    getAdditionalSingleParentRightsInDays(application)

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

export const getAdditionalSingleParentRightsInMonths = (
  application: Application,
) => daysToMonths(getAdditionalSingleParentRightsInDays(application)).toFixed(1)

export const getAvailablePersonalRightsInMonths = (application: Application) =>
  daysToMonths(getAvailablePersonalRightsInDays(application))

/**
 * Returns the number of months available for the applicant.
 */
export const getAvailableRightsInMonths = (application: Application) =>
  daysToMonths(getAvailableRightsInDays(application))

export const getTransferredDaysInMonths = (
  application: Application,
  selectedChild: ChildInformation,
) => daysToMonths(getTransferredDays(application, selectedChild)).toFixed(1)

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

export const getOtherParentOptions = () => {
  const options: Option[] = [
    {
      value: NO,
      dataTestId: 'no-other-parent',
      label: parentalLeaveFormMessages.shared.noOtherParent,
    },
    {
      value: SINGLE,
      label: parentalLeaveFormMessages.shared.singleParentOption,
      subLabel: parentalLeaveFormMessages.shared.singleParentDescription,
    },
    {
      value: MANUAL,
      dataTestId: 'other-parent',
      label: parentalLeaveFormMessages.shared.otherParentOption,
    },
  ]

  return options
}

export const getApplicationTypeOptions = () => {
  const options: Option[] = [
    {
      value: PARENTAL_LEAVE,
      dataTestId: 'parental-leave',
      label: parentalLeaveFormMessages.shared.applicationParentalLeaveTitle,
      subLabel:
        parentalLeaveFormMessages.shared.applicationParentalLeaveSubTitle,
    },
    {
      value: PARENTAL_GRANT,
      dataTestId: 'parental-grant',
      label:
        parentalLeaveFormMessages.shared
          .applicationParentalGrantUnemployedTitle,
      subLabel:
        parentalLeaveFormMessages.shared
          .applicationParentalGrantUnemployedSubTitle,
    },
    {
      value: PARENTAL_GRANT_STUDENTS,
      dataTestId: 'parental-grant-students',
      label:
        parentalLeaveFormMessages.shared.applicationParentalGrantStudentTitle,
      subLabel:
        parentalLeaveFormMessages.shared
          .applicationParentalGrantStudentSubTitle,
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
  const { dataProvider, children } = getApplicationExternalData(externalData)

  return (
    dataProvider?.hasActivePregnancy &&
    children.length > 0 &&
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

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const dataProvider = getValueViaPath(
    externalData,
    'children.data',
  ) as PregnancyStatusAndRightsResults

  const children = getValueViaPath(
    externalData,
    'children.data.children',
    [],
  ) as ChildInformation[]

  const userEmail = getValueViaPath(
    externalData,
    'userProfile.data.email',
  ) as string

  const userPhoneNumber = getValueViaPath(
    externalData,
    'userProfile.data.mobilePhoneNumber',
  ) as string

  const applicantGenderCode = getValueViaPath(
    externalData,
    'person.data.genderCode',
  ) as string

  const applicantName = (getValueViaPath(
    externalData,
    'person.data.fullname',
  ) ?? getValueViaPath(externalData, 'person.data.fullName', '')) as string

  const navId = getValueViaPath(externalData, 'navId', '') as string

  const dateOfBirth = getValueViaPath(externalData, 'dateOfBirth') as {
    data: { dateOfBirth: string }
  }

  let applicationFundId = navId
  if (!applicationFundId || applicationFundId === '') {
    applicationFundId = getValueViaPath(
      externalData,
      'sendApplication.data.id',
      '',
    ) as string
  }

  const VMSTPeriods = getValueViaPath(
    externalData,
    'VMSTPeriods.data',
  ) as VMSTPeriod[]

  const VMSTApplicationRights = getValueViaPath(
    externalData,
    'VMSTApplicationRights.data',
  ) as ApplicationRights[]

  const VMSTOtherParent = getValueViaPath(
    externalData,
    'VMSTOtherParent.data',
    {},
  ) as VMSTOtherParent

  return {
    applicantName,
    applicantGenderCode,
    applicationFundId,
    dataProvider,
    children,
    navId,
    userEmail,
    userPhoneNumber,
    dateOfBirth,
    VMSTPeriods,
    VMSTApplicationRights,
    VMSTOtherParent,
  }
}

export const getApplicationAnswers = (answers: Application['answers']) => {
  let applicationType = getValueViaPath(answers, 'applicationType.option')

  if (!applicationType) applicationType = PARENTAL_LEAVE as string
  else applicationType = applicationType as string

  const noChildrenFoundTypeOfApplication = getValueViaPath(
    answers,
    'noChildrenFound.typeOfApplication',
  ) as string

  const fosterCareOrAdoptionBirthDate = getValueViaPath(
    answers,
    'fosterCareOrAdoption.birthDate',
  ) as string

  const fosterCareOrAdoptionDate = getValueViaPath(
    answers,
    'fosterCareOrAdoption.adoptionDate',
  ) as string

  const noPrimaryParentBirthDate = getValueViaPath(
    answers,
    'noPrimaryParent.birthDate',
  ) as string

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

  const useUnion = getValueViaPath(answers, 'payments.useUnion') as YesOrNo

  const union = getValueViaPath(answers, 'payments.union') as string

  const usePrivatePensionFund = getValueViaPath(
    answers,
    'payments.usePrivatePensionFund',
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

  let isSelfEmployed = getValueViaPath(
    answers,
    'employment.isSelfEmployed',
  ) as YesOrNo
  // Old values
  if (!isSelfEmployed) {
    isSelfEmployed = getValueViaPath(answers, 'isSelfEmployed') as YesOrNo
    if (!isSelfEmployed) {
      isSelfEmployed = getValueViaPath(
        answers,
        'employer.isSelfEmployed',
      ) as YesOrNo
    }
  }

  let isReceivingUnemploymentBenefits = getValueViaPath(
    answers,
    'employment.isReceivingUnemploymentBenefits',
  ) as YesOrNo
  // Old values
  if (!isReceivingUnemploymentBenefits) {
    isReceivingUnemploymentBenefits = getValueViaPath(
      answers,
      'isReceivingUnemploymentBenefits',
    ) as YesOrNo
    if (!isReceivingUnemploymentBenefits) {
      isReceivingUnemploymentBenefits = getValueViaPath(
        answers,
        'isRecivingUnemploymentBenefits',
      ) as YesOrNo
    }
  }

  let unemploymentBenefits = getValueViaPath(
    answers,
    'employment.unemploymentBenefits',
  ) as string
  // Old values
  if (!unemploymentBenefits) {
    unemploymentBenefits = getValueViaPath(
      answers,
      'unemploymentBenefits',
    ) as string
  }

  const isResidenceGrant = getValueViaPath(
    answers,
    'isResidenceGrant',
    NO,
  ) as YesOrNo

  const hasAppliedForReidenceGrant = getValueViaPath(
    answers,
    'hasAppliedForReidenceGrant',
    NO,
  ) as YesOrNo

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

  const comment = getValueViaPath(answers, 'comment') as string

  const employerNationalRegistryId = getValueViaPath(
    answers,
    'employerNationalRegistryId',
  ) as string

  const employerReviewerNationalRegistryId = getValueViaPath(
    answers,
    'employerReviewerNationalRegistryId',
  ) as string

  let employers = getValueViaPath(answers, 'employers', []) as EmployerRow[]
  if (!employers) {
    employers = []
  }
  // old employer object
  if (employers.length === 0) {
    const employerEmailObj = getValueViaPath(
      answers,
      'employer.email',
    ) as string
    if (employerEmailObj) {
      employers.push({
        email: employerEmailObj,
        ratio: '100',
        reviewerNationalRegistryId: employerReviewerNationalRegistryId,
        companyNationalRegistryId: employerNationalRegistryId,
      } as EmployerRow)
    }
  }

  const employerLastSixMonths = getValueViaPath(
    answers,
    'employerLastSixMonths',
  ) as YesOrNo

  const isNotStillEmployed = employers?.some(
    (employer) => employer.stillEmployed === NO,
  )

  const shareInformationWithOtherParent = getValueViaPath(
    answers,
    'shareInformationWithOtherParent',
  ) as YesOrNo

  // default value as 0 for adoption, foster care and father without mother
  // since primary parent doesn't choose a child
  const selectedChild =
    noChildrenFoundTypeOfApplication === PERMANENT_FOSTER_CARE ||
    noChildrenFoundTypeOfApplication === ADOPTION ||
    noChildrenFoundTypeOfApplication === OTHER_NO_CHILDREN_FOUND
      ? '0'
      : (getValueViaPath(answers, 'selectedChild') as string)

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

  const additionalDocuments = getValueViaPath(
    answers,
    'fileUpload.additionalDocuments',
  ) as Files[]

  const selfEmployedFiles = getValueViaPath(
    answers,
    'fileUpload.selfEmployedFile',
  ) as Files[]

  const studentFiles = getValueViaPath(
    answers,
    'fileUpload.studentFile',
  ) as Files[]

  const singleParentFiles = getValueViaPath(
    answers,
    'fileUpload.singleParent',
  ) as Files[]

  const benefitsFiles = getValueViaPath(
    answers,
    'fileUpload.benefitsFile',
  ) as Files[]

  const residenceGrantFiles = getValueViaPath(
    answers,
    'fileUpload.residenceGrant',
  ) as Files[]

  const employmentTerminationCertificateFiles = getValueViaPath(
    answers,
    'fileUpload.employmentTerminationCertificateFile',
  ) as Files[]

  const changeEmployerFile = getValueViaPath(
    answers,
    'fileUpload.changeEmployerFile',
  ) as Files[]

  const dateOfBirth = getValueViaPath(answers, 'dateOfBirth') as string

  const commonFiles = getValueViaPath(answers, 'fileUpload.file') as Files[]

  const actionName = getValueViaPath(answers, 'actionName') as
    | 'period'
    | 'document'
    | 'documentPeriod'
    | 'empper'
    | 'employer'
    | 'empdoc'
    | 'empdocper'
    | undefined

  const previousState = getValueViaPath(answers, 'previousState') as string

  const addEmployer = getValueViaPath(answers, 'addEmployer') as YesOrNo

  const addPeriods = getValueViaPath(answers, 'addPeriods') as YesOrNo

  const tempPeriods = getValueViaPath(answers, 'tempPeriods', []) as Period[]
  const tempEmployers = getValueViaPath(
    answers,
    'tempEmployers',
    [],
  ) as EmployerRow[]

  const language = getValueViaPath(answers, 'applicant.language') as string

  const changeEmployer = getValueViaPath(answers, 'changeEmployer') as boolean
  const changePeriods = getValueViaPath(answers, 'changePeriods') as boolean

  return {
    applicationType,
    noChildrenFoundTypeOfApplication,
    fosterCareOrAdoptionBirthDate,
    fosterCareOrAdoptionDate,
    noPrimaryParentBirthDate,
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
    comment,
    employers,
    employerLastSixMonths,
    isNotStillEmployed,
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
    isReceivingUnemploymentBenefits,
    unemploymentBenefits,
    additionalDocuments,
    selfEmployedFiles,
    studentFiles,
    singleParentFiles,
    benefitsFiles,
    commonFiles,
    actionName,
    isResidenceGrant,
    dateOfBirth,
    residenceGrantFiles,
    employmentTerminationCertificateFiles,
    changeEmployerFile,
    hasAppliedForReidenceGrant,
    previousState,
    addEmployer,
    addPeriods,
    tempPeriods,
    tempEmployers,
    language,
    changeEmployer,
    changePeriods,
  }
}

export const getUnApprovedEmployers = (
  answers: Application['answers'],
): EmployerRow[] => {
  const { employers } = getApplicationAnswers(answers)
  const newEmployers: EmployerRow[] = []

  employers?.forEach((e) => {
    if (!e.isApproved) {
      newEmployers.push(e)
    }
  })

  return newEmployers
}

export const isParentWithoutBirthParent = (answers: Application['answers']) => {
  const questionOne = getValueViaPath(answers, 'noPrimaryParent.questionOne')
  const questionTwo = getValueViaPath(answers, 'noPrimaryParent.questionTwo')
  const questionThree = getValueViaPath(
    answers,
    'noPrimaryParent.questionThree',
  )

  return questionOne === YES && questionTwo === YES && questionThree === NO
}

export const isNotEligibleForParentWithoutBirthParent = (
  answers: Application['answers'],
) => {
  const questionOne = getValueViaPath(answers, 'noPrimaryParent.questionOne')
  const questionTwo = getValueViaPath(answers, 'noPrimaryParent.questionTwo')
  const questionThree = getValueViaPath(
    answers,
    'noPrimaryParent.questionThree',
  )

  return questionOne === NO || questionTwo === NO || questionThree === YES
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

  const { isRequestingRights, usePersonalAllowanceFromSpouse } =
    applicationAnswers

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
) => {
  const applicationAnswers = getApplicationAnswers(answers)

  const { isRequestingRights, usePersonalAllowanceFromSpouse } =
    applicationAnswers

  return isRequestingRights === YES && usePersonalAllowanceFromSpouse === YES
    ? parentalLeaveFormMessages.reviewScreen.otherParentDescRequestingBoth
    : isRequestingRights === YES
    ? parentalLeaveFormMessages.reviewScreen.otherParentDescRequestingRights
    : parentalLeaveFormMessages.reviewScreen
        .otherParentDescRequestingPersonalDiscount
}

export const allowOtherParentToUsePersonalAllowance = (
  answers: Application['answers'],
) => {
  const otherParentObj = answers?.otherParentObj as unknown as OtherParentObj
  return otherParentObj?.chooseOtherParent === SPOUSE
}

export const allowOtherParent = (answers: Application['answers']) => {
  const { otherParent, otherParentRightOfAccess } =
    getApplicationAnswers(answers)

  return (
    otherParent === SPOUSE ||
    (otherParent === MANUAL && otherParentRightOfAccess === YES)
  )
}

export const getOtherParentId = (
  application: Application,
): string | undefined => {
  const { otherParent, otherParentId, noPrimaryParentBirthDate } =
    getApplicationAnswers(application.answers)

  if (noPrimaryParentBirthDate) {
    return ''
  }

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

    if (!spouse || !spouse.name || otherParent === MANUAL) {
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
  const { applicationFundId } = getApplicationExternalData(
    application.externalData,
  )

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

  if (!applicationFundId || applicationFundId === '') {
    if (lastEndDate > getBeginningOfMonth3MonthsAgo()) return lastEndDate
  }

  // LastPeriod's endDate is in current month
  if (isThisMonth(lastEndDate)) {
    // Applicant has to start from begining of next month if today is >= 24
    if (today.getDate() >= 24) {
      return addMonths(beginningOfMonth, 1)
    }

    return lastEndDate
  }

  // Current Date is >= 24 and lastEndDate is in the past then Applicant could only start from next month
  if (today.getDate() >= 24 && lastEndDate.getTime() < today.getTime()) {
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
  const expectedDateOfBirthOrAdoptionDateOrBirthDate =
    getExpectedDateOfBirthOrAdoptionDateOrBirthDate(application, true)
  const lastPeriodEndDate = getLastValidPeriodEndDate(application)
  const { applicationFundId } = getApplicationExternalData(
    application.externalData,
  )

  const today = new Date()
  if (lastPeriodEndDate) {
    return lastPeriodEndDate
  } else if (expectedDateOfBirthOrAdoptionDateOrBirthDate) {
    const expectedDateOfBirthOrAdoptionDateOrBirthDateDate = new Date(
      expectedDateOfBirthOrAdoptionDateOrBirthDate,
    )

    if (isParentalGrant(application)) {
      const beginningOfMonthOfExpectedDateOfBirth = addDays(
        expectedDateOfBirthOrAdoptionDateOrBirthDateDate,
        expectedDateOfBirthOrAdoptionDateOrBirthDateDate.getDate() * -1 + 1,
      )
      return beginningOfMonthOfExpectedDateOfBirth
    }

    const beginningOfMonth = getBeginningOfThisMonth()
    const beginningOfMonth3MonthsAgo = getBeginningOfMonth3MonthsAgo()
    const leastStartDate = addMonths(
      expectedDateOfBirthOrAdoptionDateOrBirthDateDate,
      -minimumPeriodStartBeforeExpectedDateOfBirth,
    )

    if (leastStartDate >= beginningOfMonth3MonthsAgo) {
      return leastStartDate
    } else {
      if (!applicationFundId || applicationFundId === '')
        return beginningOfMonth3MonthsAgo
      if (leastStartDate >= beginningOfMonth) {
        return leastStartDate
      }
    }

    return beginningOfMonth
  }

  return today
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

export const calculateDaysUsedByPeriods = (periods: Period[]) =>
  Math.round(
    periods.reduce((total, period) => {
      const start = parseISO(period.startDate)
      const end = parseISO(period.endDate)
      const percentage = Number(period.ratio) / 100
      const periodLength = calculatePeriodLength(
        start,
        end,
        undefined,
        period.months,
      )

      const calculatedLength = period.daysToUse
        ? Number(period.daysToUse)
        : Math.round(periodLength * percentage)

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

  if (daysToAdd === 0) {
    if (start.getDate() === 31) {
      endDate = addDays(endDate, 1)
    }
    if (
      start.getDate() > 28 &&
      daysInMonth === 28 &&
      endDate.getDate() !== 28
    ) {
      endDate = addDays(endDate, 1)
    }
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
    } else if (daysInMonth === 29) {
      endDate = addDays(endDate, -1)
    }
  } else {
    // startDate is 16 or 17 and months with 31 days
    const startDay = start.getDate()
    if ((startDay === 16 || startDay === 17) && daysInMonth === 31) {
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
  const diffDays = differenceInDays(end, addMonths(start, diffMonths))

  const roundedDays =
    Math.min((diffDays / getDaysInMonth(end)) * 100, 100) / 100

  return round(diffMonths + roundedDays, 1)
}

// Functions that determine dynamic text changes in forms based on application type
export const getPeriodSectionTitle = (application: Application) => {
  if (isParentalGrant(application)) {
    return parentalLeaveFormMessages.shared.periodsGrantSection
  }
  return parentalLeaveFormMessages.shared.periodsLeaveSection
}

export const getRightsDescTitle = (application: Application) => {
  const { otherParent, hasMultipleBirths } = getApplicationAnswers(
    application.answers,
  )

  if (isParentalGrant(application)) {
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

export const getFirstPeriodTitle = (application: Application) => {
  if (isParentalGrant(application)) {
    return parentalLeaveFormMessages.firstPeriodStart.grantTitle
  }
  return parentalLeaveFormMessages.firstPeriodStart.title
}

export const getDurationTitle = (application: Application) => {
  if (isParentalGrant(application)) {
    return parentalLeaveFormMessages.duration.grantTitle
  }
  return parentalLeaveFormMessages.duration.title
}

export const getRatioTitle = (application: Application) => {
  if (isParentalGrant(application)) {
    return parentalLeaveFormMessages.ratio.grantTitle
  }
  return parentalLeaveFormMessages.ratio.title
}

export const getLeavePlanTitle = (application: Application) => {
  if (isParentalGrant(application)) {
    return parentalLeaveFormMessages.leavePlan.grantTitle
  }
  return parentalLeaveFormMessages.leavePlan.title
}

export const getStartDateTitle = (application: Application) => {
  if (isParentalGrant(application)) {
    return parentalLeaveFormMessages.startDate.grantTitle
  }
  return parentalLeaveFormMessages.startDate.title
}

export const getStartDateDesc = (application: Application) => {
  if (isParentalGrant(application)) {
    return parentalLeaveFormMessages.startDate.grantDescription
  }
  return parentalLeaveFormMessages.startDate.description
}

export const getFosterCareOrAdoptionDesc = (application: Application) => {
  const { noChildrenFoundTypeOfApplication } = getApplicationAnswers(
    application.answers,
  )

  if (noChildrenFoundTypeOfApplication === PERMANENT_FOSTER_CARE)
    return parentalLeaveFormMessages.selectChild.fosterCareDescription
  else return parentalLeaveFormMessages.selectChild.adoptionDescription
}

const setLoadingStateAndRepeaterItems = async (
  VMSTPeriods: Period[],
  setRepeaterItems: RepeaterProps['setRepeaterItems'],
  setFieldLoadingState: RepeaterProps['setFieldLoadingState'],
) => {
  setFieldLoadingState?.(true)
  await setRepeaterItems(VMSTPeriods)
  setFieldLoadingState?.(false)
}

export const synchronizeVMSTPeriods = (
  data: any,
  rights: number,
  periods: Period[],
  setRepeaterItems: RepeaterProps['setRepeaterItems'],
  setFieldLoadingState: RepeaterProps['setFieldLoadingState'],
) => {
  // If periods is not in sync with VMST periods, sync it
  const newPeriods: Period[] = []
  const temptVMSTPeriods: Period[] = []
  const VMSTPeriods: VMSTPeriod[] = data?.getApplicationInformation?.periods
  const today = new Date()
  VMSTPeriods?.forEach((period, index) => {
    /*
     ** VMST could change startDate but still return 'date_of_birth'
     ** Make sure if period is in the past then we use the date they sent
     */
    let firstPeriodStart =
      period.firstPeriodStart === 'date_of_birth'
        ? 'actualDateOfBirth'
        : 'specificDate'
    if (new Date(period.from).getTime() <= today.getTime()) {
      firstPeriodStart = 'specificDate'
    }

    const rightsCodePeriod = period.rightsCodePeriod.split(',')[0]
    const obj = {
      startDate: period.from,
      endDate: period.to,
      ratio: period.ratio.split(',')[0],
      rawIndex: index,
      firstPeriodStart: firstPeriodStart,
      useLength: NO as YesOrNo,
      rightCodePeriod: rightsCodePeriod,
      daysToUse: period.days,
      paid: period.paid,
      approved: period.approved,
    }

    if (period.paid) {
      newPeriods.push(obj)
    } else if (isThisMonth(new Date(period.from))) {
      if (today.getDate() >= 24) {
        newPeriods.push(obj)
      }
    } else if (new Date(period.from).getTime() <= today.getTime()) {
      newPeriods.push(obj)
    }
    temptVMSTPeriods.push(obj)
  })

  let index = newPeriods.length
  if (index > 0) {
    const VMSTEndDate = new Date(newPeriods[index - 1].endDate)
    periods.forEach((period) => {
      // Drop period which is in the past, not in VMST and not in this month
      if (new Date(period.startDate) > VMSTEndDate) {
        const periodEndDate = new Date(period.endDate)
        if (periodEndDate.getTime() < today.getTime()) {
          if (
            isThisMonth(periodEndDate) &&
            isThisMonth(new Date(period.startDate))
          ) {
            newPeriods.push({ ...period, rawIndex: index })
            index += 1
          }
        } else {
          newPeriods.push({ ...period, rawIndex: index })
          index += 1
        }
      }
    })

    const usedDayNewPeriods = calculateDaysUsedByPeriods(newPeriods)
    // We don't want update periods if there isn't necessary. Otherwise, enable below code
    // if (usedDayNewPeriods > rights) {
    //   syncVMSTPeriods(temptVMSTPeriods)
    // } else {
    //   syncVMSTPeriods(newPeriods)
    // }
    let isMustSync = false
    if (periods.length !== newPeriods.length) {
      if (usedDayNewPeriods > rights) {
        setLoadingStateAndRepeaterItems(
          temptVMSTPeriods,
          setRepeaterItems,
          setFieldLoadingState,
        )
      } else {
        setLoadingStateAndRepeaterItems(
          newPeriods,
          setRepeaterItems,
          setFieldLoadingState,
        )
      }
    } else if (
      newPeriods[0].rightCodePeriod &&
      newPeriods[0]?.rightCodePeriod !== periods[0]?.rightCodePeriod
    ) {
      isMustSync = true
    } else {
      newPeriods.forEach((period, i) => {
        if (
          new Date(period.startDate).getTime() !==
            new Date(periods[i].startDate).getTime() ||
          new Date(period.endDate).getTime() !==
            new Date(periods[i].endDate).getTime() ||
          period.ratio !== periods[i].ratio ||
          period.firstPeriodStart !== periods[i].firstPeriodStart ||
          period.paid !== periods[i].paid ||
          period.approved !== periods[i].approved
        ) {
          isMustSync = true
        }
      })
    }

    if (isMustSync) {
      if (usedDayNewPeriods > rights) {
        setLoadingStateAndRepeaterItems(
          temptVMSTPeriods,
          setRepeaterItems,
          setFieldLoadingState,
        )
      } else {
        setLoadingStateAndRepeaterItems(
          newPeriods,
          setRepeaterItems,
          setFieldLoadingState,
        )
      }
    }
  }
}

export const isParentalGrant = (application: Application) => {
  const { applicationType } = getApplicationAnswers(application.answers)
  return (
    applicationType === PARENTAL_GRANT ||
    applicationType === PARENTAL_GRANT_STUDENTS
  )
}

export const isFosterCareAndAdoption = (application: Application) => {
  const { noChildrenFoundTypeOfApplication } = getApplicationAnswers(
    application.answers,
  )

  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  if (!selectedChild) {
    throw new Error('Missing selected child')
  }

  return selectedChild.parentalRelation === ParentalRelations.primary
    ? noChildrenFoundTypeOfApplication === PERMANENT_FOSTER_CARE ||
        noChildrenFoundTypeOfApplication === ADOPTION
    : selectedChild.primaryParentTypeOfApplication === PERMANENT_FOSTER_CARE ||
        selectedChild.primaryParentTypeOfApplication === ADOPTION
}

export const convertBirthDay = (birthDay: string) => {
  // Regex check if only decimals are used in the string
  const reg = new RegExp(/^\d+$/)
  // If the birthDay comes in format yyyy-mm-dd we remove the -
  const regex = new RegExp(/-/g)
  // Default
  const convertedBirthDay = { year: 0, month: 0, date: 0 }
  // Checks on length and only contain decimal or we return default
  const newBirthDay = birthDay.replace(regex, '')
  const birthDaySliced =
    newBirthDay?.length > 8 ? newBirthDay.slice(0, 8) : newBirthDay

  if (birthDaySliced.length !== 8) return convertedBirthDay
  if (!birthDaySliced.match(reg)) return convertedBirthDay
  // The string is expected to be yyyymmdd
  const year = Number(birthDaySliced.slice(0, 4))
  // Substract one month to take care of js zero index on dates
  const month = Number(birthDaySliced.slice(4, 6)) - 1
  const date = Number(birthDaySliced.slice(6, 8))
  return { year, month, date }
}

export const residentGrantIsOpenForApplication = (childBirthDay: string) => {
  // We expect the childBirthDay to be yyyymmdd
  const convertedBirthDay = convertBirthDay(childBirthDay) // Guard that the method used above did not return 0 0 0

  if (
    convertedBirthDay.date === 0 &&
    convertedBirthDay.month === 0 &&
    convertedBirthDay.year === 0
  )
    return false

  const birthDay = new Date(
    convertedBirthDay?.year,
    convertedBirthDay.month,
    convertedBirthDay.date,
  )

  const dateToday = new Date().setHours(0, 0, 0, 0)

  if (isEqual(dateToday, birthDay)) return true
  if (!isAfter(dateToday, birthDay)) return false // Adds 6 months to the birthday

  const fullPeriod = addMonths(birthDay, 6)

  if (isEqual(subMonths(new Date(dateToday), 6), subMonths(fullPeriod, 6)))
    return true

  if (!isBefore(subMonths(new Date(dateToday), 6), subMonths(fullPeriod, 6)))
    return false

  return true
}

export const setTestBirthAndExpectedDate = (
  months = 0,
  days = 0,
  addMonth = false,
  subMonth = false,
  daysAdd = false,
  daysSub = false,
) => {
  // Set a date that is today we can either add or substract months
  const date = subMonth
    ? subMonths(new Date(), months)
    : addMonth
    ? addMonths(new Date(), months)
    : new Date()

  const year = `${date.getFullYear()}`
  const month =
    `${date.getMonth() + 1}`.length > 1
      ? `${date.getMonth() + 1}`
      : `0${date.getMonth() + 1}`

  const day =
    `${date.getDate()}`.length > 1 ? `${date.getDate()}` : `0${date.getDate()}`
  // returns a  string in yyyymmdd
  const birthDate = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  )
  const newDate = daysSub
    ? subDays(birthDate, days)
    : daysAdd
    ? addDays(birthDate, days)
    : birthDate

  const expBirthDate = addDays(newDate, days)
  const expBirthDateYear = `${expBirthDate.getFullYear()}`
  const expBirthDateMonth = `${expBirthDate.getMonth()}`
  const expBirthDateDate = `${expBirthDate.getDate()}`

  return {
    birthDate: `${year}${month}${day}`,
    expBirthDate: `${expBirthDateYear}-${expBirthDateMonth}-${expBirthDateDate}`,
  }
}

export const determineNameFromApplicationAnswers = (
  application: Application,
) => {
  if (isParentalGrant(application)) {
    return parentalLeaveFormMessages.shared.nameGrant
  }

  return parentalLeaveFormMessages.shared.name
}

export const otherParentApprovalStatePendingAction = (
  application: Application,
  role: string,
): PendingAction => {
  if (role === Roles.ASSIGNEE) {
    return {
      title: statesMessages.otherParentRequestApprovalTitle,
      content: statesMessages.otherParentRequestApprovalDescription,
      displayStatus: 'warning',
    }
  } else {
    const applicationAnswers = getApplicationAnswers(application.answers)

    const { isRequestingRights, usePersonalAllowanceFromSpouse } =
      applicationAnswers

    const description =
      isRequestingRights === YES && usePersonalAllowanceFromSpouse === YES
        ? parentalLeaveFormMessages.reviewScreen.otherParentDescRequestingBoth
        : isRequestingRights === YES
        ? parentalLeaveFormMessages.reviewScreen.otherParentDescRequestingRights
        : parentalLeaveFormMessages.reviewScreen
            .otherParentDescRequestingPersonalDiscount

    return {
      title: statesMessages.otherParentApprovalDescription,
      content: description,
      displayStatus: 'info',
    }
  }
}

export const employerApprovalStatePendingAction = (
  _: Application,
  role: string,
): PendingAction => {
  if (role === Roles.ASSIGNEE) {
    return {
      title: statesMessages.employerApprovalPendingActionTitle,
      content: statesMessages.employerApprovalPendingActionDescription,
      displayStatus: 'info',
    }
  } else {
    return {
      title: statesMessages.employerWaitingToAssignDescription,
      content: parentalLeaveFormMessages.reviewScreen.employerDesc,
      displayStatus: 'info',
    }
  }
}

export const getChildrenOptions = (application: Application) => {
  const { children } = getApplicationExternalData(application.externalData) as {
    children: {
      expectedDateOfBirth: string
      adoptionDate: string
      primaryParentNationalRegistryId?: string
      primaryParentTypeOfApplication?: string
      parentalRelation: ParentalRelations
    }[]
  }

  const formatDateOfBirth = (value: string) =>
    format(new Date(value), dateFormat.is)

  return children.map((child, index) => {
    const subLabel =
      child.parentalRelation === ParentalRelations.secondary
        ? {
            ...parentalLeaveFormMessages.selectChild.secondaryParent,
            values: {
              nationalId: child.primaryParentNationalRegistryId ?? '',
            },
          }
        : parentalLeaveFormMessages.selectChild.primaryParent

    return {
      value: `${index}`,
      dataTestId: `child-${index}`,
      label:
        child.primaryParentTypeOfApplication === PERMANENT_FOSTER_CARE
          ? {
              ...parentalLeaveFormMessages.selectChild.fosterCare,
              values: {
                dateOfBirth: formatDateOfBirth(child.adoptionDate),
              },
            }
          : child.primaryParentTypeOfApplication === ADOPTION
          ? {
              ...parentalLeaveFormMessages.selectChild.adoption,
              values: {
                dateOfBirth: formatDateOfBirth(child.adoptionDate),
              },
            }
          : {
              ...parentalLeaveFormMessages.selectChild.baby,
              values: {
                dateOfBirth: formatDateOfBirth(child.expectedDateOfBirth),
              },
            },
      subLabel,
    }
  })
}

// applicant that cannot apply for residence grant: secondary parents, adoption and foster care
export const showResidenceGrant = (application: Application) => {
  const { children } = getApplicationExternalData(application.externalData)
  const { noChildrenFoundTypeOfApplication } = getApplicationAnswers(
    application.answers,
  )
  const childrenData = children as unknown as ChildInformation[]
  if (
    childrenData?.length &&
    childrenData[0]?.parentalRelation?.match('primary') &&
    noChildrenFoundTypeOfApplication !== PERMANENT_FOSTER_CARE &&
    noChildrenFoundTypeOfApplication !== ADOPTION
  )
    return true
  return false
}

export const getConclusionScreenSteps = (
  application: Application,
): MessageDescriptor[] => {
  const {
    isSelfEmployed,
    applicationType,
    isReceivingUnemploymentBenefits,
    employerLastSixMonths,
    employers,
  } = getApplicationAnswers(application.answers)

  const steps = [
    parentalLeaveFormMessages.finalScreen.step3,
  ] as MessageDescriptor[]

  // Added this check for applications that is in the db already
  const oldApplication = applicationType === undefined
  const isBeneficiaries = !oldApplication
    ? applicationType === PARENTAL_LEAVE
      ? isReceivingUnemploymentBenefits === YES
      : false
    : false
  const isStillEmployed = employers?.some(
    (employer) => employer.stillEmployed === YES,
  )

  if (isSelfEmployed === NO && !isBeneficiaries) {
    steps.unshift(parentalLeaveFormMessages.reviewScreen.employerDesc)
  }

  if (
    (applicationType === PARENTAL_GRANT ||
      applicationType === PARENTAL_GRANT_STUDENTS) &&
    employerLastSixMonths === YES &&
    isStillEmployed
  ) {
    steps.unshift(parentalLeaveFormMessages.reviewScreen.employerDesc)
  }

  if (
    requiresOtherParentApproval(application.answers, application.externalData)
  ) {
    steps.unshift(otherParentApprovalDescription(application.answers))
  }

  return steps
}

export const getAttachments = (application: Application) => {
  const getAttachmentDetails = (
    attachmentsArr: Files[] | undefined,
    attachmentType: AttachmentTypes,
  ) => {
    if (attachmentsArr && attachmentsArr.length > 0) {
      attachments.push({
        attachments: attachmentsArr,
        label: AttachmentLabel[attachmentType],
      })
    }
  }

  const { answers } = application
  const {
    isSelfEmployed,
    applicationType,
    isReceivingUnemploymentBenefits,
    unemploymentBenefits,
    otherParent,
    noChildrenFoundTypeOfApplication,
    employerLastSixMonths,
    isNotStillEmployed,
    commonFiles,
    changeEmployerFile,
  } = getApplicationAnswers(answers)

  const attachments: Attachments[] = []

  const fileUpload = answers.fileUpload as FileUpload

  if (isSelfEmployed === YES) {
    getAttachmentDetails(
      fileUpload?.selfEmployedFile,
      AttachmentTypes.SELF_EMPLOYED,
    )
  }
  if (applicationType === PARENTAL_GRANT_STUDENTS) {
    getAttachmentDetails(fileUpload?.studentFile, AttachmentTypes.STUDENT)
  }
  if (
    isSelfEmployed === NO &&
    isReceivingUnemploymentBenefits === YES &&
    (unemploymentBenefits === UnEmployedBenefitTypes.union ||
      unemploymentBenefits === UnEmployedBenefitTypes.healthInsurance)
  ) {
    getAttachmentDetails(fileUpload?.benefitsFile, AttachmentTypes.BENEFITS)
  }
  if (otherParent === SINGLE) {
    getAttachmentDetails(
      fileUpload?.singleParent,
      AttachmentTypes.SINGLE_PARENT,
    )
  }
  if (isParentWithoutBirthParent(answers)) {
    getAttachmentDetails(
      fileUpload?.parentWithoutBirthParent,
      AttachmentTypes.PARENT_WITHOUT_BIRTH_PARENT,
    )
  }
  if (noChildrenFoundTypeOfApplication === PERMANENT_FOSTER_CARE) {
    getAttachmentDetails(
      fileUpload?.permanentFosterCare,
      AttachmentTypes.PERMANENT_FOSTER_CARE,
    )
  }
  if (noChildrenFoundTypeOfApplication === ADOPTION) {
    getAttachmentDetails(fileUpload?.adoption, AttachmentTypes.ADOPTION)
  }
  if (
    (applicationType === PARENTAL_GRANT ||
      applicationType === PARENTAL_GRANT_STUDENTS) &&
    employerLastSixMonths === YES &&
    isNotStillEmployed
  ) {
    getAttachmentDetails(
      fileUpload?.employmentTerminationCertificateFile,
      AttachmentTypes.EMPLOYMENT_TERMINATION_CERTIFICATE,
    )
  }
  if (commonFiles?.length > 0) {
    getAttachmentDetails(fileUpload?.file, AttachmentTypes.FILE)
  }
  if (changeEmployerFile?.length > 0) {
    getAttachmentDetails(
      fileUpload?.changeEmployerFile,
      AttachmentTypes.CHANGE_EMPLOYER,
    )
  }

  return attachments
}

export const calculatePruneDate = (application: Application) => {
  const { pruneAt } = application as unknown as ApplicationLifecycle
  const { dateOfBirth } = getApplicationExternalData(application.externalData)

  // If date of birth is set then we use that date + 2 years as prune date
  if (dateOfBirth?.data?.dateOfBirth) {
    const pruneDate = new Date(dateOfBirth.data.dateOfBirth)
    pruneDate.setFullYear(pruneDate.getFullYear() + 2)

    return pruneDate
  }

  // Just to be sure that we have some date set for prune date
  if (!pruneAt) {
    const pruneDate = new Date()
    pruneDate.setMonth(pruneDate.getMonth() + 24)

    return pruneDate
  }

  return pruneAt
}

export const getSelectOptionLabel = (options: SelectOption[], id?: string) => {
  if (id === undefined) {
    return undefined
  }

  return options.find((option) => option.value === id)?.label
}

export const getActionName = (
  application: Application,
): FileType | undefined => {
  const { state } = application
  const {
    addEmployer,
    addPeriods,
    changeEmployer,
    changePeriods,
    changeEmployerFile,
  } = getApplicationAnswers(application.answers)

  switch (state) {
    case States.RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE:
    case States.RESIDENCE_GRANT_APPLICATION:
    case States.ADDITIONAL_DOCUMENTS_REQUIRED:
      return FileType.DOCUMENT
    case States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS: {
      const employerChanged = changeEmployer || addEmployer === YES
      const periodsChanged = changePeriods || addPeriods === YES

      // Keep book keeping of what has been selected
      if (!changeEmployer && addEmployer === YES) {
        set(application.answers, 'changeEmployer', true)
      }
      if (!changePeriods && addPeriods === YES) {
        set(application.answers, 'changePeriods', true)
      }

      if (changeEmployerFile && changeEmployerFile.length !== 0) {
        if (employerChanged && periodsChanged) {
          return FileType.EMPDOCPER
        } else if (employerChanged) {
          return FileType.EMPDOC
        }
      }
      if (employerChanged && periodsChanged) {
        return FileType.EMPPER
      } else if (employerChanged) {
        return FileType.EMPLOYER
      } else if (periodsChanged) {
        return FileType.PERIOD
      }
      break
    }
  }
  return undefined
}

export const getMinimumEndDate = (application: Application) => {
  const { rawPeriods } = getApplicationAnswers(application.answers)
  const prevPeriod = rawPeriods.at(-2)
  const nextPeriod = rawPeriods.at(-1)
  if (!nextPeriod) {
    return null
  }
  const latestStartDate = new Date(nextPeriod.startDate)
  if (isPeriodsContinuous(prevPeriod, nextPeriod)) {
    return addDays(latestStartDate, 1)
  }

  return addDays(latestStartDate, minPeriodDays - 1)
}

export const isPeriodsContinuous = (
  prevPeriod?: Period,
  nextPeriod?: Period,
) => {
  if (!prevPeriod || !nextPeriod) {
    return false
  }
  const prevEndDate = new Date(prevPeriod?.endDate)
  const nextStartDate = new Date(nextPeriod?.startDate)

  if (isSameDay(prevEndDate, addDays(nextStartDate, -1))) {
    return true
  }
  return false
}
