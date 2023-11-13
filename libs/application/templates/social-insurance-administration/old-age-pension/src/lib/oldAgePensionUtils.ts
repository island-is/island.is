import { MessageDescriptor } from 'react-intl'
import { getValueViaPath } from '@island.is/application/core'
import {
  ConnectedApplications,
  HouseholdSupplementHousing,
  oldAgePensionAge,
  YES,
  fishermenMinAge,
  earlyRetirementMinAge,
  earlyRetirementMaxAge,
  NO,
  ApplicationType,
  Employment,
  RatioType,
  TaxLevelOptions,
  MONTHS,
  AttachmentLabel,
} from './constants'
import {
  ApplicantChildCustodyInformation,
  Option,
  Application,
  NationalRegistryResidenceHistory,
  YesOrNo,
} from '@island.is/application/types'
import { oldAgePensionFormMessage } from './messages'

import * as kennitala from 'kennitala'
import addYears from 'date-fns/addYears'
import addMonths from 'date-fns/addMonths'
import addDays from 'date-fns/addDays'
import {
  CombinedResidenceHistory,
  Employer,
  ChildPensionRow,
  BankInfo,
} from '../types'

export interface FileType {
  key: string
  name: string
}

interface FileUpload {
  earlyRetirement?: FileType[]
  pension?: FileType[]
  fishermen?: FileType[]
}

interface LeaseAgreementSchoolConfirmation {
  leaseAgreement?: FileType[]
  schoolConfirmation?: FileType[]
}

interface SelfEmployed {
  SelfEmployedAttachment?: FileType[]
}

interface ChildPensionAttachments {
  maintenance?: FileType[]
  childSupport?: FileType[]
}

interface AdditionalInformation {
  additionalDocuments?: FileType[]
  additionalDocumentsRequired?: FileType[]
}

enum AttachmentTypes {
  PENSION = 'pension',
  EARLY_RETIREMENT = 'earlyRetirement',
  FISHERMAN = 'fishermen',
  LEASE_AGREEMENT = 'leaseAgreement',
  SCHOOL_CONFIRMATION = 'schoolConfirmation',
  SELF_EMPLOYED_ATTACHMENT = 'SelfEmployedAttachment',
  MAINTENANCE = 'maintenance',
  CHILD_SUPPORT = 'childSupport',
  ADDITIONAL_DOCUMENTS = 'additionalDocuments',
}

interface Attachments {
  attachments: FileType[]
  label: MessageDescriptor
}

