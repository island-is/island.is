import { ApplicationTypes } from './ApplicationTypes'
import { DataProviderResult } from './DataProviderResult'

export interface ExternalData {
  [key: string]: DataProviderResult
}

export type Answer = string | number | boolean | Answer[] | FormValue

export interface FormValue {
  [key: string]: Answer
}

export interface Application {
  id: string
  externalId: string
  state: string
  applicant: string
  typeId: ApplicationTypes
  modified: Date
  created: Date
  attachments: object
  answers: FormValue
  externalData: ExternalData
}
