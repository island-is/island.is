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
  getLicenses = 'getLicenses',
  submitApplication = 'submitApplication',
}

export enum AddressDeliveryType {
  CURRENT = 'CurrentAddress',
  OTHER = 'OtherAddress',
}

export type CurrentAddress = {
  streetAddress?: string
  postalCode?: string
  city?: string
}
