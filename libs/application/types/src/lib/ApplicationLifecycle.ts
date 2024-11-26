import { Application } from '@island.is/application/api/core'
export interface ApplicationLifecycle {
  isListed: boolean
  pruneAt: Date | null
  pruneMessage?: string
}

export type PruningApplication = Pick<
  Application,
  | 'id'
  | 'attachments'
  | 'answers'
  | 'externalData'
  | 'typeId'
  | 'state'
  | 'applicant'
>

export type PruningNotification = {
  externalBody: string
  internalBody: string
}
