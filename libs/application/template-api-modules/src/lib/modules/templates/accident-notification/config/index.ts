import {
  AccidentNotificationAttachmentGatherRequest,
  AttachmentTypeEnum,
} from '../types/attachments'

export const ACCIDENT_NOTIFICATION_CONFIG = 'ACCIDENT_NOTIFICATION_CONFIG'

export interface AccidentNotificationConfig {
  applicationRecipientEmail: string
  applicationRecipientName: string
  applicationSenderName: string
  applicationSenderEmail: string
}

export interface AttachementRequestConfig {
  requests: AccidentNotificationAttachmentGatherRequest[]
}

// For review step
export const injuryCertificateRequest: AccidentNotificationAttachmentGatherRequest = {
  answerKey: 'attachments.injuryCertificateFile.file',
  attachmentType: AttachmentTypeEnum.INJURY_CERTIFICATE,
  filenamePrefix: 'averkavottord-seint',
}

export const policeReportRequest: AccidentNotificationAttachmentGatherRequest = {
  answerKey: 'attachments.deathCertificateFile.file',
  attachmentType: AttachmentTypeEnum.POLICE_REPORT,
  filenamePrefix: 'logregluskyrsla-seint',
}

export const powerOfAttorneyRequest: AccidentNotificationAttachmentGatherRequest = {
  answerKey: 'attachments.powerOfAttorneyFile.file',
  attachmentType: AttachmentTypeEnum.POWER_OF_ATTORNEY,
  filenamePrefix: 'umbod-seint',
}

export const additionalFilesRequest: AccidentNotificationAttachmentGatherRequest = {
  answerKey: 'attachments.additionalFiles.file',
  attachmentType: AttachmentTypeEnum.ADDITIONAL_FILES,
  filenamePrefix: 'aukaskjal-seint',
}

export const additionalFilesFromReviewerRequest: AccidentNotificationAttachmentGatherRequest = {
  answerKey: 'attachments.additionalFilesFromReviewer.file',
  attachmentType: AttachmentTypeEnum.ADDITIONAL_FILES,
  filenamePrefix: 'aukaskjal-seint',
}

// For application step
export const injuryCertificateRequestForApplication: AccidentNotificationAttachmentGatherRequest = {
  answerKey: 'injuryCertificateFile.file',
  attachmentType: AttachmentTypeEnum.INJURY_CERTIFICATE,
  filenamePrefix: 'averkavottord',
}

export const policeReportRequestForApplication: AccidentNotificationAttachmentGatherRequest = {
  answerKey: 'deathCertificateFile.file',
  attachmentType: AttachmentTypeEnum.POLICE_REPORT,
  filenamePrefix: 'logregluskyrsla',
}

export const powerOfAttorneyRequestForApplication: AccidentNotificationAttachmentGatherRequest = {
  answerKey: 'powerOfAttorneyFile.file',
  attachmentType: AttachmentTypeEnum.POWER_OF_ATTORNEY,
  filenamePrefix: 'umbod',
}

export const additionalFilesRequestForApplication: AccidentNotificationAttachmentGatherRequest = {
  answerKey: 'additionalFiles.file',
  attachmentType: AttachmentTypeEnum.ADDITIONAL_FILES,
  filenamePrefix: 'aukaskjal',
}

export const allAttachmentRequestConfig: AttachementRequestConfig = {
  requests: [
    policeReportRequestForApplication,
    powerOfAttorneyRequestForApplication,
    additionalFilesRequestForApplication,
    injuryCertificateRequestForApplication,
  ],
}
