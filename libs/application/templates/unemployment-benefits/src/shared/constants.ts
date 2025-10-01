import { DefaultEvents } from '@island.is/application/types'

export enum ApiActions {
  submitApplication = 'submitApplication',
}

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

export const UPLOAD_ACCEPT = 'pdf, .doc, .docx, .png, .jpg, .jpeg'

export const FILE_SIZE_LIMIT = 10000000 // 10MB

export enum PaymentTypeIds {
  SUPPLEMENTARY_FUND_TYPE_ID = 'db8e9763-d3b4-4365-aa15-62da6a522035', // Greiðslur frá séreignasjóð
  PENSION_FUND_TYPE_ID = '3f42d28e-0962-4ebd-b64d-6abfe1dd2350', // Greiðslur frá lífeyrissjóð
  SICKNESS_PAYMENTS_TYPE_ID = 'e960485c-e878-437a-9a68-0d6d16dbe3e7', // Greiðslur sjúkradagpeninga
  INSURANCE_PAYMENTS_TYPE_ID = '40f3f704-668c-4dd2-8a41-87657da9daef', // Greiðslur frá Tryggingastofnun
  REHAB_PENSION_ID = 'asdf', // sjúkra og endurhæfingalífeyrir TODO
  SPOUSE_PENSION = '1234', // Makalífeyrir TODO
}
