export enum TemplateApiActions {
  submitApplication = 'submitApplication',
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
  NOCONTRACTS = 'noContracts',
}

export enum TerminationTypes {
  CANCELATION = 'cancelation',
  TERMINATION = 'termination',
}

export enum ContractTypes {
  BOUND = 'Tímabundinn samningur',
  UNBOUND = 'Ótímabundinn samningur',
}