export function getApplicationAnswers(answers: Application['answers']) {
  const pensionFundQuestion = getValueViaPath(
    answers,
    'questions.pensionFund',
  ) as YesOrNo

  const applicationType = getValueViaPath(
    answers,
    'applicationType.option',
  ) as ApplicationType

  const selectedYear = getValueViaPath(answers, 'period.year') as string

  const selectedMonth = getValueViaPath(answers, 'period.month') as string

  const applicantEmail = getValueViaPath(
    answers,
    'applicantInfo.email',
  ) as string

  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicantInfo.phonenumber',
  ) as string

  // If foreign residence is found then this is always true
  const residenceHistoryQuestion = getValueViaPath(
    answers,
    'residenceHistory.question',
  ) as YesOrNo

  const onePaymentPerYear = getValueViaPath(
    answers,
    'onePaymentPerYear.question',
  ) as YesOrNo

  const comment = getValueViaPath(answers, 'comment') as string

  const connectedApplications = getValueViaPath(
    answers,
    'connectedApplications',
  ) as ConnectedApplications[]

  const householdSupplementHousing = getValueViaPath(
    answers,
    'householdSupplement.housing',
  ) as HouseholdSupplementHousing

  const employmentStatus = getValueViaPath(
    answers,
    'employment.status',
  ) as Employment

  const householdSupplementChildren = getValueViaPath(
    answers,
    'householdSupplement.children',
  ) as YesOrNo

  const rawEmployers = getValueViaPath(answers, 'employers', []) as Employer[]
  const employers = filterValidEmployers(rawEmployers)

  const childPensionSelectedCustodyKids = getValueViaPath(
    answers,
    'childPension.custodyKids',
    [],
  ) as []

  const childPensionAddChild = getValueViaPath(
    answers,
    'childPensionAddChild',
    YES,
  ) as YesOrNo

  const childPension = getValueViaPath(
    answers,
    'childPensionRepeater',
    [],
  ) as ChildPensionRow[]

  const bank = getValueViaPath(answers, 'paymentInfo.bank') as string

  const personalAllowance = getValueViaPath(
    answers,
    'paymentInfo.personalAllowance',
  ) as YesOrNo

  const personalAllowanceUsage = getValueViaPath(
    answers,
    'paymentInfo.personalAllowanceUsage',
  ) as string

  const spouseAllowance = getValueViaPath(
    answers,
    'paymentInfo.spouseAllowance',
  ) as YesOrNo

  const spouseAllowanceUsage = getValueViaPath(
    answers,
    'paymentInfo.spouseAllowanceUsage',
  ) as string

  const taxLevel = getValueViaPath(
    answers,
    'paymentInfo.taxLevel',
  ) as TaxLevelOptions

  const additionalAttachments = getValueViaPath(
    answers,
    'fileUploadAdditionalFiles.additionalDocuments',
  ) as FileType[]

  const pensionAttachments = getValueViaPath(
    answers,
    'fileUpload.pension',
  ) as FileType[]

  const fishermenAttachments = getValueViaPath(
    answers,
    'fileUpload.fishermen',
  ) as FileType[]

  const selfEmployedAttachments = getValueViaPath(
    answers,
    'employment.selfEmployedAttachment',
  ) as FileType[]

  const earlyRetirementAttachments = getValueViaPath(
    answers,
    'fileUpload.earlyRetirement',
  ) as FileType[]

  const leaseAgreementAttachments = getValueViaPath(
    answers,
    'fileUploadHouseholdSupplement.leaseAgreement',
  ) as FileType[]

  const schoolConfirmationAttachments = getValueViaPath(
    answers,
    'fileUploadHouseholdSupplement.schoolConfirmation',
  ) as FileType[]

  const maintenanceAttachments = getValueViaPath(
    answers,
    'fileUploadChildPension.maintenance',
  ) as FileType[]

  const notLivesWithApplicantAttachments = getValueViaPath(
    answers,
    'fileUploadChildPension.notLivesWithApplicant',
  ) as FileType[]

  const tempAnswers = getValueViaPath(
    answers,
    'tempAnswers',
  ) as Application['answers']

  return {
    pensionFundQuestion,
    applicationType,
    selectedYear,
    selectedMonth,
    applicantEmail,
    applicantPhonenumber,
    bank,
    residenceHistoryQuestion,
    onePaymentPerYear,
    comment,
    connectedApplications,
    householdSupplementHousing,
    householdSupplementChildren,
    employmentStatus,
    employers,
    rawEmployers,
    childPensionSelectedCustodyKids,
    childPensionAddChild,
    childPension,
    personalAllowance,
    spouseAllowance,
    personalAllowanceUsage,
    spouseAllowanceUsage,
    additionalAttachments,
    pensionAttachments,
    fishermenAttachments,
    selfEmployedAttachments,
    earlyRetirementAttachments,
    leaseAgreementAttachments,
    schoolConfirmationAttachments,
    maintenanceAttachments,
    notLivesWithApplicantAttachments,
    taxLevel,
    tempAnswers,
  }
}

