import { DefaultEvents } from '@island.is/application/types'

export enum ApiActions {
  createApplication = 'createApplication',
  doStuffThatFails = 'doStuffThatFails',
  completeApplication = 'completeApplication',
  getReferenceData = 'getReferenceData',
  getAnotherReferenceData = 'getAnotherReferenceData',
}

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.ABORT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  COMPLETED = 'completed',
  PAYMENT = 'payment',
  REVIEW = 'review',
}

export enum Roles {
  APPLICANT = 'applicant',
}
