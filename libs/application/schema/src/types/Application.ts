import { FormType } from '../forms'

export type ApplicationStatus =
  | 'approved'
  | 'rejected'
  | 'pending'
  | 'draft'
  | 'in_progress'

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
}
