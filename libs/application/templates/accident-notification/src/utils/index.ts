import { MessageFormatter } from '@island.is/application/core'
import {
  AttachmentsEnum,
  PowerOfAttorneyUploadEnum,
  WhoIsTheNotificationForEnum,
} from '..'
import { YES } from '../constants'
import { AccidentNotification } from '../lib/dataSchema'
import { attachments } from '../lib/messages'

export const isValid24HFormatTime = (value: string) => {
  if (value.length !== 4) return false
  const hours = parseInt(value.slice(0, 2))
  const minutes = parseInt(value.slice(2, 4))
  if (hours > 23) return false
  if (minutes > 59) return false
  return true
}

export const returnMissingDocumentsList = (
  answers: AccidentNotification,
  formatMessage: MessageFormatter,
) => {
  const injuryCertificate = answers.attachments.injuryCertificate
  const whoIsTheNotificationFor = answers.whoIsTheNotificationFor.answer
  const wasTheAccidentFatal = answers.wasTheAccidentFatal
  const powerOfAttorneyType = answers.powerOfAttorney?.type
  const missingDocuments = []

  if (
    injuryCertificate === AttachmentsEnum.SENDCERTIFICATELATER &&
    (!answers.attachments.injuryCertificateFile ||
      answers.attachments.injuryCertificateFile?.length === 0)
  ) {
    missingDocuments.push(
      formatMessage(attachments.documentNames.injuryCertificate),
    )
  }

  if (
    whoIsTheNotificationFor === WhoIsTheNotificationForEnum.POWEROFATTORNEY &&
    powerOfAttorneyType !== PowerOfAttorneyUploadEnum.FORCHILDINCUSTODY &&
    (!answers.attachments.powerOfAttorneyFile ||
      answers.attachments.powerOfAttorneyFile?.length === 0)
  ) {
    missingDocuments.push(
      formatMessage(attachments.documentNames.powerOfAttorneyDocument),
    )
  }

  if (
    wasTheAccidentFatal === YES &&
    !answers.attachments.deathCertificateFile
  ) {
    missingDocuments.push(
      formatMessage(attachments.documentNames.deathCertificate),
    )
  }

  return missingDocuments.join(', ')
}

export * from './fishermanUtils'
export * from './getAccidentTypeOptions'
export * from './getWorkplaceData'
export * from './hideLocationAndPurpose'
export * from './isAgricultureAccident'
export * from './isDateOlderThanAYear'
export * from './isGeneralWorkplaceAccident'
export * from './isHomeActivitiesAccident'
export * from './isMachineRelatedAccident'
export * from './isProfessionalAthleteAccident'
export * from './isReportingOnBehalfOfChild'
export * from './isReportingOnBehalfOfEmployee'
export * from './isReportingOnBehalfOfInjured'
export * from './isRepresentativeOfCompanyOrInstitue'
export * from './isRescueWorkAccident'
export * from './isStudiesAccident'
export * from './isWorkAccident'
