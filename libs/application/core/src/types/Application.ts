import { ApplicationTypes } from './ApplicationTypes'
import { DataProviderResult } from './DataProviderResult'

export enum ApplicationStatus {
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

export enum TagVariant {
  RED = 'red',
  BLUEBERRY = 'blueberry',
  BLUE = 'blue',
}

export interface StateMetaData {
  title?: string
  description?: string
  tag?: {
    label?: string
    variant?: TagVariant
  }
}

export interface Application {
  id: string
  state: string
  stateMetaData?: StateMetaData
  applicant: string
  assignees: string[]
  typeId: ApplicationTypes
  modified: Date
  created: Date
  attachments: object
  answers: FormValue
  externalData: ExternalData
  name?: string
  progress?: number
  status: ApplicationStatus
}
