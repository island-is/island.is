import { DefaultEvents } from '@island.is/application/types'

// This type specifies which events the application can handle
// Here you can import some of the standard events or you can create a custom event
export type Events = {
  type:
    | DefaultEvents.SUBMIT
    | DefaultEvents.ASSIGN
    | DefaultEvents.EDIT
    | 'customEvent'
}

// This enum specifies the states the application can be in
export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  WAITING_TO_ASSIGN = 'waitingToAssign',
  EDIT = 'edit',
  REVIEW = 'review',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}
