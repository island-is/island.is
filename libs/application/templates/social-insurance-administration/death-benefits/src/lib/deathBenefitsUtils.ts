import { getValueViaPath, YES, YesOrNo } from '@island.is/application/core'
import { Application, ExternalData } from '@island.is/application/types'
import { AttachmentLabel } from './constants'
import {
  FileType,
  Attachments,
} from '@island.is/application/templates/social-insurance-administration-core/types'
import { ChildInformation, FileUpload } from '../types'
import {
  BankAccountType,
  TaxLevelOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  BankInfo,
  PaymentInfo,
} from '@island.is/application/templates/social-insurance-administration-core/types'

enum AttachmentTypes {
  ADDITIONAL_DOCUMENTS = 'additionalDocuments',
  EXPECTING_CHILD = 'expectingChild',
  DEATH_CERTIFICATE = 'deathCertificate',
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

  const expectingChildAttachments = getValueViaPath(
    answers,
    'fileUpload.expectingChild',
  ) as FileType[]

  const deathCertificateAttachments = getValueViaPath(
    answers,
    'fileUpload.deathCertificate',
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

  const deceasedSpouseName = getValueViaPath(
    answers,
    'deceasedSpouseInfo.name',
  ) as string

  const deceasedSpouseNationalId = getValueViaPath(
    answers,
    'deceasedSpouseInfo.nationalId',
  ) as string

  const deceasedSpouseDateOfDeath = getValueViaPath(
    answers,
    'deceasedSpouseInfo.date',
  ) as Date

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
    expectingChildAttachments,
    deathCertificateAttachments,
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
    deceasedSpouseName,
    deceasedSpouseNationalId,
    deceasedSpouseDateOfDeath,
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

  const isEligible = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationIsApplicantEligible.data.isEligible',
  ) as boolean

  const deceasedSpouse = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationSpousalInfo.data.name',
  ) as object

  const deceasedSpouseName = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationSpousalInfo.data.name',
  ) as string

  const deceasedSpouseNationalId = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationSpousalInfo.data.nationalId',
  ) as string

  const deceasedSpouseDateOfDeath = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationSpousalInfo.data.dateOfDeath',
  ) as Date

  const deceasedSpouseCohabitationLongerThan1Year = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationSpousalInfo.data.cohabitadedLongerThan1Year',
  ) as boolean

  return {
    applicantName,
    applicantNationalId,
    userProfileEmail,
    applicantAddress,
    applicantMunicipality,
    bankInfo,
    currencies,
    children,
    isEligible,
    deceasedSpouse,
    deceasedSpouseName,
    deceasedSpouseNationalId,
    deceasedSpouseDateOfDeath,
    deceasedSpouseCohabitationLongerThan1Year,
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

  const {
    isExpectingChild,
    deathCertificateAttachments,
    additionalAttachments,
    additionalAttachmentsRequired,
  } = getApplicationAnswers(answers)

  const attachments: Attachments[] = []

  const fileUpload = answers.fileUpload as FileUpload

  if (deathCertificateAttachments && deathCertificateAttachments?.length > 0) {
    getAttachmentDetails(
      fileUpload?.deathCertificate,
      AttachmentTypes.DEATH_CERTIFICATE,
    )
  }

  if (isExpectingChild === YES) {
    getAttachmentDetails(
      fileUpload?.expectingChild,
      AttachmentTypes.EXPECTING_CHILD,
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

export const getChildren = (externalData: ExternalData) => {
  const { children } = getApplicationExternalData(externalData)
  return children
}

export const isEligible = (externalData: ExternalData): boolean => {
  const { isEligible } = getApplicationExternalData(externalData)
  return isEligible
}
