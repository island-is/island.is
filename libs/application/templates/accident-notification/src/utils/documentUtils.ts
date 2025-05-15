import { getValueViaPath, YES, YesOrNo } from '@island.is/application/core'
import { AccidentNotification } from '../lib/dataSchema'
import { FileType } from './types'
import { attachments, overview } from '../lib/messages'
import { FormatMessage } from '@island.is/localization'
import { FormValue } from '@island.is/application/types'
import {
  AccidentNotificationAttachmentStatus,
  AccidentNotifTypes,
} from './types'
import {
  isReportingOnBehalfOfEmployee,
  isReportingOnBehalfSelf,
} from './reportingUtils'
import { isFatalAccident } from './accidentUtils'
import {
  AttachmentsEnum,
  PowerOfAttorneyUploadEnum,
  WhoIsTheNotificationForEnum,
} from './enums'

export const hasAttachment = (attachment: Array<FileType> | undefined) =>
  attachment && attachment.length > 0

const includesAttachment = (
  answers: FormValue,
  attachmentType: AccidentNotifTypes,
): boolean => {
  const accidentNotifications =
    getValueViaPath<AccidentNotificationAttachmentStatus>(
      answers,
      'accidentStatus.receivedAttachments',
    )
  return accidentNotifications?.[attachmentType] || false
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

export const hasReceivedInjuryCertificateOrAddedToAnswers = (
  answers: FormValue,
) => {
  const injuryCertificateFile = getValueViaPath<Array<FileType>>(
    answers,
    'attachments.injuryCertificateFile.file',
    [{ key: '', name: '' }],
  )

  return (
    hasReceivedInjuryCertificate(answers) ||
    hasAttachment(injuryCertificateFile)
  )
}

export const hasReceivedProxyDocumentOrAddedToAnswers = (
  answers: FormValue,
) => {
  const powerOfAttorneyFile = getValueViaPath<Array<FileType>>(
    answers,
    'attachments.powerOfAttorneyFile.file',
    [{ key: '', name: '' }],
  )

  return hasReceivedProxyDocument(answers) || hasAttachment(powerOfAttorneyFile)
}

export const hasReceivedPoliceReportOrAddedToAnswers = (answers: FormValue) => {
  const deathCertificateFile = getValueViaPath<Array<FileType>>(
    answers,
    'attachments.deathCertificateFile.file',
    [{ key: '', name: '' }],
  )

  return hasReceivedPoliceReport(answers) || hasAttachment(deathCertificateFile)
}

export const hasReceivedAllDocuments = (answers: FormValue) => {
  // Reporting for self or as juridicial person only injury certificate relevent
  if (
    isReportingOnBehalfSelf(answers) ||
    isReportingOnBehalfOfEmployee(answers)
  ) {
    return hasReceivedInjuryCertificate(answers)
  } else {
    // If fatal and not report for self or as juridicial all documents are relevant
    if (isFatalAccident(answers)) {
      return (
        hasReceivedPoliceReport(answers) &&
        hasReceivedProxyDocument(answers) &&
        hasReceivedInjuryCertificate(answers)
      )
    } else {
      return (
        hasReceivedProxyDocument(answers) &&
        hasReceivedInjuryCertificate(answers)
      )
    }
  }
}

export const getErrorMessageForMissingDocuments = (
  answers: FormValue,
  formatMessage: FormatMessage,
  isAssigneeAndUnique: boolean,
) => {
  const whoIsTheNotificationFor = getValueViaPath<WhoIsTheNotificationForEnum>(
    answers,
    'whoIsTheNotificationFor.answer',
  )
  const wasTheAccidentFatal = getValueViaPath<YesOrNo>(
    answers,
    'wasTheAccidentFatal',
  )
  const missingDocuments = []

  if (!hasReceivedInjuryCertificateOrAddedToAnswers(answers)) {
    missingDocuments.push(
      formatMessage(attachments.documentNames.injuryCertificate),
    )
  }

  // Only show this to applicant or assignee that is also the applicant
  if (
    whoIsTheNotificationFor === WhoIsTheNotificationForEnum.POWEROFATTORNEY &&
    !hasReceivedProxyDocumentOrAddedToAnswers(answers) &&
    !isAssigneeAndUnique
  ) {
    missingDocuments.push(
      formatMessage(attachments.documentNames.powerOfAttorneyDocument),
    )
  }

  if (
    wasTheAccidentFatal === YES &&
    !hasReceivedPoliceReportOrAddedToAnswers(answers)
  ) {
    missingDocuments.push(
      formatMessage(attachments.documentNames.deathCertificate),
    )
  }

  return missingDocuments.join(', ')
}

export const hasMissingInjuryCertificate = (answers: FormValue) => {
  const injuryCertificate = getValueViaPath<AttachmentsEnum>(
    answers,
    'injuryCertificate.answer',
  )
  return injuryCertificate === AttachmentsEnum.SENDCERTIFICATELATER
}

export const hasMissingDeathCertificate = (answers: FormValue) => {
  const wasTheAccidentFatal = getValueViaPath<YesOrNo>(
    answers,
    'wasTheAccidentFatal',
  )
  return wasTheAccidentFatal === YES
}

export const hasMissingPowerOfAttorneyFile = (answers: FormValue): boolean => {
  const whoIsTheNotificationFor = getValueViaPath<WhoIsTheNotificationForEnum>(
    answers,
    'whoIsTheNotificationFor.answer',
  )
  return whoIsTheNotificationFor === WhoIsTheNotificationForEnum.POWEROFATTORNEY
}

export const hasMissingDocuments = (answers: FormValue) => {
  const injuryCertificateFile = getValueViaPath<Array<FileType>>(
    answers,
    'attachments.injuryCertificateFile.file',
  )

  const deathCertificateFile = getValueViaPath<Array<FileType>>(
    answers,
    'attachments.deathCertificateFile.file',
  )

  const powerOfAttorneyFile = getValueViaPath<Array<FileType>>(
    answers,
    'attachments.powerOfAttorneyFile.file',
  )

  return (
    (hasMissingInjuryCertificate(answers) &&
      !hasAttachment(injuryCertificateFile)) ||
    (hasMissingDeathCertificate(answers) &&
      !hasAttachment(deathCertificateFile)) ||
    (hasMissingPowerOfAttorneyFile(answers) &&
      !hasAttachment(powerOfAttorneyFile))
  )
}

export const getAttachmentTitles = (answers: FormValue) => {
  const deathCertificateFile = getValueViaPath<Array<FileType>>(
    answers,
    'attachments.deathCertificateFile.file',
  )
  const injuryCertificateFile = getValueViaPath<Array<FileType>>(
    answers,
    'attachments.injuryCertificateFile.file',
  )
  const powerOfAttorneyFile = getValueViaPath<Array<FileType>>(
    answers,
    'attachments.powerOfAttorneyFile.file',
  )
  const additionalFiles = getValueViaPath<Array<FileType>>(
    answers,
    'attachments.additionalFiles.file',
  )
  const additionalFilesFromReviewer = getValueViaPath<Array<FileType>>(
    answers,
    'attachments.additionalFilesFromReviewer.file',
  )

  const files = []

  if (hasAttachment(deathCertificateFile)) {
    files.push(attachments.documentNames.deathCertificate)
  }

  if (
    hasAttachment(injuryCertificateFile) &&
    getValueViaPath<AttachmentsEnum>(answers, 'injuryCertificate.answer') !==
      AttachmentsEnum.HOSPITALSENDSCERTIFICATE
  ) {
    files.push(attachments.documentNames.injuryCertificate)
  }

  if (hasAttachment(powerOfAttorneyFile)) {
    files.push(attachments.documentNames.powerOfAttorneyDocument)
  }

  if (
    getValueViaPath(answers, 'injuryCertificate.answer') ===
    AttachmentsEnum.HOSPITALSENDSCERTIFICATE
  ) {
    files.push(overview.labels.hospitalSendsCertificate)
  }

  if (hasAttachment(additionalFiles)) {
    files.push(attachments.documentNames.additionalDocumentsFromApplicant)
  }

  if (hasAttachment(additionalFilesFromReviewer)) {
    files.push(attachments.documentNames.additionalDocumentsFromReviewer)
  }

  return files
}

export const missingDocuments = (answers: FormValue) => {
  const injuryCertificate = getValueViaPath<{ answer: AttachmentsEnum }>(
    answers,
    'injuryCertificate',
  )
  const whoIsTheNotificationFor = getValueViaPath<WhoIsTheNotificationForEnum>(
    answers,
    'whoIsTheNotificationFor.answer',
  )
  const wasTheAccidentFatal = getValueViaPath<YesOrNo>(
    answers,
    'wasTheAccidentFatal',
  )
  const missingDocuments = []

  if (
    injuryCertificate?.answer === AttachmentsEnum.SENDCERTIFICATELATER &&
    !hasAttachment(
      getValueViaPath(answers, 'attachments.injuryCertificateFile.file'),
    )
  ) {
    missingDocuments.push(attachments.documentNames.injuryCertificate)
  }

  // Only show this to applicant or assignee that is also the applicant
  if (
    whoIsTheNotificationFor === WhoIsTheNotificationForEnum.POWEROFATTORNEY &&
    !hasAttachment(
      getValueViaPath(answers, 'attachments.powerOfAttorneyFile.file'),
    )
  ) {
    missingDocuments.push(attachments.documentNames.powerOfAttorneyDocument)
  }

  if (
    wasTheAccidentFatal === YES &&
    !hasAttachment(
      getValueViaPath(answers, 'attachments.deathCertificateFile.file'),
    )
  ) {
    missingDocuments.push(attachments.documentNames.deathCertificate)
  }

  return missingDocuments
}

export const returnMissingDocumentsList = (
  answers: AccidentNotification,
  formatMessage: FormatMessage,
) => {
  const injuryCertificate = answers.injuryCertificate
  const whoIsTheNotificationFor = answers?.whoIsTheNotificationFor?.answer
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

  // Only show this to applicant or assignee that is also the applicant
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

export const isUploadNow = (formValue: FormValue) => {
  const whoIsTheNotificationFor = getValueViaPath<WhoIsTheNotificationForEnum>(
    formValue,
    'whoIsTheNotificationFor.answer',
  )
  const powerOfAttorneyType = getValueViaPath<PowerOfAttorneyUploadEnum>(
    formValue,
    'powerOfAttorney.type',
  )
  return (
    whoIsTheNotificationFor === WhoIsTheNotificationForEnum.POWEROFATTORNEY &&
    powerOfAttorneyType === PowerOfAttorneyUploadEnum.UPLOADNOW
  )
}
