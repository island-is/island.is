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
    parliamentary_seats: number
  }
> = {
  partyApplicationReykjavikurkjordaemiSudur2021: {
    region_name: 'Reykjavíkurkjördæmi suður',
    region_number: 1,
    parliamentary_seats: 11,
  },
  partyApplicationReykjavikurkjordaemiNordur2021: {
    region_name: 'Reykjavíkurkjördæmi norður',
    region_number: 2,
    parliamentary_seats: 11,
  },

  partyApplicationSudvesturkjordaemi2021: {
    region_name: 'Suðvesturkjördæmi',
    region_number: 3,
    parliamentary_seats: 13,
  },
  partyApplicationNordvesturkjordaemi2021: {
    region_name: 'Norðvesturkjördæmi',
    region_number: 4,
    parliamentary_seats: 8,
  },
  partyApplicationNordausturkjordaemi2021: {
    region_name: 'Norðausturkjördæmi',
    region_number: 5,
    parliamentary_seats: 10,
  },
  partyApplicationSudurkjordaemi2021: {
    region_name: 'Suðurkjördæmi',
    region_number: 6,
    parliamentary_seats: 10,
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



export enum SelectedRadio {
  AUTO,
  RANDOM,
}