export function getApplicationExternalData(
  externalData: Application['externalData'],
) {
  const residenceHistory = getValueViaPath(
    externalData,
    'nationalRegistryResidenceHistory.data',
    [],
  ) as NationalRegistryResidenceHistory[]

  const custodyInformation = getValueViaPath(
    externalData,
    'childrenCustodyInformation.data',
    [],
  ) as ApplicantChildCustodyInformation[]

  const cohabitants = getValueViaPath(
    externalData,
    'nationalRegistryCohabitants.data',
    [],
  ) as string[]

  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.fullName',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
  ) as string

  const applicantAddress = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.streetAddress',
  ) as string

  const applicantPostalCode = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.postalCode',
  ) as string

  const applicantLocality = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.locality',
  ) as string

  const applicantMunicipality = applicantPostalCode + ', ' + applicantLocality

  const hasSpouse = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data',
  ) as object

  const spouseName = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.name',
  ) as string

  const spouseNationalId = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.nationalId',
  ) as string

  const maritalStatus = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.maritalStatus',
  ) as string

  const bankInfo = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationApplicant.data.bankAccount',
  ) as BankInfo

  const isEligible = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationIsApplicantEligible.data.isEligible',
  ) as boolean

  return {
    residenceHistory,
    cohabitants,
    custodyInformation,
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantMunicipality,
    hasSpouse,
    spouseName,
    spouseNationalId,
    maritalStatus,
    isEligible,
    bankInfo,
  }
}

export function getStartDateAndEndDate(
  nationalId: string,
  applicationType: ApplicationType,
) {
  // Applicant could apply from the 1st of the month after his/her 65 birthday
  // Until 6 month ahead
  const today = new Date()
  const nationalIdInfo = kennitala.info(nationalId)
  const dateOfBirth = new Date(nationalIdInfo.birthday)
  const age = nationalIdInfo.age
  const thisYearBirthday = new Date(
    today.getFullYear(),
    dateOfBirth.getMonth(),
    dateOfBirth.getDay(),
  )

  const thisYearAge = thisYearBirthday > today ? age + 1 : age
  const thisYearBirthdayPlusOneMonth = addMonths(thisYearBirthday, 1)
  const nextMonth = addMonths(today, 1)

  // startDate is 1st day of the month after birhday this year
  let startDate = addDays(
    thisYearBirthdayPlusOneMonth,
    thisYearBirthdayPlusOneMonth.getDay() + 1,
  )
  const endDate = addMonths(today, 6) // þarf að spyrja hvort það sé +6 eða +7

  if (thisYearAge >= oldAgePensionAge) {
    // >= 67 year old
    startDate = addYears(
      thisYearBirthdayPlusOneMonth > nextMonth
        ? thisYearBirthdayPlusOneMonth
        : nextMonth,
      -2,
    )
  } else if (thisYearAge < fishermenMinAge) {
    // < 62 year old
    return {}
  } else if (applicationType === ApplicationType.SAILOR_PENSION) {
    // Fishermen
    if (thisYearAge === fishermenMinAge + 1) {
      // = 63 year old
      startDate = addYears(thisYearBirthdayPlusOneMonth, -1)
    } else if (thisYearAge > fishermenMinAge + 1) {
      // between 63 and 67
      startDate = addYears(
        thisYearBirthdayPlusOneMonth > nextMonth
          ? thisYearBirthdayPlusOneMonth
          : nextMonth,
        -2,
      )
    }
  } else {
    // not fishermen
    if (thisYearAge < earlyRetirementMinAge) {
      // < 65 year old
      return {}
    } else if (thisYearAge === earlyRetirementMinAge + 1) {
      // 66 year old
      startDate = addYears(thisYearBirthdayPlusOneMonth, -1)
    }
  }

  if (startDate > endDate) return {}

  return { startDate, endDate }
}

