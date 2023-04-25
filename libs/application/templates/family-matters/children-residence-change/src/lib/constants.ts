export enum ApplicationStates {
  DRAFT = 'draft',
  IN_REVIEW = 'inReview',
  SUBMITTED = 'submitted',
  COMPLETED = 'completed',
  REJECTEDBYORGANIZATION = 'rejectedbyorganization',
  REJECTEDBYPARENTB = 'rejectedbyparentb',
  WAITINGFORORGANIZATION = 'waitingfororganization',
}

export enum Roles {
  ParentA = 'parentA',
  ParentB = 'parentB',
  Organization = 'organization',
}
