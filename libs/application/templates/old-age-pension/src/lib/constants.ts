import { DefaultEvents } from '@island.is/application/types'

export const YES = 'yes'
export const NO = 'no'
// export const MONTHS = ['Janúar', 'Febrúar', 'Mars', 'Apríl', 'Maí', 'Júní', 'Júlí', 'Ágúst', 'September', 'Oktorber', 'Nóvember', 'Desember']
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Agust', 'September', 'October', 'November', 'December']

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  PREREQUESITES = 'prerequesites',
  DRAFT = 'draft',
  DONE = 'done',
}
