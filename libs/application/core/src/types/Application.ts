import { ApplicationTypes } from './ApplicationTypes'
import { DataProviderResult } from './DataProviderResult'

export enum ApplicationStatus {
  NOT_STARTED = 'notstarted',
  IN_PROGRESS = 'inprogress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export interface ExternalData {
  [key: string]: DataProviderResult
}

export type Answer = string | number | boolean | Answer[] | FormValue

export interface FormValue {
  [key: string]: Answer
}

export type ActionCardTag = 'red' | 'blueberry' | 'blue'

export interface ActionCardMetaData {
  title?: string
  description?: string
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
  typeId: ApplicationTypes
  modified: Date
  created: Date
  answers: TAnswers
  externalData: ExternalData
  name?: string
  institution?: string
  progress?: number
  status: ApplicationStatus
}

export interface ApplicationWithAttachments extends Application {
  attachments: object
}
