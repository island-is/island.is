import { PendingActionDisplayType } from './StateMachine'
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

export type Answer =
  | string
  | number
  | boolean
  | Array<string | number | boolean | FormValue>
  | FormValue

export interface FormValue {
  [key: string]: Answer
}

export type ActionCardTag = 'red' | 'blueberry' | 'blue' | 'purple' | 'mint'

export type ApplicationHistoryItem = {
  date: Date
  log: string
}

export interface ActionCardMetaData {
  title?: string
  description?: string
  pendingAction?: {
    displayStatus: PendingActionDisplayType
    title?: string
    content?: string
    button?: string
  }
  history?: ApplicationHistoryItem[]
  tag?: {
    label?: string
    variant?: ActionCardTag
  }
  deleteButton?: boolean
  draftTotalSteps?: number
  draftFinishedSteps?: number
  historyButton?: string
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
  externalData: ExternalData
  name?: string
  institution?: string
  progress?: number
  status: ApplicationStatus
  draftTotalSteps?: number
  draftFinishedSteps?: number
}

export interface ApplicationCard {
  id: string
  created: Date
  modified: Date
  typeId: ApplicationTypes
  status: ApplicationStatus
  name?: string
  progress?: number
  slug?: string
  org?: string
  applicationPath?: string
  orgContentfulId?: string
  nationalId?: string
  actionCard?: ActionCardMetaData
}
export interface ApplicationWithAttachments extends Application {
  attachments: object
}

export interface ApplicationAnswerFile {
  key: string
  name: string
}
