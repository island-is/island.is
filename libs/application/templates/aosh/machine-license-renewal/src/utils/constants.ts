import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.ABORT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  PAYMENT = 'payment',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum ApiActions {
  getWorkMachineLicense = 'getWorkMachineLicense',
  submitApplication = 'submitApplication',
  verifyPaymentReceived = 'verifyPaymentReceived',
}

export enum DeliveryMethod {
  LEGAL_DOMICILE = 'legalDomicile',
  OTHER_ADDRESS = 'otherAddress',
}
