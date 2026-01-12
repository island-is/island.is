import { DefaultEvents } from '@island.is/application/types'

export enum LegalGazetteStates {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum LegalGazetteAPIActions {
  submitApplication = 'submitApplication',
  deleteApplication = 'deleteApplication',
  getTypes = 'getTypes',
}

export const MAX_DATE_REPEATER_LENGTH = 3

export type LegalGazetteEvents =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

export enum LegalGazetteRoles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}
