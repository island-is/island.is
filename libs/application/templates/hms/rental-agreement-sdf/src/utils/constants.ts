import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.ABORT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DONE = 'done',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum RentalHousingCategoryTypes {
  ENTIRE_HOME = 'entireHome',
  ROOM = 'room',
  COMMERCIAL = 'commercial',
}

export enum RentalHousingCategoryClass {
  GENERAL_MARKET = 'generalMarket',
  SPECIAL_GROUPS = 'specialGroups',
}

export enum RentalHousingConditionInspector {
  CONTRACT_PARTIES = 'contractParties',
  INDEPENDENT_PARTY = 'independentParty',
}
