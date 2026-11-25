import { DefaultEvents } from '@island.is/application/types'

// Participants are written to Zendesk in a single bulk job, which is limited to 100 items
export const MAX_PARTICIPANTS_PER_APPLICATION = 92

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.ABORT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  COMPLETED = 'completed',
  FULLY_BOOKED = 'fullyBooked',
  PAYMENT = 'payment',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum ApiActions {
  submitApplication = 'submitApplication',
  checkParticipantAvailability = 'checkParticipantAvailability',
}

export enum IndividualOrCompany {
  individual = 'individual',
  company = 'company',
}
