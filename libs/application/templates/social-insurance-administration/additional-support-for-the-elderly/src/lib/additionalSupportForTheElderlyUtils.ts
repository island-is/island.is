import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  YesOrNo,
} from '@island.is/application/types'
import addMonths from 'date-fns/addMonths'
import subMonths from 'date-fns/subMonths'
import { AttachmentLabel, AttachmentTypes } from './constants'
import {
  FileType,
  Attachments,
  AdditionalInformation,
  BankInfo,
  PaymentInfo,
} from '@island.is/application/templates/social-insurance-administration-core/types'
import {
  BankAccountType,
  TaxLevelOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'

export function getApplicationAnswers(answers: Application['answers']) {
  const selectedYear = getValueViaPath(answers, 'period.year') as string

  const selectedMonth = getValueViaPath(answers, 'period.month') as string
  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicantInfo.phonenumber',
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

  const bankAccountType = getValueViaPath(
    answers,
    'paymentInfo.bankAccountType',
  ) as BankAccountType

  const bank = getValueViaPath(answers, 'paymentInfo.bank') as string

  const iban = getValueViaPath(answers, 'paymentInfo.iban') as string

  const swift = getValueViaPath(answers, 'paymentInfo.swift') as string

  const bankName = getValueViaPath(answers, 'paymentInfo.bankName') as string

  const bankAddress = getValueViaPath(
    answers,
    'paymentInfo.bankAddress',
  ) as string

  const currency = getValueViaPath(answers, 'paymentInfo.currency') as string

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

  return {
    applicantPhonenumber,
    selectedYear,
    selectedMonth,
    comment,
    additionalAttachments,
    additionalAttachmentsRequired,
    tempAnswers,
    bankAccountType,
    bank,
    iban,
    swift,
    bankName,
    bankAddress,
    currency,
    paymentInfo,
    personalAllowance,
    personalAllowanceUsage,
    taxLevel,
  }
}

export function getApplicationExternalData(
  externalData: Application['externalData'],
) {
  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.fullName',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
  ) as string

  const hasSpouse = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data',
  ) as object

  const email = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationApplicant.data.emailAddress',
  ) as string

  const bankInfo = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationApplicant.data.bankAccount',
  ) as BankInfo

  const currencies = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationCurrencies.data',
  ) as Array<string>

  const isEligible = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationIsApplicantEligible.data.isEligible',
  ) as boolean

  return {
    applicantName,
    applicantNationalId,
    hasSpouse,
    email,
    bankInfo,
    currencies,
    isEligible,
  }
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

  const { answers } = application

  const attachments: Attachments[] = []

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

// returns available years. Available period is
// 3 months back in time and 6 months in the future.
export function getAvailableYears() {
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

export const isEligible = (externalData: ExternalData): boolean => {
  const { isEligible } = getApplicationExternalData(externalData)

  return isEligible
}
