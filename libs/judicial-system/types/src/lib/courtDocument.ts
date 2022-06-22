import { UserRole } from './user'

export interface CourtDocument {
  name: string
  submittedBy: UserRole
}
