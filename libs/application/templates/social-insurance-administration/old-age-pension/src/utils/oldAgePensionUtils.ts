import { getValueViaPath, YesOrNo } from '@island.is/application/core'
import {
  MONTHS,
  TaxLevelOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  Attachments,
  BankInfo,
  CategorizedIncomeTypes,
  FileType,
  IncomePlanConditions,
  IncomePlanRow,
  LatestIncomePlan,
  PaymentInfoNew,
} from '@island.is/application/templates/social-insurance-administration-core/types'
import {
  Application,
  NationalRegistryResidenceHistory,
  NationalRegistrySpouse,
} from '@island.is/application/types'
import addMonths from 'date-fns/addMonths'
import addYears from 'date-fns/addYears'
import * as kennitala from 'kennitala'
import {
  CombinedResidenceHistory,
  Employer,
  FileUpload,
  IncompleteEmployer,
  SelfEmployed,
} from './types'
import {
  ApplicationType,
  AttachmentLabel,
  AttachmentTypes,
  earlyRetirementMaxAge,
  earlyRetirementMinAge,
  Employment,
  oldAgePensionAge,
} from './constants'
import { oldAgePensionFormMessage } from '../lib/messages'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const pensionFundQuestion = getValueViaPath<YesOrNo>(
    answers,
    'questions.pensionFund',
  )

  const applicationType =
    getValueViaPath<ApplicationType>(answers, 'applicationType.option') ??
    ApplicationType.OLD_AGE_PENSION

  const selectedYear = getValueViaPath<string>(answers, 'period.year') ?? ''

  const selectedMonth = getValueViaPath<string>(answers, 'period.month') ?? ''

  const selectedYearHiddenInput = getValueViaPath<string>(
    answers,
    'period.hiddenInput',
  )

  const applicantPhonenumber =
    getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? ''

  // If foreign residence is found then this is always true
  const residenceHistoryQuestion = getValueViaPath<YesOrNo>(
    answers,
    'residenceHistory.question',
  )

  const onePaymentPerYear = getValueViaPath<YesOrNo>(
    answers,
    'onePaymentPerYear.question',
  )

  const comment = getValueViaPath<string>(answers, 'comment')

  const employmentStatus = getValueViaPath<Employment>(
    answers,
    'employment.status',
  )

  const rawEmployers = getValueViaPath<Employer[]>(answers, 'employers') ?? []
  const employers = filterValidEmployers(rawEmployers)

  const personalAllowance = getValueViaPath<YesOrNo>(
    answers,
    'paymentInfo.personalAllowance',
  )

  const personalAllowanceUsage =
    getValueViaPath<string>(answers, 'paymentInfo.personalAllowanceUsage') ?? ''

  const taxLevel =
    getValueViaPath<TaxLevelOptions>(answers, 'paymentInfo.taxLevel') ??
    TaxLevelOptions.INCOME

  const additionalAttachments =
    getValueViaPath<FileType[]>(
      answers,
      'fileUploadAdditionalFiles.additionalDocuments',
    ) ?? []

  const additionalAttachmentsRequired =
    getValueViaPath<FileType[]>(
      answers,
      'fileUploadAdditionalFilesRequired.additionalDocumentsRequired',
    ) ?? []

  const pensionAttachments =
    getValueViaPath<FileType[]>(answers, 'fileUpload.pension') ?? []

  const fishermenAttachments =
    getValueViaPath<FileType[]>(answers, 'fileUpload.fishermen') ?? []

  const selfEmployedAttachments =
    getValueViaPath<FileType[]>(answers, 'employment.selfEmployedAttachment') ??
    []

  const earlyRetirementAttachments =
    getValueViaPath<FileType[]>(answers, 'fileUpload.earlyRetirement') ?? []

  const tempAnswers = getValueViaPath<Application['answers']>(
    answers,
    'tempAnswers',
  )

  const paymentInfo = getValueViaPath<PaymentInfoNew>(answers, 'paymentInfo')

  const incomePlan =
    getValueViaPath<IncomePlanRow[]>(answers, 'incomePlanTable') ?? []

  const noOtherIncomeConfirmation = getValueViaPath<YesOrNo>(
    answers,
    'incomePlan.noOtherIncomeConfirmation',
  )

  return {
    pensionFundQuestion,
    applicationType,
    selectedYear,
    selectedMonth,
    selectedYearHiddenInput,
    applicantPhonenumber,
    residenceHistoryQuestion,
    onePaymentPerYear,
    comment,
    employmentStatus,
    employers,
    rawEmployers,
    personalAllowance,
    personalAllowanceUsage,
    additionalAttachments,
    additionalAttachmentsRequired,
    pensionAttachments,
    fishermenAttachments,
    selfEmployedAttachments,
    earlyRetirementAttachments,
    taxLevel,
    tempAnswers,
    paymentInfo,
    incomePlan,
    noOtherIncomeConfirmation,
  }
}

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const residenceHistory =
    getValueViaPath<NationalRegistryResidenceHistory[]>(
      externalData,
      'nationalRegistryResidenceHistory.data',
      [],
    ) ?? []

  const applicantName =
    getValueViaPath<string>(externalData, 'nationalRegistry.data.fullName') ??
    ''

  const applicantNationalId =
    getValueViaPath<string>(externalData, 'nationalRegistry.data.nationalId') ??
    ''

  const applicantAddress = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.address.streetAddress',
  )

  const applicantPostalCode = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.address.postalCode',
  )

  const applicantLocality = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.address.locality',
  )

  const applicantMunicipality = applicantPostalCode + ', ' + applicantLocality

  const hasSpouse = getValueViaPath<NationalRegistrySpouse>(
    externalData,
    'nationalRegistrySpouse.data',
  )

  const bankInfo =
    getValueViaPath<BankInfo>(
      externalData,
      'socialInsuranceAdministrationApplicant.data.bankAccount',
    ) ?? ({} as BankInfo)

  const userProfileEmail =
    getValueViaPath<string>(externalData, 'userProfile.data.email') ?? ''

  const userProfilePhoneNumber = getValueViaPath<string>(
    externalData,
    'userProfile.data.mobilePhoneNumber',
  )

  const isEligible =
    getValueViaPath<boolean>(
      externalData,
      'socialInsuranceAdministrationIsApplicantEligible.data.isEligible',
    ) ?? false

  const currencies =
    getValueViaPath<Array<string>>(
      externalData,
      'socialInsuranceAdministrationCurrencies.data',
    ) ?? []

  const latestIncomePlan = getValueViaPath<LatestIncomePlan>(
    externalData,
    'socialInsuranceAdministrationLatestIncomePlan.data',
  )

  const incomePlanConditions = getValueViaPath<IncomePlanConditions>(
    externalData,
    'socialInsuranceAdministrationIncomePlanConditions.data',
  )

  const categorizedIncomeTypes =
    getValueViaPath<CategorizedIncomeTypes[]>(
      externalData,
      'socialInsuranceAdministrationCategorizedIncomeTypes.data',
    ) ?? []

  return {
    residenceHistory,
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantMunicipality,
    hasSpouse,
    isEligible,
    bankInfo,
    currencies,
    userProfileEmail,
    userProfilePhoneNumber,
    latestIncomePlan,
    incomePlanConditions,
    categorizedIncomeTypes,
  }
}

