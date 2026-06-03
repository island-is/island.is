import { DefaultEvents } from '@island.is/application/types'

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
  getHealthCenter = 'getHealthCenter',
}

// Contentful id of the course list page for professional courses
// (námskeið fyrir fagfólk).
export const COURSE_LIST_PAGE_ID_FOR_PROFESSIONALS = '147YftiWFQsBcbUFFe2rj1'

export enum IndividualOrCompany {
  individual = 'individual',
  company = 'company',
}
