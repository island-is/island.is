import { getValueViaPath, YES, YesOrNo } from '@island.is/application/core'
import { MONTHS } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  Attachments,
  BankInfo,
  Eligible,
  FileType,
  PaymentInfo,
} from '@island.is/application/templates/social-insurance-administration-core/types'
import { Application, ExternalData } from '@island.is/application/types'
import addMonths from 'date-fns/addMonths'
import subYears from 'date-fns/subYears'
import * as kennitala from 'kennitala'
import { FileUpload } from '../types'
import { AttachmentLabel, AttachmentTypes } from './constants'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicantInfo.phonenumber',
  ) as string

  const householdSupplementChildren = getValueViaPath(
    answers,
    'householdSupplement.children',
  ) as YesOrNo

  const schoolConfirmationAttachments = getValueViaPath(
    answers,
    'fileUpload.schoolConfirmation',
  ) as FileType[]

  const selectedYear = getValueViaPath(answers, 'period.year') as string

  const selectedMonth = getValueViaPath(answers, 'period.month') as string

  const selectedYearHiddenInput = getValueViaPath(
    answers,
    'period.hiddenInput',
  ) as string

  const additionalAttachments = getValueViaPath(
    answers,
    'fileUploadAdditionalFiles.additionalDocuments',
  ) as FileType[]

  const additionalAttachmentsRequired = getValueViaPath(
    answers,
    'fileUploadAdditionalFilesRequired.additionalDocumentsRequired',
  ) as FileType[]

  const comment = getValueViaPath(answers, 'comment') as string

  const bank = getValueViaPath(answers, 'paymentInfo.bank') as string

  const paymentInfo = getValueViaPath(answers, 'paymentInfo') as PaymentInfo

  const tempAnswers = getValueViaPath(
    answers,
    'tempAnswers',
  ) as Application['answers']

  return {
    applicantPhonenumber,
    householdSupplementChildren,
    schoolConfirmationAttachments,
    selectedYear,
    selectedMonth,
    selectedYearHiddenInput,
    additionalAttachments,
    additionalAttachmentsRequired,
    comment,
    bank,
    paymentInfo,
    tempAnswers,
  }
}

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
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

  const bankInfo = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationApplicant.data.bankAccount',
  ) as BankInfo

  const userProfileEmail = getValueViaPath(
    externalData,
    'userProfile.data.email',
  ) as string

  const userProfilePhoneNumber = getValueViaPath(
    externalData,
    'userProfile.data.mobilePhoneNumber',
  ) as string

  const eligible = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationIsApplicantEligible.data',
  ) as Eligible

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

  const hasSpouse = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data',
  ) as object

  return {
    cohabitants,
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantPostalCode,
    applicantLocality,
    applicantMunicipality,
    bankInfo,
    userProfileEmail,
    userProfilePhoneNumber,
    eligible,
    spouseName,
    spouseNationalId,
    maritalStatus,
    hasSpouse,
  }
}

export const isExistsCohabitantOlderThan25 = (
  externalData: Application['externalData'],
) => {
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

export const isExistsCohabitantBetween18and25 = (
  externalData: Application['externalData'],
) => {
  const { cohabitants, applicantNationalId } =
    getApplicationExternalData(externalData)

  let isBetween18and25 = false
  cohabitants.forEach((cohabitant) => {
    if (cohabitant !== applicantNationalId) {
      if (
        kennitala.info(cohabitant).age >= 18 &&
        kennitala.info(cohabitant).age <= 25
      ) {
        isBetween18and25 = true
      }
    }
  })

  return isBetween18and25
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
    householdSupplementChildren,
    additionalAttachments,
    additionalAttachmentsRequired,
  } = getApplicationAnswers(answers)
  const attachments: Attachments[] = []

  const fileUpload = answers.fileUpload as FileUpload

  if (householdSupplementChildren === YES) {
    getAttachmentDetails(
      fileUpload?.schoolConfirmation,
      AttachmentTypes.SCHOOL_CONFIRMATION,
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

// returns available years. Available period is
// 2 years back in time and 6 months in the future.
export const getAvailableYears = () => {
  const today = new Date()
  const twoYearsBackInTime = subYears(
    today.setMonth(today.getMonth() + 1),
    2,
  ).getFullYear()
  const sixMonthsInTheFuture = addMonths(new Date(), 6).getFullYear()

  return Array.from(
    Array(sixMonthsInTheFuture - (twoYearsBackInTime - 1)),
    (_, i) => {
      return {
        value: (i + twoYearsBackInTime).toString(),
        label: (i + twoYearsBackInTime).toString(),
      }
    },
  )
}

// returns available months for selected year, since available period is
// 2 years back in time and 6 months in the future.
export const getAvailableMonths = (selectedYear: string) => {
  if (!selectedYear) return []

  const twoYearsBackInTime = subYears(new Date(), 2)
  const sixMonthsInTheFuture = addMonths(new Date(), 6)

  let months = MONTHS
  if (twoYearsBackInTime.getFullYear().toString() === selectedYear) {
    months = months.slice(twoYearsBackInTime.getMonth() + 1, months.length)
  } else if (sixMonthsInTheFuture.getFullYear().toString() === selectedYear) {
    months = months.slice(0, sixMonthsInTheFuture.getMonth() + 1)
  }

  return months
}

export const eligible = (externalData: ExternalData): boolean => {
  const { eligible } = getApplicationExternalData(externalData)

  return eligible?.isEligible
}
