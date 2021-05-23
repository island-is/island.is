export enum API_MODULE_ACTIONS {
  CreateEndorsementList = 'createEndorsementList',
  AssingToMinistryOfJustice = 'assignToMinistryOfJustice',
  ApplicationApproved = 'applicationApproved',
  ApplicationRejected = 'applicationRejected',
}

export enum States {
  DRAFT = 'draft',
  COLLECT_ENDORSEMENTS = 'collectSignatures',
  REJECTED = 'rejected',
  IN_REVIEW = 'inReview',
  APPROVED = 'approved',
}

export enum Roles {
  APPLICANT = 'applicant',
  SIGNATUREE = 'signaturee',
  ASSIGNEE = 'assignee',
}