export const getStartDateAndEndDate = (
  nationalId: string,
  applicationType: ApplicationType,
) => {
  // lowest startdate for old-age pensioner is month after their 65 birthday (60 birthday if sailor pensioner),
  // or two years back from month after their birthday.
  // and 6 month ahead
  const nationalIdInfo = kennitala.info(nationalId)
  const dateOfBirth = new Date(nationalIdInfo.birthday)
  const age = nationalIdInfo.age
  const today = new Date()
  const thisYearBirthday = new Date(
    today.getFullYear(),
    dateOfBirth.getMonth(),
    dateOfBirth.getDate(),
  )
  const thisYearAge = thisYearBirthday > today ? age + 1 : age
  const nextMonth = addMonths(today, 1)
  const thisYearBirthdayPlusOneMonth = addMonths(thisYearBirthday, 1)
  const endDate = addMonths(today, 6)

  const yearsBack =
    applicationType === ApplicationType.SAILOR_PENSION
      ? thisYearAge >= 62
        ? -2
        : thisYearAge === 61
        ? -1
        : 0
      : thisYearAge >= oldAgePensionAge
      ? -2
      : thisYearAge === earlyRetirementMaxAge
      ? -1
      : 0

  // lowest start date from month after birthday, this date is used if applicant is < 67 (or < 62)
  const lowestStartDate = addYears(thisYearBirthdayPlusOneMonth, yearsBack)
  // lowest start date from next month, f.ex used if applicant is >= 67 (or >= 62 for sailor)
  const lowestDate = addYears(nextMonth, yearsBack)

  const startDate =
    applicationType === ApplicationType.SAILOR_PENSION
      ? thisYearAge >= 62
        ? lowestDate
        : lowestStartDate
      : thisYearAge >= 67
      ? lowestDate
      : lowestStartDate

  if (startDate > endDate) return {}

  return { startDate, endDate }
}

