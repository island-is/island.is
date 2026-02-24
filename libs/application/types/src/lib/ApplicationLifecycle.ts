import { ApplicationWithAttachments } from './Application'
export interface ApplicationLifecycle {
  isListed: boolean
  pruneAt: Date | null
  pruneMessage?: string
}

export type PruningApplication = Pick<
  ApplicationWithAttachments,
  | 'id'
  | 'attachments'
  | 'answers'
  | 'externalData'
  | 'typeId'
  | 'state'
  | 'applicant'
  | 'applicantActors'
>

export type PruningNotification = {
  externalBody?: string
  internalBody?: string
  notificationTemplateId: string
}