export function getAvailableYears(application: Application) {
  const { applicantNationalId } = getApplicationExternalData(
    application.externalData,
  )
  const { applicationType } = getApplicationAnswers(application.answers)

  if (!applicantNationalId) return []

  const { startDate, endDate } = getStartDateAndEndDate(
    applicantNationalId,
    applicationType,
  )
  if (!startDate || !endDate) return []

  const startDateYear = startDate.getFullYear()
  const endDateYear = endDate.getFullYear()

  return Array.from(Array(endDateYear - startDateYear + 1).keys()).map((x) => {
    const theYear = x + startDateYear
    return { value: theYear.toString(), label: theYear.toString() }
  })
}

export function getAvailableMonths(
  application: Application,
  selectedYear: string,
) {
  const { applicantNationalId } = getApplicationExternalData(
    application.externalData,
  )
  const { applicationType } = getApplicationAnswers(application.answers)

  if (!applicantNationalId) return []

  const { startDate, endDate } = getStartDateAndEndDate(
    applicantNationalId,
    applicationType,
  )
  if (!startDate || !endDate || !selectedYear) return []

  let months = MONTHS
  if (startDate.getFullYear().toString() === selectedYear) {
    months = months.slice(startDate.getMonth(), months.length + 1)
  } else if (endDate.getFullYear().toString() === selectedYear) {
    months = months.slice(0, endDate.getMonth() + 1)
  }

  return months
}

export function getAgeBetweenTwoDates(
  selectedDate: Date,
  dateOfBirth: Date,
): number {
  const diffTime = selectedDate.getTime() - dateOfBirth.getTime()
  const age = Math.abs(Math.floor(diffTime / (365.25 * 60 * 60 * 24 * 1000)))

  return age
}

export function isEarlyRetirement(
  answers: Application['answers'],
  externalData: Application['externalData'],
) {
  const { applicantNationalId } = getApplicationExternalData(externalData)
  const { selectedMonth, selectedYear, applicationType } =
    getApplicationAnswers(answers)

  if (!selectedMonth || !selectedYear) return false

  const dateOfBirth = kennitala.info(applicantNationalId).birthday
  const dateOfBirth00 = new Date(
    dateOfBirth.getFullYear(),
    dateOfBirth.getMonth(),
  )
  const selectedDate = new Date(
    +selectedYear,
    MONTHS.findIndex((x) => x.value === selectedMonth),
  )

  const age = getAgeBetweenTwoDates(selectedDate, dateOfBirth00)

  return (
    age >= earlyRetirementMinAge &&
    age <= earlyRetirementMaxAge &&
    applicationType !== ApplicationType.SAILOR_PENSION
  )
}

