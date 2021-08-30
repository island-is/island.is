export enum ApiModuleActions {
  CreateEndorsementList = 'createEndorsementList',
}

export enum States {
  DRAFT = 'draft',
  COLLECT_ENDORSEMENTS = 'collectSignatures',
  APPROVED = 'approved',
}

export enum Roles {
  APPLICANT = 'applicant',
  SIGNATUREE = 'signaturee',
}
