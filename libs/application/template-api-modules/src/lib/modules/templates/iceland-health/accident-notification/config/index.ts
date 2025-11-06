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

export const policeReportRequest: AccidentNotificationAttachmentGatherRequest =
  {
    answerKey: 'attachments.deathCertificateFile.file',
    attachmentType: AttachmentTypeEnum.POLICE_REPORT,
    filenamePrefix: 'logregluskyrsla',
  }

export const powerOfAttorneyRequest: AccidentNotificationAttachmentGatherRequest =
  {
    answerKey: 'attachments.powerOfAttorneyFile.file',
    attachmentType: AttachmentTypeEnum.POWER_OF_ATTORNEY,
    filenamePrefix: 'umbod',
  }

export const additionalFilesRequest: AccidentNotificationAttachmentGatherRequest =
  {
    answerKey: 'attachments.additionalFiles.file',
    attachmentType: AttachmentTypeEnum.ADDITIONAL_FILES,
    filenamePrefix: 'aukaskjal',
  }

export const additionalFilesFromReviewerRequest: AccidentNotificationAttachmentGatherRequest =
  {
    answerKey: 'attachments.additionalFilesFromReviewer.file',
    attachmentType: AttachmentTypeEnum.ADDITIONAL_FILES,
    filenamePrefix: 'aukaskjal',
  }

export const injuryCertificateRequest: AccidentNotificationAttachmentGatherRequest =
  {
    answerKey: 'attachments.injuryCertificateFile.file',
    attachmentType: AttachmentTypeEnum.INJURY_CERTIFICATE,
    filenamePrefix: 'averkavottord',
  }

export const allAttachmentRequestConfig: AttachementRequestConfig = {
  requests: [
    policeReportRequest,
    powerOfAttorneyRequest,
    additionalFilesRequest,
    injuryCertificateRequest,
  ],
}
