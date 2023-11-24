import { getValueViaPath } from '@island.is/application/core'
import {
  oldAgePensionAge,
  YES,
  fishermenMinAge,
  earlyRetirementMinAge,
  earlyRetirementMaxAge,
  NO,
  ApplicationType,
  Employment,
  TaxLevelOptions,
  MONTHS,
  AttachmentLabel,
  BankAccountType,
} from './constants'
import {
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
  IncompleteEmployer,
  FileType,
  SelfEmployed,
  AdditionalInformation,
  FileUpload,
  Attachments,
} from '../types'
import { getBankIsk } from '@island.is/application/templates/social-insurance-administration-core/socialInsuranceAdministrationUtils'
import { BankInfo } from '@island.is/application/templates/social-insurance-administration-core/types'

enum AttachmentTypes {
  PENSION = 'pension',
  EARLY_RETIREMENT = 'earlyRetirement',
  FISHERMAN = 'fishermen',
  SELF_EMPLOYED_ATTACHMENT = 'SelfEmployedAttachment',
  ADDITIONAL_DOCUMENTS = 'additionalDocuments',
  FOREIGN_BANK_ACCOUNT = 'foreignBankAccount',
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

  const employmentStatus = getValueViaPath(
    answers,
    'employment.status',
  ) as Employment

  const rawEmployers = getValueViaPath(answers, 'employers', []) as Employer[]
  const employers = filterValidEmployers(rawEmployers)

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

  const additionalAttachmentsRequired = getValueViaPath(
    answers,
    'fileUploadAdditionalFiles.additionalDocumentsRequired',
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

  const bankAccountType = getValueViaPath(
    answers,
    'paymentInfo.bankAccountInfo.bankAccountType',
  ) as BankAccountType

  const bank = getValueViaPath(
    answers,
    'paymentInfo.bankAccountInfo.bank',
  ) as string

  const iban = getValueViaPath(
    answers,
    'paymentInfo.bankAccountInfo.iban',
  ) as string

  const swift = getValueViaPath(
    answers,
    'paymentInfo.bankAccountInfo.swift',
  ) as string

  const bankName = getValueViaPath(
    answers,
    'paymentInfo.bankAccountInfo.bankName',
  ) as string

  const bankAddress = getValueViaPath(
    answers,
    'paymentInfo.bankAccountInfo.bankAddress',
  ) as string

  const currency = getValueViaPath(
    answers,
    'paymentInfo.bankAccountInfo.currency',
  ) as string

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
    employmentStatus,
    employers,
    rawEmployers,
    personalAllowance,
    spouseAllowance,
    personalAllowanceUsage,
    spouseAllowanceUsage,
    additionalAttachments,
    additionalAttachmentsRequired,
    pensionAttachments,
    fishermenAttachments,
    selfEmployedAttachments,
    earlyRetirementAttachments,
    taxLevel,
    bankAccountType,
    iban,
    swift,
    bankName,
    bankAddress,
    currency,
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

  const currencies = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationCurrencies.data',
  ) as Array<string>

  return {
    residenceHistory,
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
    currencies,
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
  const { applicationType, employmentStatus } = getApplicationAnswers(answers)
  const earlyRetirement = isEarlyRetirement(answers, externalData)
  const attachments: Attachments[] = []

  // Early retirement, pension fund, fishermen, foreign bank account
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

  // self-employed
  if (employmentStatus === Employment.SELFEMPLOYED) {
    const selfEmpoyed = answers.employment as SelfEmployed
    getAttachmentDetails(
      selfEmpoyed?.SelfEmployedAttachment,
      AttachmentTypes.SELF_EMPLOYED_ATTACHMENT,
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

export const formatBank = (bankInfo: string) => {
  return bankInfo.replace(/^(.{4})(.{2})/, '$1-$2-')
}

// We should only send bank account to TR if applicant is registering
// new one or changing.
export const shouldNotUpdateBankAccount = (
  answers: Application['answers'],
  externalData: Application['externalData'],
) => {
  const { bankInfo } = getApplicationExternalData(externalData)
  const {
    bankAccountType,
    bank,
    iban,
    swift,
    bankName,
    bankAddress,
    currency,
  } = getApplicationAnswers(answers)

  if (bankAccountType === BankAccountType.ICELANDIC) {
    return getBankIsk(bankInfo) === bank ?? false
  } else {
    return (
      bankInfo.iban === iban &&
      bankInfo.swift === swift &&
      bankInfo.foreignBankName === bankName &&
      bankInfo.foreignBankAddress === bankAddress &&
      bankInfo.currency === currency
    )
  }
}
