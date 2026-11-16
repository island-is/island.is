import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type: DefaultEvents.SUBMIT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum ApiModuleActions {
  getChildren = 'getChildren',
  getLanguages = 'getLanguages',
  getAvailableLocations = 'getAvailableLocations',
  getSpeechPathologists = 'getSpeechPathologists',
  getRejectionReasons = 'getRejectionReasons',
  sendApplication = 'sendApplication',
}