export function getAttachments(application: Application) {
  const getAttachmentDetails = (
    attachmentsArr: FileType[] | undefined,
    attachmentType: AttachmentTypes,
  ) => {
    if (attachmentsArr && attachmentsArr.length > 0) {
      attachments.push({
        attachments: attachmentsArr,
        label: AttachmentLabel[attachmentType],
      })
    }
  }

  const { answers, externalData } = application
  const {
    applicationType,
    householdSupplementChildren,
    householdSupplementHousing,
    connectedApplications,
    employmentStatus,
    childPension,
    childPensionAddChild,
  } = getApplicationAnswers(answers)
  const earlyRetirement = isEarlyRetirement(answers, externalData)
  const attachments: Attachments[] = []

  // Early retirement, pension fund, fishermen
  const fileUpload = answers.fileUpload as FileUpload

  getAttachmentDetails(fileUpload?.pension, AttachmentTypes.PENSION)
  if (earlyRetirement) {
    getAttachmentDetails(
      fileUpload?.earlyRetirement,
      AttachmentTypes.EARLY_RETIREMENT,
    )
  }
  if (applicationType === ApplicationType.SAILOR_PENSION) {
    getAttachmentDetails(fileUpload?.fishermen, AttachmentTypes.FISHERMAN)
  }

  // leaseAgreement, schoolAgreement
  const leaseAgrSchoolConf =
    answers.fileUploadHouseholdSupplement as LeaseAgreementSchoolConfirmation
  const isHouseholdSupplement = connectedApplications?.includes(
    ConnectedApplications.HOUSEHOLDSUPPLEMENT,
  )
  if (
    householdSupplementHousing === HouseholdSupplementHousing.RENTER &&
    isHouseholdSupplement
  ) {
    getAttachmentDetails(
      leaseAgrSchoolConf?.leaseAgreement,
      AttachmentTypes.LEASE_AGREEMENT,
    )
  }
  if (householdSupplementChildren === YES && isHouseholdSupplement) {
    getAttachmentDetails(
      leaseAgrSchoolConf?.schoolConfirmation,
      AttachmentTypes.SCHOOL_CONFIRMATION,
    )
  }

  // self-employed
  if (employmentStatus === Employment.SELFEMPLOYED) {
    const selfEmpoyed = answers.employment as SelfEmployed
    getAttachmentDetails(
      selfEmpoyed?.SelfEmployedAttachment,
      AttachmentTypes.SELF_EMPLOYED_ATTACHMENT,
    )
  }

  // child pension attachments
  const childPensionAttachments =
    answers.fileUploadChildPension as ChildPensionAttachments
  const isChildPension = connectedApplications?.includes(
    ConnectedApplications.CHILDPENSION,
  )

  if (
    childPension.length > 0 &&
    isChildPension &&
    childPensionAddChild !== NO
  ) {
    getAttachmentDetails(
      childPensionAttachments?.maintenance,
      AttachmentTypes.MAINTENANCE,
    )
  }

  if (childCustodyLivesWithApplicant(answers, externalData) && isChildPension) {
    getAttachmentDetails(
      childPensionAttachments?.childSupport,
      AttachmentTypes.CHILD_SUPPORT,
    )
  }

  const additionalInfo =
    answers.fileUploadAdditionalFiles as AdditionalInformation

  const additionalDocuments = [
    ...(additionalInfo.additionalDocuments &&
    additionalInfo.additionalDocuments?.length > 0
      ? additionalInfo.additionalDocuments
      : []),
    ...(additionalInfo.additionalDocumentsRequired &&
    additionalInfo.additionalDocumentsRequired?.length > 0
      ? additionalInfo.additionalDocumentsRequired
      : []),
  ]

  if (additionalDocuments.length > 0) {
    getAttachmentDetails(
      additionalDocuments,
      AttachmentTypes.ADDITIONAL_DOCUMENTS,
    )
  }

  return attachments
}

// return combine residence history if the applicant had domestic transport
export function getCombinedResidenceHistory(
  residenceHistory: NationalRegistryResidenceHistory[],
): CombinedResidenceHistory[] {
  const combinedResidenceHistory: CombinedResidenceHistory[] = []

  residenceHistory.forEach((history) => {
    if (combinedResidenceHistory.length === 0) {
      return combinedResidenceHistory.push(residenceMapper(history))
    }

    const priorResidence = combinedResidenceHistory.at(-1)

    if (priorResidence && priorResidence?.country !== history.country) {
      priorResidence.periodTo = history.dateOfChange ?? '-'

      return combinedResidenceHistory.push(residenceMapper(history))
    }
  })

  return [...combinedResidenceHistory].reverse()
}

export function getYesNOOptions() {
  const options: Option[] = [
    {
      value: YES,
      label: oldAgePensionFormMessage.shared.yes,
    },
    {
      value: NO,
      label: oldAgePensionFormMessage.shared.no,
    },
  ]

  return options
}

export function getTaxOptions() {
  const options: Option[] = [
    {
      value: TaxLevelOptions.INCOME,
      label: oldAgePensionFormMessage.payment.taxIncomeLevel,
    },
    {
      value: TaxLevelOptions.FIRST_LEVEL,
      label: oldAgePensionFormMessage.payment.taxFirstLevel,
    },
    {
      value: TaxLevelOptions.SECOND_LEVEL,
      label: oldAgePensionFormMessage.payment.taxSecondLevel,
    },
    {
      value: TaxLevelOptions.THIRD_LEVEL,
      label: oldAgePensionFormMessage.payment.taxThirdLevel,
    },
  ]

  return options
}

