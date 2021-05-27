export enum API_MODULE_ACTIONS {
  CreateEndorsementList = 'createEndorsementList',
  AssingMinistryOfJustice = 'assignMinistryOfJustice',
  ApplicationApproved = 'applicationApproved',
  ApplicationRejected = 'applicationRejected',
  SubmitPartyLetter = 'submitPartyLetter',
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

export const csvFileName = (partyLetter: string, partyName: string): string => {
  const strippedPartyName = partyName.toString().replace(/\s/g, '')
  const strippedPartyLetter = partyLetter.toString().replace(/\s/g, '')
  return `Meðmælendalisti-${strippedPartyName}(${strippedPartyLetter}).csv`
}
