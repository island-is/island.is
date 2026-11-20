import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type:
    | DefaultEvents.SUBMIT
    | DefaultEvents.ABORT
    | DefaultEvents.APPROVE
    | DefaultEvents.REJECT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  PAYMENT = 'payment',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum Roles {
  APPLICANT = 'applicant',
  ORGANIZATION = 'organization',
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