export function getChildPensionTitle(application: Application) {
  const { custodyInformation } = getApplicationExternalData(
    application.externalData,
  )

  return custodyInformation.length !== 0
    ? oldAgePensionFormMessage.connectedApplications.registerChildTitle
    : oldAgePensionFormMessage.connectedApplications.childPension
}

export function getChildPensionDescription(application: Application) {
  const { custodyInformation } = getApplicationExternalData(
    application.externalData,
  )

  return custodyInformation.length !== 0
    ? ''
    : oldAgePensionFormMessage.connectedApplications.childPensionDescription
}

export function isExistsCohabitantOlderThan25(
  externalData: Application['externalData'],
) {
  const { cohabitants, applicantNationalId } =
    getApplicationExternalData(externalData)

  let isOlderThan25 = false
  cohabitants.forEach((cohabitant) => {
    if (cohabitant !== applicantNationalId) {
      if (kennitala.info(cohabitant).age > 25) {
        isOlderThan25 = true
      }
    }
  })

  return isOlderThan25
}

export function isMoreThan2Year(answers: Application['answers']) {
  const { selectedMonth, selectedYear } = getApplicationAnswers(answers)
  const today = new Date()
  const startDate = addYears(today, -2)
  const selectedDate = new Date(selectedYear + selectedMonth)

  return startDate > selectedDate
}

function residenceMapper(
  history: NationalRegistryResidenceHistory,
): CombinedResidenceHistory {
  const residence = {} as CombinedResidenceHistory

  if (history.country && history.dateOfChange) {
    residence.country = history.country
    residence.periodFrom = history.dateOfChange
    residence.periodTo = '-'
  }

  return residence
}

// returns true if selected child DOES NOT live with applicant
export function childCustodyLivesWithApplicant(
  answers: Application['answers'],
  externalData: Application['externalData'],
) {
  let returnStatus = false
  const { childPensionSelectedCustodyKids } = getApplicationAnswers(answers)
  const { custodyInformation } = getApplicationExternalData(externalData)

  childPensionSelectedCustodyKids.map((i) =>
    custodyInformation.map((j) =>
      i === j.nationalId && !j.livesWithApplicant
        ? (returnStatus = true)
        : (returnStatus = false),
    ),
  )

  return returnStatus
}

interface IncompleteEmployer {
  email?: string
  phoneNumber?: string
  ratioType?: RatioType
  ratioYearly?: string
  ratioMonthlyAvg?: string
}

export const filterValidEmployers = (
  employers: (IncompleteEmployer | Employer)[],
): Employer[] => {
  const filtered = employers
    .map((employer, index) => ({
      ...employer,
      rawIndex: index,
    }))
    .filter((employer) => {
      const hasEmail = !!employer?.email
      const hasRatioType = !!employer?.ratioType
      const hasRatio = !!employer?.ratioYearly || !!employer?.ratioMonthlyAvg

      return hasEmail && hasRatioType && hasRatio
    })

  return filtered as Employer[]
}

export function isOver18AtDate(dob: Date, minDate: Date) {
  minDate.setFullYear(minDate.getFullYear() - 18)
  return minDate > dob
}

export const formatBankInfo = (bankInfo: string) => {
  const formattedBankInfo = bankInfo.replace(/[^0-9]/g, '')
  if (formattedBankInfo && formattedBankInfo.length === 12) {
    return formattedBankInfo
  }

  return bankInfo
}

export const getBank = (bankInfo?: BankInfo) => {
  return bankInfo?.bank && bankInfo?.ledger && bankInfo?.accountNumber
    ? bankInfo.bank + bankInfo.ledger + bankInfo.accountNumber
    : ''
}
