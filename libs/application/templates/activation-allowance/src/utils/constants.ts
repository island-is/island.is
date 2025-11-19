import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.ABORT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  TERMS = 'terms',
  DRAFT = 'draft',
  COMPLETED = 'completed',
  PAYMENT = 'payment',
  REVIEW = 'review',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export const MONTHS: Record<number, { en: string; is: string }> = {
  1: { en: 'January', is: 'Janúar' },
  2: { en: 'February', is: 'Febrúar' },
  3: { en: 'March', is: 'Mars' },
  4: { en: 'April', is: 'Apríl' },
  5: { en: 'May', is: 'Maí' },
  6: { en: 'June', is: 'Júní' },
  7: { en: 'July', is: 'Júlí' },
  8: { en: 'August', is: 'Ágúst' },
  9: { en: 'September', is: 'September' },
  10: { en: 'October', is: 'Október' },
  11: { en: 'November', is: 'Nóvember' },
  12: { en: 'December', is: 'Desember' },
}

export const MAX_INCOME_PAGES = 6
