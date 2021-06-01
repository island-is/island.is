import { Constituencies } from './types'

export enum API_MODULE_ACTIONS {
  CreateEndorsementList = 'createEndorsementList',
  AssignSupremeCourt = 'assignSupremeCourt',
  ApplicationRejected = 'applicationRejected',
  ApplicationApproved = 'applicationApproved',
  PartyLetter = 'partyLetter',
}

export const constituencyMapper: Record<
  Constituencies,
  {
    low: number
    high: number
  }
> = {
  // low: parliamentary seats * 30, high: parliamentary seats * 40
  Norðausturkjördæmi: { low: 300, high: 400 },
  Norðvesturkjördæmi: { low: 240, high: 320 },
  'Reykjavíkurkjördæmi norður': { low: 330, high: 440 },
  'Reykjavíkurkjördæmi suður': { low: 330, high: 440 },
  Suðurkjördæmi: { low: 300, high: 400 },
  Suðvesturkjördæmi: { low: 390, high: 520 },
}

export enum States {
  DRAFT = 'draft',
  COLLECT_ENDORSEMENTS = 'collectEndorsements',
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
