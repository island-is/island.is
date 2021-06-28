import { EndorsementListTagsEnum } from './types/schema'

export type EndorsementListTags = Exclude<
  EndorsementListTagsEnum,
  EndorsementListTagsEnum.PartyLetter2021
>

export enum ApiModuleActions {
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
    assignees: string[]
  }
> = {
  partyApplicationReykjavikurkjordaemiSudur2021: {
    region_name: 'Reykjavíkurkjördæmi suður',
    region_number: 1,
    parliamentary_seats: 11,
    assignees: process.env.RVK_SOUTH_ASSIGNEES?.split(',') ?? [],
  },
  partyApplicationReykjavikurkjordaemiNordur2021: {
    region_name: 'Reykjavíkurkjördæmi norður',
    region_number: 2,
    parliamentary_seats: 11,
    assignees: process.env.RVK_NORTH_ASSIGNEES?.split(',') ?? [],
  },

  partyApplicationSudvesturkjordaemi2021: {
    region_name: 'Suðvesturkjördæmi',
    region_number: 3,
    parliamentary_seats: 13,
    assignees: process.env.SOUTH_WEST_ASSIGNEES?.split(',') ?? [],
  },
  partyApplicationNordvesturkjordaemi2021: {
    region_name: 'Norðvesturkjördæmi',
    region_number: 4,
    parliamentary_seats: 8,
    assignees: process.env.NORTH_WEST_ASSIGNEES?.split(',') ?? [],
  },
  partyApplicationNordausturkjordaemi2021: {
    region_name: 'Norðausturkjördæmi',
    region_number: 5,
    parliamentary_seats: 10,
    assignees: process.env.NORTH_ASSIGNEES?.split(',') ?? [],
  },
  partyApplicationSudurkjordaemi2021: {
    region_name: 'Suðurkjördæmi',
    region_number: 6,
    parliamentary_seats: 10,
    assignees: process.env.SOUTH_ASSIGNEES?.split(',') ?? [],
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
