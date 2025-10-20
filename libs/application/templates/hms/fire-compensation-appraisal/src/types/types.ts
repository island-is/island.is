export type FileType = {
  url?: string | undefined
  name: string
  key: string
}

export enum TemplateApiActions {
  calculateAmount = 'calculateAmount',
  submitApplication = 'submitApplication',
  sendNotificationToAllInvolved = 'sendNotificationToAllInvolved',
}
