import { FormType } from '../forms'
import { DataProviderResult } from '@island.is/application/data-provider'

export type ApplicationStatus =
  | 'approved'
  | 'rejected'
  | 'pending'
  | 'draft'
  | 'in_progress'

export interface ExternalData {
  [key: string]: DataProviderResult
}

export interface Application {
  id: string
  externalId: string
  status: ApplicationStatus
  applicant: string
  typeId: FormType
  modified: Date
  created: Date
  attachments: string[]
  answers: object
  externalData: ExternalData
}
