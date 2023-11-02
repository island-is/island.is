import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
}

export const treeSliderConfig = {
  sizes: [
    64, 88, 76, 56, 64, 48, 74, 88, 58, 70, 54, 87, 51, 64, 76, 88, 58, 75, 68,
    84,
  ],
  zIndices: [1, 1, 2, 1, 2, 2, 1, 2, 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1],
}
