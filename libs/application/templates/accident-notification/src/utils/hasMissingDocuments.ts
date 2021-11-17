import {
  FormValue,
  getValueViaPath,
  MessageFormatter,
} from '@island.is/application/core'
import { AttachmentsEnum, FileType, WhoIsTheNotificationForEnum } from '..'
import { YES, NO } from '../constants'
import { AccidentNotification } from '../lib/dataSchema'
import { attachments } from '../lib/messages'
import { isFatalAccident } from './isFatalAccident'
import { isReportingOnBehalfSelf } from './isReportingBehalfOfSelf'

const hasAttachment = (attachment: FileType[] | undefined) =>
  attachment && attachment.length > 0

const includesAttachment = (answers: any, attachmentType: string): boolean => {
  return answers?.accidentStatus?.receivedAttachments?.[attachmentType]
}

export const hasReceivedInjuryCertificate = (answers: FormValue) => {
  return includesAttachment(answers, 'InjuryCertificate')
}

export const hasReceivedProxyDocument = (answers: FormValue) => {
  return includesAttachment(answers, 'ProxyDocument')
}

export const hasReceivedPoliceReport = (answers: FormValue) => {
  return includesAttachment(answers, 'PoliceReport')
}

export const hasReceivedAllDocuments = (answers: FormValue) => {
  // Reporting for self only injury certificate relevent
  if (isReportingOnBehalfSelf(answers)) {
    return hasReceivedInjuryCertificate(answers)
  } else {
    // If fatal and not on behalf of self all documents are relevant
    if (isFatalAccident(answers)) {
      return (
        hasReceivedPoliceReport(answers) &&
        hasReceivedProxyDocument(answers) &&
        hasReceivedInjuryCertificate(answers)
      )
    } else {
      // Not fatal so injury and proxy document are relevant
      hasReceivedProxyDocument(answers) && hasReceivedInjuryCertificate(answers)
    }
  }
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

  if (!hasReceivedInjuryCertificate(answers)) {
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

export const hasMissingPowerOfAttorneyFile = (answers: FormValue): boolean => {
  const whoIsTheNotificationFor = (answers as AccidentNotification)
    .whoIsTheNotificationFor.answer
  return whoIsTheNotificationFor === WhoIsTheNotificationForEnum.POWEROFATTORNEY
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
