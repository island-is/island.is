export enum SelfOrOthers {
  self = 'self',
  others = 'others',
}

export enum IndividualOrCompany {
  individual = 'individual',
  company = 'company',
}

export enum TrueOrFalse {
  true = 'true',
  false = 'false',
}

export enum PaymentOptions {
  cashOnDelivery = 'cashOnDelivery',
  putIntoAccount = 'putIntoAccount',
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  SUBMIT = 'submit',
  PAYMENT = 'payment',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum ApiActions {
  getExamCategories = 'getExamCategories',
  getPostcodes = 'getPostcodes',
  submitApplication = 'submitApplication',
}
