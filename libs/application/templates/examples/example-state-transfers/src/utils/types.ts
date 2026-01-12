import { DefaultEvents } from '@island.is/application/types'

// This type specifies which events the application can handle
// Here you can import some of the standard events or you can create a custom event
export type Events = {
  type:
    | DefaultEvents.SUBMIT
    | DefaultEvents.ASSIGN
    | DefaultEvents.EDIT
    | DefaultEvents.APPROVE
    | DefaultEvents.REJECT
    | 'customEvent'
}

// This enum specifies the states the application can be in
export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  IN_REVIEW = 'inReview',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

// This enum corresponds to the functions in the example-state-transfers.service.ts
// We run those functions on state entry when trying to state transfer to a state
export enum ApiActions {
  completeApplication = 'completeApplication',
  moveToReviewState = 'moveToReviewState',
  approveApplication = 'approveApplication',
  rejectApplication = 'rejectApplication',
}
