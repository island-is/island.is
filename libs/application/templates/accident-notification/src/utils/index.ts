import { MessageFormatter } from '@island.is/application/core'
import { AttachmentsEnum, FileType, WhoIsTheNotificationForEnum } from '..'
import { YES } from '../constants'
import { AccidentNotification } from '../lib/dataSchema'
import { attachments, overview } from '../lib/messages'

export const isValid24HFormatTime = (value: string) => {
  if (value.length !== 4) return false
  const hours = parseInt(value.slice(0, 2))
  const minutes = parseInt(value.slice(2, 4))
  if (hours > 23) return false
  if (minutes > 59) return false
  return true
}

const hasAttachment = (attachment: FileType[] | undefined) =>
  attachment && attachment.length > 0

export const getAttachmentTitles = (answers: AccidentNotification) => {
  const deathCertificateFile =
    answers.attachments?.deathCertificateFile?.file || undefined
  const injuryCertificateFile =
    answers.attachments?.injuryCertificateFile?.file || undefined
  const powerOfAttorneyFile =
    answers.attachments?.powerOfAttorneyFile?.file || undefined
  const additionalFiles =
    answers.attachments?.additionalFiles?.file || undefined

  const files = []

  if (hasAttachment(deathCertificateFile))
    files.push(attachments.documentNames.deathCertificate)
  if (hasAttachment(injuryCertificateFile))
    files.push(attachments.documentNames.injuryCertificate)
  if (hasAttachment(powerOfAttorneyFile))
    files.push(attachments.documentNames.powerOfAttorneyDocument)
  if (
    answers.injuryCertificate?.answer ===
    AttachmentsEnum.HOSPITALSENDSCERTIFICATE
  )
    files.push(overview.labels.hospitalSendsCertificate)
  if (hasAttachment(additionalFiles))
    files.push(attachments.documentNames.additionalDocuments)

  return files
}

export const returnMissingDocumentsList = (
  answers: AccidentNotification,
  formatMessage: MessageFormatter,
) => {
  const injuryCertificate = answers.injuryCertificate
  const whoIsTheNotificationFor = answers.whoIsTheNotificationFor.answer
  const wasTheAccidentFatal = answers.wasTheAccidentFatal
  const missingDocuments = []

  if (
    injuryCertificate?.answer === AttachmentsEnum.SENDCERTIFICATELATER &&
    !hasAttachment(answers.attachments?.injuryCertificateFile?.file)
  ) {
    missingDocuments.push(
      formatMessage(attachments.documentNames.injuryCertificate),
    )
  }

  if (
    whoIsTheNotificationFor === WhoIsTheNotificationForEnum.POWEROFATTORNEY &&
    !hasAttachment(answers.attachments?.powerOfAttorneyFile?.file)
  ) {
    missingDocuments.push(
      formatMessage(attachments.documentNames.powerOfAttorneyDocument),
    )
  }

  if (
    wasTheAccidentFatal === YES &&
    !hasAttachment(answers.attachments?.deathCertificateFile?.file)
  ) {
    missingDocuments.push(
      formatMessage(attachments.documentNames.deathCertificate),
    )
  }

  return missingDocuments.join(', ')
}

export * from './fishermanUtils'
export * from './getAccidentTypeOptions'
export * from './getInjuredPersonInformation'
export * from './getWorkplaceData'
export * from './hasMissingDocuments'
export * from './hideLocationAndPurpose'
export * from './isAgricultureAccident'
export * from './isDateOlderThanAYear'
export * from './isGeneralWorkplaceAccident'
export * from './isHomeActivitiesAccident'
export * from './isInternshipStudiesAccident'
export * from './isMachineRelatedAccident'
export * from './isProfessionalAthleteAccident'
export * from './isReportingOnBehalfOfChild'
export * from './isReportingOnBehalfOfEmployee'
export * from './isReportingOnBehalfOfInjured'
export * from './isRepresentativeOfCompanyOrInstitue'
export * from './isRescueWorkAccident'
export * from './isStudiesAccident'
export * from './isWorkAccident'
export * from './isPowerOfAttorney'
export * from './isRepresentativeOfCompanyOrInstitue'
export * from './isFatalAccident'
export * from './isReportingBehalfOfSelf'
