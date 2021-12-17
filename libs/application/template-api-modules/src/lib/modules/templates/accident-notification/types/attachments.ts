export interface AccidentNotificationAttachment {
  content: string
  attachmentType: AttachmentTypeEnum
  name: string
  hash: string
}

export interface AccidentNotificationAttachmentGatherRequest {
  answerKey: string
  attachmentType: AttachmentTypeEnum
  filenamePrefix: string
}

export enum AttachmentTypeEnum {
  INJURY_CERTIFICATE = 1,
  POWER_OF_ATTORNEY = 2,
  POLICE_REPORT = 3,
  ADDITIONAL_FILES = 4,
}
