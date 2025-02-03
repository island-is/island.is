import { YesOrNo } from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
}
export enum Roles {
  APPLICANT = 'applicant',
  ACTOR = 'actor',
}

export const SEND_HOME = 'sendHome'
export const PICK_UP = 'pickUp'

export interface PSignFakeData {
  useFakeData?: YesOrNo
  qualityPhoto?: YesOrNo
}

export enum ApiActions {
  submitApplication = 'submitApplication',
}

export const UPLOAD_ACCEPT = '.jpg, .jpeg, .png'
