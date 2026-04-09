import { DefaultEvents } from '@island.is/application/types'

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

export enum Reasons {
  MOVING_COUNTRIES = 'movingCountries',
  EDUCATION = 'education',
  FOUND_JOB = 'foundJob',
  MATERNITY_LEAVE = 'maternityLeave',
  CANCELLED = 'cancelled',
  UNABLE = 'unable',
  OTHER = 'other',
}