export const getAvailableYears = (application: Application) => {
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

export const getAvailableMonths = (
  application: Application,
  selectedYear: string,
) => {
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

export const getAgeBetweenTwoDates = (
  selectedDate: Date,
  dateOfBirth: Date,
): number => {
  const diffTime = selectedDate.getTime() - dateOfBirth.getTime()
  const age = Math.abs(Math.floor(diffTime / (365.25 * 60 * 60 * 24 * 1000)))

  return age
}

export const isEarlyRetirement = (
  answers: Application['answers'],
  externalData: Application['externalData'],
) => {
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

export const getAttachments = (application: Application) => {
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
    employmentStatus,
    additionalAttachments,
    additionalAttachmentsRequired,
  } = getApplicationAnswers(answers)
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
      selfEmpoyed?.selfEmployedAttachment,
      AttachmentTypes.SELF_EMPLOYED_ATTACHMENT,
    )
  }

  const additionalDocuments = [
    ...(additionalAttachments && additionalAttachments?.length > 0
      ? additionalAttachments
      : []),
    ...(additionalAttachmentsRequired &&
    additionalAttachmentsRequired?.length > 0
      ? additionalAttachmentsRequired
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
export const getCombinedResidenceHistory = (
  residenceHistory: NationalRegistryResidenceHistory[],
): CombinedResidenceHistory[] => {
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

export const isMoreThan2Year = (answers: Application['answers']) => {
  const { selectedMonth, selectedYear } = getApplicationAnswers(answers)

  if (!selectedMonth || !selectedYear) return false

  const today = new Date()
  const startDate = addYears(today, -2)
  const selectedDate = new Date(selectedYear + selectedMonth)

  return startDate > selectedDate
}

const residenceMapper = (
  history: NationalRegistryResidenceHistory,
): CombinedResidenceHistory => {
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

export const getEligibleDesc = (application: Application) => {
  const { applicationType } = getApplicationAnswers(application.answers)

  return applicationType === ApplicationType.OLD_AGE_PENSION
    ? oldAgePensionFormMessage.pre.isNotEligibleDescription
    : applicationType === ApplicationType.HALF_OLD_AGE_PENSION
    ? oldAgePensionFormMessage.pre.isNotEligibleHalfDescription
    : oldAgePensionFormMessage.pre.isNotEligibleSailorDescription
}

export const getEligibleLabel = (application: Application) => {
  const { applicationType } = getApplicationAnswers(application.answers)

  return applicationType === ApplicationType.OLD_AGE_PENSION
    ? oldAgePensionFormMessage.pre.isNotEligibleLabel
    : applicationType === ApplicationType.HALF_OLD_AGE_PENSION
    ? oldAgePensionFormMessage.pre.isNotEligibleHalfLabel
    : oldAgePensionFormMessage.pre.isNotEligibleSailorLabel
}

export const determineNameFromApplicationAnswers = (
  application: Application,
) => {
  const { applicationType } = getApplicationAnswers(application.answers)

  return applicationType === ApplicationType.HALF_OLD_AGE_PENSION
    ? oldAgePensionFormMessage.pre.halfRetirementPensionApplicationTitle
    : applicationType === ApplicationType.SAILOR_PENSION
    ? oldAgePensionFormMessage.pre.fishermenApplicationTitle
    : oldAgePensionFormMessage.shared.applicationTitle
}
