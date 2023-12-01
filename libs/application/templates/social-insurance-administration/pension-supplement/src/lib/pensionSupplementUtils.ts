import { getValueViaPath } from '@island.is/application/core'
import { Application, Option } from '@island.is/application/types'
import {
  ApplicationReason,
  AttachmentLabel,
  AttachmentTypes,
  MONTHS,
} from './constants'
import { pensionSupplementFormMessage } from './messages'
import subYears from 'date-fns/subYears'
import addMonths from 'date-fns/addMonths'
import {
  Attachments,
  BankInfo,
  FileType,
} from '@island.is/application/templates/social-insurance-administration-core/types'
import { BankAccountType } from '@island.is/application/templates/social-insurance-administration-core/constants'
import { PensionSupplementAttachments } from '../types'

export function getApplicationAnswers(answers: Application['answers']) {
  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicantInfo.phonenumber',
  ) as string

  const applicationReason = getValueViaPath(
    answers,
    'applicationReason',
  ) as ApplicationReason[]

  const selectedYear = getValueViaPath(answers, 'period.year') as string

  const selectedMonth = getValueViaPath(answers, 'period.month') as string

  const additionalAttachments = getValueViaPath(
    answers,
    'fileUploadAdditionalFiles.additionalDocuments',
  ) as FileType[]

  const additionalAttachmentsRequired = getValueViaPath(
    answers,
    'fileUploadAdditionalFilesRequired.additionalDocumentsRequired',
  ) as FileType[]

  const comment = getValueViaPath(answers, 'comment') as string

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

  return {
    applicantPhonenumber,
    applicationReason,
    selectedYear,
    selectedMonth,
    additionalAttachments,
    additionalAttachmentsRequired,
    comment,
    bankAccountType,
    bank,
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

  return {
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantMunicipality,
    email,
    bankInfo,
    currencies,
  }
}

export function getApplicationReasonOptions() {
  const options: Option[] = [
    {
      value: ApplicationReason.MEDICINE_COST,
      label: pensionSupplementFormMessage.applicationReason.medicineCost,
    },
    {
      value: ApplicationReason.ASSISTED_CARE_AT_HOME,
      label: pensionSupplementFormMessage.applicationReason.assistedCareAtHome,
    },
    {
      value: ApplicationReason.OXYGEN_FILTER_COST,
      label: pensionSupplementFormMessage.applicationReason.oxygenFilterCost,
    },
    {
      value: ApplicationReason.PURCHASE_OF_HEARING_AIDS,
      label:
        pensionSupplementFormMessage.applicationReason.purchaseOfHearingAids,
    },
    {
      value: ApplicationReason.ASSISTED_LIVING,
      label: pensionSupplementFormMessage.applicationReason.assistedLiving,
    },
    {
      value: ApplicationReason.HALFWAY_HOUSE,
      label: pensionSupplementFormMessage.applicationReason.halfwayHouse,
    },
    {
      value: ApplicationReason.HOUSE_RENT,
      label: pensionSupplementFormMessage.applicationReason.houseRent,
    },
  ]
  return options
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
  const {
    applicationReason,
    additionalAttachments,
    additionalAttachmentsRequired,
  } = getApplicationAnswers(answers)
  const attachments: Attachments[] = []

  const pensionSupplementAttachments =
    answers.fileUpload as PensionSupplementAttachments

  applicationReason.forEach((reason) => {
    if (reason === ApplicationReason.ASSISTED_CARE_AT_HOME) {
      getAttachmentDetails(
        pensionSupplementAttachments?.assistedCareAtHome,
        AttachmentTypes.ASSISTED_CARE_AT_HOME,
      )
    }
    if (reason === ApplicationReason.HOUSE_RENT) {
      if (
        pensionSupplementAttachments?.houseRentAgreement &&
        pensionSupplementAttachments?.houseRentAgreement.length > 0 &&
        pensionSupplementAttachments?.houseRentAllowance &&
        pensionSupplementAttachments?.houseRentAllowance.length > 0
      ) {
        getAttachmentDetails(
          [
            ...pensionSupplementAttachments.houseRentAgreement,
            ...pensionSupplementAttachments.houseRentAllowance,
          ],
          AttachmentTypes.HOUSE_RENT,
        )
      }
    }
    if (reason === ApplicationReason.ASSISTED_LIVING) {
      getAttachmentDetails(
        pensionSupplementAttachments?.assistedLiving,
        AttachmentTypes.ASSISTED_LIVING,
      )
    }
    if (reason === ApplicationReason.PURCHASE_OF_HEARING_AIDS) {
      getAttachmentDetails(
        pensionSupplementAttachments?.purchaseOfHearingAids,
        AttachmentTypes.PURCHASE_OF_HEARING_AIDS,
      )
    }
    if (reason === ApplicationReason.HALFWAY_HOUSE) {
      getAttachmentDetails(
        pensionSupplementAttachments?.halfwayHouse,
        AttachmentTypes.HALFWAY_HOUSE,
      )
    }
  })

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

// returns awailable years. Available period is
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
