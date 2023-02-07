import { PendingAction } from './StateMachine'
import { ApplicationTypes } from './ApplicationTypes'
import { DataProviderResult } from './DataProviderResult'

export enum ApplicationStatus {
  NOT_STARTED = 'notstarted',
  DRAFT = 'draft',
  IN_PROGRESS = 'inprogress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  APPROVED = 'approved',
}

export interface ExternalData {
  [key: string]: DataProviderResult
}

export type Answer = string | number | boolean | Answer[] | FormValue

export interface FormValue {
  [key: string]: Answer
}

export type ActionCardTag = 'red' | 'blueberry' | 'blue' | 'purple' | 'mint'

export type ApplicationHistoryItem = {
  id: string
  date: string
  application_id: string
  contentful_id: string
}

export interface ActionCardMetaData {
  title?: string
  description?: string
  pendingAction?: Omit<PendingAction, 'content'> & { content?: string }
  tag?: {
    label?: string
    variant?: ActionCardTag
  }
  deleteButton?: boolean
}

export interface Application<TAnswers = FormValue> {
  id: string
  state: string
  actionCard?: ActionCardMetaData
  applicant: string
  assignees: string[]
  applicantActors: string[]
  typeId: ApplicationTypes
  modified: Date
  created: Date
  answers: TAnswers
  history?: ApplicationHistoryItem[]
  externalData: ExternalData
  name?: string
  institution?: string
  progress?: number
  status: ApplicationStatus
}

export interface ApplicationWithAttachments extends Application {
  attachments: object
}

export interface ApplicationAnswerFile {
  key: string
  name: string
}
