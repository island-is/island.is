import { FormType } from '../forms'
import { DataProviderResult } from './DataProviderResult'

export enum ApplicationState {
  DRAFT = 'DRAFT',
  BEING_PROCESSED = 'BEING_PROCESSED',
  NEEDS_INFORMATION = 'NEEDS_INFORMATION',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  MANUAL_APPROVED = 'MANUAL_APPROVED',
  REJECTED = 'REJECTED',
  UNKNOWN = 'UNKNOWN',
}

export interface ExternalData {
  [key: string]: DataProviderResult
}

export type Answer = string | number | Answer[] | FormValue

export interface FormValue {
  [key: string]: Answer
}

export interface Application {
  id: string
  externalId: string
  state: ApplicationState
  applicant: string
  typeId: FormType
  modified: Date
  created: Date
  attachments: object
  answers: FormValue
  externalData: ExternalData
}
