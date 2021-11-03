import { Application } from '@island.is/api/schema'
import {
  FormValue,
  getValueViaPath,
  MessageFormatter,
} from '@island.is/application/core'
import {
  AttachmentsEnum,
  FileType,
  PowerOfAttorneyUploadEnum,
  WhoIsTheNotificationForEnum,
} from '..'
import { YES } from '../constants'
import { AccidentNotification } from '../lib/dataSchema'
import { attachments } from '../lib/messages'

const hasAttachment = (attachment: FileType[] | undefined) =>
  attachment && attachment.length > 0

const includesAttachment = (answers: any, attachmentType: string): boolean => {
  return answers?.accidentStatus?.receivedAttachments?.[attachmentType]
}

export const hasReceivedInjuryCertifcate = (answers: FormValue) => {
  return includesAttachment(answers, 'InjuryCertificate')
}

export const hasReceivedProxyDocument = (answers: FormValue) => {
  return includesAttachment(answers, 'ProxyDocument')
}

export const hasReceivedPoliceReport = (answers: FormValue) => {
  return includesAttachment(answers, 'PoliceReport')
}

export const hasReceivedAllDocuments = (answers: FormValue) => {
  return (
    hasReceivedPoliceReport(answers) &&
    hasReceivedProxyDocument(answers) &&
    hasReceivedInjuryCertifcate(answers)
  )
}

export const getErrorMessageForMissingDocuments = (
  answers: FormValue,
  formatMessage: MessageFormatter,
) => {
  const whoIsTheNotificationFor = getValueViaPath(
    answers,
    'whoIsTheNotificationFor.answer',
  )
  const wasTheAccidentFatal = answers.wasTheAccidentFatal
  const missingDocuments = []

  if (!hasReceivedInjuryCertifcate(answers)) {
    missingDocuments.push(
      formatMessage(attachments.documentNames.injuryCertificate),
    )
  }

  if (
    whoIsTheNotificationFor === WhoIsTheNotificationForEnum.POWEROFATTORNEY &&
    !hasReceivedProxyDocument(answers)
  ) {
    missingDocuments.push(
      formatMessage(attachments.documentNames.powerOfAttorneyDocument),
    )
  }

  if (wasTheAccidentFatal === YES && !hasReceivedPoliceReport(answers)) {
    missingDocuments.push(
      formatMessage(attachments.documentNames.deathCertificate),
    )
  }

  return missingDocuments.join(', ')
}

export const hasMissingInjuryCertificate = (answers: FormValue) => {
  const injuryCertificate = (answers as AccidentNotification).injuryCertificate
  return injuryCertificate?.answer === AttachmentsEnum.SENDCERTIFICATELATER
}

export const hasMissingDeathCertificate = (answers: FormValue) => {
  const wasTheAccidentFatal = (answers as AccidentNotification)
    .wasTheAccidentFatal

  return wasTheAccidentFatal === YES
}

export const hasMissingPowerOfAttorneyFile = (answers: FormValue) => {
  const whoIsTheNotificationFor = (answers as AccidentNotification)
    .whoIsTheNotificationFor.answer
  const powerOfAttorneyType = (answers as AccidentNotification).powerOfAttorney
    ?.type
  return (
    whoIsTheNotificationFor === WhoIsTheNotificationForEnum.POWEROFATTORNEY &&
    powerOfAttorneyType !== PowerOfAttorneyUploadEnum.FORCHILDINCUSTODY
  )
}

export const hasMissingDocuments = (answers: FormValue) => {
  return (
    (hasMissingInjuryCertificate(answers) &&
      !hasAttachment(
        (answers as AccidentNotification).attachments?.injuryCertificateFile
          ?.file,
      )) ||
    (hasMissingDeathCertificate(answers) &&
      !hasAttachment(
        (answers as AccidentNotification).attachments?.deathCertificateFile
          ?.file,
      )) ||
    (hasMissingPowerOfAttorneyFile(answers) &&
      !hasAttachment(
        (answers as AccidentNotification).attachments?.powerOfAttorneyFile
          ?.file,
      ))
  )
}
