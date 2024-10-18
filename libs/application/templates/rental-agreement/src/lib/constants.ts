import { StateLifeCycle } from '@island.is/application/types'

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  ONEACCEPTED = 'oneAccepted',
  TWOACCEPTED = 'twoAccepted',
  SIGNING = 'signing',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum rentalHousingCategoryTypes {
  ENTIRE_HOME = 'entireHome',
  ROOM = 'room',
  COMMERCIAL = 'commercial',
}

export enum rentalHousingCategoryClass {
  GENERAL_MARKET = 'generalMarket',
  SPECIAL_GROUPS = 'specialGroups',
}

export enum rentalHousingCategoryClassGroup {
  STUDENT_HOUSING = 'studentHousing',
  SENIOR_CITIZEN_HOUSING = 'seniorCitizenHousing',
  COMMUNE = 'commune',
  HALFWAY_HOUSE = 'halfwayHouse',
  SOCIAL_HOUSING = 'socialHousing',
  INCOME_BASED_HOUSING = 'incomeBasedHousing',
  EMPLOYEE_HOUSING = 'employeeHousing',
}

export enum rentalHousingConditionInspector {
  CONTRACT_PARTIES = 'contractParties',
  INDEPENDENT_PARTY = 'independentParty',
}

export const pruneAfterDays = (Days: number): StateLifeCycle => {
  return {
    shouldBeListed: false,
    shouldBePruned: true,
    whenToPrune: Days * 24 * 3600 * 1000,
  }
}
