import {
  FormValue,
  getValueViaPath,
  MessageFormatter,
} from '@island.is/application/core'
import { AttachmentsEnum, FileType, WhoIsTheNotificationForEnum } from '..'
import { YES } from '../constants'
import { attachments } from '../lib/messages'
import {
  AccidentNotificationAttachmentStatus,
  AccidentNotifTypes,
  YesOrNo,
} from '../types'
import { isFatalAccident } from './isFatalAccident'
import { isReportingOnBehalfSelf } from './isReportingBehalfOfSelf'

const hasAttachment = (attachment: FileType[] | undefined) =>
  attachment && attachment.length > 0

const includesAttachment = (
  answers: FormValue,
  attachmentType: AccidentNotifTypes,
): boolean => {
  const accidentNotifications = getValueViaPath(
    answers,
    'accidentStatus.receivedAttachments',
  ) as AccidentNotificationAttachmentStatus
  return accidentNotifications[attachmentType] || false
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
  const wasTheAccidentFatal = getValueViaPath(
    answers,
    'wasTheAccidentFatal',
  ) as YesOrNo
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
  const injuryCertificate = getValueViaPath(
    answers,
    'injuryCertificate.answer',
  ) as AttachmentsEnum
  return injuryCertificate === AttachmentsEnum.SENDCERTIFICATELATER
}

export const hasMissingDeathCertificate = (answers: FormValue) => {
  const wasTheAccidentFatal = getValueViaPath(
    answers,
    'wasTheAccidentFatal',
  ) as YesOrNo
  return wasTheAccidentFatal === YES
}

export const hasMissingPowerOfAttorneyFile = (answers: FormValue): boolean => {
  const whoIsTheNotificationFor = getValueViaPath(
    answers,
    'whoIsTheNotificationFor.answer',
  ) as WhoIsTheNotificationForEnum
  return whoIsTheNotificationFor === WhoIsTheNotificationForEnum.POWEROFATTORNEY
}

export const hasMissingDocuments = (answers: FormValue) => {
  const injuryCertificateFile = getValueViaPath(
    answers,
    'attachments.injuryCertificateFile.file',
  ) as FileType[]

  const deathCertificateFile = getValueViaPath(
    answers,
    'attachments.deathCertificateFile.file',
  ) as FileType[]

  const powerOfAttorneyFile = getValueViaPath(
    answers,
    'attachments.powerOfAttorneyFile.file',
  ) as FileType[]

  return (
    (hasMissingInjuryCertificate(answers) &&
      !hasAttachment(injuryCertificateFile)) ||
    (hasMissingDeathCertificate(answers) &&
      !hasAttachment(deathCertificateFile)) ||
    (hasMissingPowerOfAttorneyFile(answers) &&
      !hasAttachment(powerOfAttorneyFile))
  )
}
