import { getValueViaPath } from '@island.is/application/core'
import { Application, YesOrNo } from '@island.is/application/types'
import { AttachmentLabel } from './constants'
import {
  FileType,
  Attachments,
  AdditionalInformation,
} from '@island.is/application/templates/social-insurance-administration-core/types'
import { ChildInformation } from '../types'
import {
  BankAccountType,
  TaxLevelOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  BankInfo,
  PaymentInfo,
} from '@island.is/application/templates/social-insurance-administration-core/types'
import addYears from 'date-fns/addYears'

enum AttachmentTypes {
  ADDITIONAL_DOCUMENTS = 'additionalDocuments',
}

export const getApplicationAnswers = (answers: Application['answers']) => {
  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicant.phoneNumber',
  ) as string

  const comment = getValueViaPath(answers, 'comment') as string

  const additionalAttachments = getValueViaPath(
    answers,
    'fileUploadAdditionalFiles.additionalDocuments',
  ) as FileType[]

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

  const additionalAttachmentsRequired = getValueViaPath(
    answers,
    'fileUploadAdditionalFilesRequired.additionalDocumentsRequired',
  ) as FileType[]

  const tempAnswers = getValueViaPath(
    answers,
    'tempAnswers',
  ) as Application['answers']

  const isExpectingChild = getValueViaPath(
    answers,
    'expectingChild.question',
  ) as YesOrNo

  return {
    applicantPhonenumber,
    comment,
    additionalAttachments,
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
    spouseAllowance,
    spouseAllowanceUsage,
    taxLevel,
    additionalAttachmentsRequired,
    tempAnswers,
    isExpectingChild,
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

  const userProfileEmail = getValueViaPath(
    externalData,
    'userProfile.data.email',
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

  const maritalStatus = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.maritalStatus',
  ) as string

  const lastModified = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.lastModified',
  ) as string

  const bankInfo = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationApplicant.data.bankAccount',
  ) as BankInfo

  const currencies = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationCurrencies.data',
  ) as Array<string>

  const children = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationChildren.data',
  ) as ChildInformation[]

  return {
    applicantName,
    applicantNationalId,
    userProfileEmail,
    applicantAddress,
    applicantMunicipality,
    hasSpouse,
    bankInfo,
    currencies,
    children,
    maritalStatus,
    lastModified,
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

export const hasSpouseLessThanAYear = (
  externalData: Application['externalData'],
) => {
  const { maritalStatus, lastModified } =
    getApplicationExternalData(externalData)
  const today = new Date()
  const oneYearAgo = addYears(today, -1)
  const statusLastModified = new Date(lastModified)

  if (maritalStatus === '3' && statusLastModified > oneYearAgo) {
    return true
  }
  return false
}
