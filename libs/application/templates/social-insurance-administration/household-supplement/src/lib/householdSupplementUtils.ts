import { getValueViaPath } from '@island.is/application/core'
import {
  HouseholdSupplementHousing,
  YES,
  NO,
  AttachmentLabel,
  MONTHS,
} from './constants'
import { Option, Application, YesOrNo } from '@island.is/application/types'
import { householdSupplementFormMessage } from './messages'
import addMonths from 'date-fns/addMonths'
import subYears from 'date-fns/subYears'
import * as kennitala from 'kennitala'
import {
  AdditionalInformation,
  Attachments,
  FileType,
  FileUpload,
} from '../types'

enum AttachmentTypes {
  LEASE_AGREEMENT = 'leaseAgreement',
  SCHOOL_CONFIRMATION = 'schoolConfirmation',
  ADDITIONAL_DOCUMENTS = 'additionalDocuments',
}

export function getApplicationAnswers(answers: Application['answers']) {
  const applicantEmail = getValueViaPath(
    answers,
    'applicantInfo.email',
  ) as string

  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicantInfo.phonenumber',
  ) as string

  const bank = getValueViaPath(answers, 'paymentInfo.bank') as string

  const householdSupplementHousing = getValueViaPath(
    answers,
    'householdSupplement.housing',
  ) as HouseholdSupplementHousing

  const householdSupplementChildren = getValueViaPath(
    answers,
    'householdSupplement.children',
  ) as YesOrNo

  const selectedYear = getValueViaPath(answers, 'period.year') as string

  const selectedMonth = getValueViaPath(answers, 'period.month') as string

  const additionalAttachments = getValueViaPath(
    answers,
    'fileUploadAdditionalFiles.additionalDocuments',
  ) as FileType[]

  const additionalAttachmentsRequired = getValueViaPath(
    answers,
    'fileUploadAdditionalFiles.additionalDocumentsRequired',
  ) as FileType[]

  const comment = getValueViaPath(answers, 'comment') as string
  console.log('additionalAttachments: ', additionalAttachments)
  console.log('additionalAttachmentsRequired: ', additionalAttachmentsRequired)

  return {
    applicantEmail,
    applicantPhonenumber,
    householdSupplementHousing,
    householdSupplementChildren,
    bank,
    selectedYear,
    selectedMonth,
    additionalAttachments,
    additionalAttachmentsRequired,
    comment,
  }
}

export function getApplicationExternalData(
  externalData: Application['externalData'],
) {
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

  const bank = getValueViaPath(
    externalData,
    'userProfile.data.bankInfo',
  ) as string

  return {
    cohabitants,
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantMunicipality,
    hasSpouse,
    spouseName,
    spouseNationalId,
    maritalStatus,
    bank,
  }
}

export function getYesNOOptions() {
  const options: Option[] = [
    {
      value: YES,
      label: householdSupplementFormMessage.shared.yes,
    },
    {
      value: NO,
      label: householdSupplementFormMessage.shared.no,
    },
  ]
  return options
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
  const { householdSupplementChildren, householdSupplementHousing } =
    getApplicationAnswers(answers)
  const attachments: Attachments[] = []

  const fileUpload = answers.fileUpload as FileUpload
  console.log('FileUpload: ', fileUpload)
  if (householdSupplementHousing === HouseholdSupplementHousing.RENTER) {
    getAttachmentDetails(
      fileUpload?.leaseAgreement,
      AttachmentTypes.LEASE_AGREEMENT,
    )
  }
  if (householdSupplementChildren === YES) {
    getAttachmentDetails(
      fileUpload?.schoolConfirmation,
      AttachmentTypes.SCHOOL_CONFIRMATION,
    )
  }

  const additionalInfo =
    answers.fileUploadAdditionalFiles as AdditionalInformation
  console.log('additionalInfo: ', additionalInfo)
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
// 2 years back in time and 6 months in the future.
export function getAvailableYears(application: Application) {
  const { applicantNationalId } = getApplicationExternalData(
    application.externalData,
  )

  if (!applicantNationalId) return []

  const twoYearsBackInTime = subYears(new Date(), 2).getFullYear()
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
export function getAvailableMonths(
  application: Application,
  selectedYear: string,
) {
  const { applicantNationalId } = getApplicationExternalData(
    application.externalData,
  )

  if (!applicantNationalId) return []
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

export const formatBankInfo = (bankInfo: string) => {
  const formattedBankInfo = bankInfo.replace(/[^0-9]/g, '')
  if (formattedBankInfo && formattedBankInfo.length === 12) {
    return formattedBankInfo
  }

  return bankInfo
}
