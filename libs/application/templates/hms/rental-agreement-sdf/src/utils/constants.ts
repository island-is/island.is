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
  ENTIRE_HOME = 'House_Apartment',
  ROOM = 'Room',
  COMMERCIAL = 'Commercial',
}

export enum RentalHousingCategoryClass {
  GENERAL_MARKET = 'generalMarket',
  SPECIAL_GROUPS = 'specialGroups',
}

export enum RentalHousingCategoryClassGroup {
  STUDENT_HOUSING = 'Student',
  SENIOR_CITIZEN_HOUSING = 'Elderly',
  COMMUNE = 'Disabled',
  HALFWAY_HOUSE = 'HalfwayHouse',
  INCOME_BASED_HOUSING = 'IncomeRestricted',
}

export enum RentalHousingConditionInspector {
  CONTRACT_PARTIES = 'ContractParties',
  INDEPENDENT_PARTY = 'Indipendant',
}

export enum EmergencyExitOptions {
  YES = '1',
  NO = '0',
}
