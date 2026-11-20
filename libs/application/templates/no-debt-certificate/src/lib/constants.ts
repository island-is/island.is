import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  COMPLETED = 'completed',
  INCOMPLETED = 'incompleted',
}

export enum CertificateLanguage {
  IS = 'is',
  EN = 'en',
}

export enum Roles {
  APPLICANT = 'applicant',
}
