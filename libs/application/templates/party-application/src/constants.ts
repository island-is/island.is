import { EndorsementListTagsEnum } from './types/schema'

export type EndorsementListTags = Exclude<
  EndorsementListTagsEnum,
  EndorsementListTagsEnum.PartyLetter2021
>

export enum API_MODULE_ACTIONS {
  CreateEndorsementList = 'createEndorsementList',
  AssignSupremeCourt = 'assignSupremeCourt',
  ApplicationRejected = 'applicationRejected',
  ApplicationApproved = 'applicationApproved',
  PartyLetter = 'partyLetter',
}

export const constituencyMapper: Record<
  EndorsementListTags,
  {
    region_name: string
    region_number: number
    // low: parliamentary seats * 30, high: parliamentary seats * 40
    low: number
    high: number
  }
> = {
  partyApplicationReykjavikurkjordaemiSudur2021: {
    region_name: 'Reykjavíkurkjördæmi suður',
    region_number: 1,
    low: 330,
    high: 440,
  },
  partyApplicationReykjavikurkjordaemiNordur2021: {
    region_name: 'Reykjavíkurkjördæmi norður',
    region_number: 2,
    low: 330,
    high: 440,
  },

  partyApplicationSudvesturkjordaemi2021: {
    region_name: 'Suðvesturkjördæmi',
    region_number: 3,
    low: 390,
    high: 520,
  },
  partyApplicationNordvesturkjordaemi2021: {
    region_name: 'Norðvesturkjördæmi',
    region_number: 4,
    low: 240,
    high: 320,
  },
  partyApplicationNordausturkjordaemi2021: {
    region_name: 'Norðausturkjördæmi',
    region_number: 5,
    low: 300,
    high: 400,
  },
  partyApplicationSudurkjordaemi2021: {
    region_name: 'Suðurkjördæmi',
    region_number: 6,
    low: 300,
    high: 400,
  },
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
