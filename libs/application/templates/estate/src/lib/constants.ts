import { DefaultEvents } from '@island.is/application/types'

export const YES = 'Yes'
export const NO = 'No'

export const States = {
  prerequisites: 'prerequisites',
  draft: 'draft',
  done: 'done',
}

export type EstateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

export enum Roles {
  APPLICANT = 'applicant',
  APPLICANT_OFFICIAL_ESTATE = 'applicant_official_estate',
  APPLICANT_NO_PROPERTY = 'applicant_no_property',
  APPLICANT_RESIDENCE_PERMIT = 'applicant_residence_permit',
}

export const EstateTypes = {
  officialEstate: 'Opinber skipti',
  noPropertyEstate: 'Eignalaust dánarbú',
  residencePermit: 'Búsetuleyfi',
}
