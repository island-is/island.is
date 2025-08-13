import { getValueViaPath, YesOrNo } from '@island.is/application/core'
import {
  MONTHS,
  TaxLevelOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  Attachments,
  BankInfo,
  Eligible,
  FileType,
  PaymentInfo,
} from '@island.is/application/templates/social-insurance-administration-core/types'
import { Application, ExternalData } from '@island.is/application/types'
import addMonths from 'date-fns/addMonths'
import subMonths from 'date-fns/subMonths'
import { AttachmentLabel, AttachmentTypes } from './constants'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const selectedYear = getValueViaPath(answers, 'period.year') as string

  const selectedMonth = getValueViaPath(answers, 'period.month') as string

  const selectedYearHiddenInput = getValueViaPath(
    answers,
    'period.hiddenInput',
  ) as string

  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicant.phoneNumber',
  ) as string

  const comment = getValueViaPath(answers, 'comment') as string

  const additionalAttachments = getValueViaPath(
    answers,
    'fileUploadAdditionalFiles.additionalDocuments',
  ) as FileType[]

  const additionalAttachmentsRequired = getValueViaPath(
    answers,
    'fileUploadAdditionalFilesRequired.additionalDocumentsRequired',
  ) as FileType[]

  const tempAnswers = getValueViaPath(
    answers,
    'tempAnswers',
  ) as Application['answers']
  const bank = getValueViaPath(answers, 'paymentInfo.bank') as string

  const paymentInfo = getValueViaPath(answers, 'paymentInfo') as PaymentInfo

  const personalAllowance = getValueViaPath(
    answers,
    'paymentInfo.personalAllowance',
  ) as YesOrNo

  const personalAllowanceUsage = getValueViaPath(
    answers,
    'paymentInfo.personalAllowanceUsage',
  ) as string

  const taxLevel = getValueViaPath(
    answers,
    'paymentInfo.taxLevel',
  ) as TaxLevelOptions

  const higherPayments = getValueViaPath(
    answers,
    'higherPayments.question',
  ) as YesOrNo

  return {
    applicantPhonenumber,
    selectedYear,
    selectedMonth,
    selectedYearHiddenInput,
    comment,
    additionalAttachments,
    additionalAttachmentsRequired,
    tempAnswers,
    bank,
    paymentInfo,
    personalAllowance,
    personalAllowanceUsage,
    taxLevel,
    higherPayments,
  }
}

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
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

  const bankInfo = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationApplicant.data.bankAccount',
  ) as BankInfo

  const userProfileEmail = getValueViaPath(
    externalData,
    'userProfile.data.email',
  ) as string

  const isEligible = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationIsApplicantEligible.data',
  ) as Eligible

  const cohabitants = getValueViaPath(
    externalData,
    'nationalRegistryCohabitants.data',
    [],
  ) as string[]

  return {
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantMunicipality,
    hasSpouse,
    userProfileEmail,
    bankInfo,
    isEligible,
    cohabitants,
  }
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

  const { answers } = application

  const { additionalAttachments, additionalAttachmentsRequired } =
    getApplicationAnswers(answers)
  const attachments: Attachments[] = []

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

export const hasNoCohabitants = (application: Application) => {
  const { cohabitants } = getApplicationExternalData(application.externalData)
  return cohabitants.length === 0
}

// returns available years. Available period is
// 3 months back in time and 6 months in the future.
export const getAvailableYears = () => {
  const threeMonthsBackInTime = subMonths(new Date(), 3).getFullYear()
  const sixMonthsInTheFuture = addMonths(new Date(), 6).getFullYear()

  return Array.from(
    Array(sixMonthsInTheFuture - (threeMonthsBackInTime - 1)),
    (_, i) => {
      return {
        value: (i + threeMonthsBackInTime).toString(),
        label: (i + threeMonthsBackInTime).toString(),
      }
    },
  )
}

// returns available months for selected year, since available period is
// 3 months back in time and 6 months in the future.
export const getAvailableMonths = (selectedYear: string) => {
  if (!selectedYear) return []

  const threeMonthsBackInTime = subMonths(new Date(), 3)
  const sixMonthsInTheFuture = addMonths(new Date(), 6)

  let months = MONTHS
  if (threeMonthsBackInTime.getFullYear().toString() === selectedYear) {
    months = months.slice(threeMonthsBackInTime.getMonth() + 1, months.length)
  } else if (sixMonthsInTheFuture.getFullYear().toString() === selectedYear) {
    months = months.slice(0, sixMonthsInTheFuture.getMonth() + 1)
  }

  return months
}

export const isEligible = (externalData: ExternalData): boolean => {
  const { isEligible } = getApplicationExternalData(externalData)

  return isEligible?.isEligible
}
