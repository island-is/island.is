export interface AccidentNotificationAttachment {
  name: string
  content: string
  attachmentType: AttachmentTypeEnum
}

export enum AttachmentTypeEnum {
  INJURY_CERTIFICATE = 1,
  POWER_OF_ATTORNEY = 2,
  POLICE_REPORT = 3,
  OTHER = 4,
}
