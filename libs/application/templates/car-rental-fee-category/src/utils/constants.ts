import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.ABORT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum UploadSelection {
  MULTI = 'multiSelection',
  SINGLE = 'singleSelection',
}

export enum RateCategory {
  DAYRATE = 'Daggjald',
  KMRATE = 'Kilometragjald',
}
