import { FormValue } from '@island.is/application/core'
import {
  AttachmentsEnum,
  FileType,
  PowerOfAttorneyUploadEnum,
  WhoIsTheNotificationForEnum,
} from '..'
import { YES } from '../constants'
import { AccidentNotification } from '../lib/dataSchema'

const hasAttachment = (attachment: FileType[] | undefined) =>
  attachment && attachment.length > 0

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
