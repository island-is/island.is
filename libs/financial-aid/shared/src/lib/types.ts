export enum HomeCircumstances {
  UNKNOWN = 'Unknown',
  WITHPARENTS = 'WithParents',
  WITHOTHERS = 'WithOthers',
  OWNPLACE = 'OwnPlace',
  REGISTEREDLEASE = 'RegisteredLease',
  OTHER = 'Other',
}

export enum Employment {
  WORKING = 'Working',
  UNEMPLOYED = 'Unemployed',
  CANNOTWORK = 'CannotWork',
  OTHER = 'Other',
}

export enum State {
  NEW = 'New',
  INPROGRESS = 'InProgress',
  REJECTED = 'Rejected',
  APPROVED = 'Approved',
}

export interface Application {
  id: string
  created: string
  modified: string
  nationalId: string
  name: string
  phoneNumber: string
  email: string
  homeCircumstances: HomeCircumstances
  student: boolean
  employment: Employment
  hasIncome: boolean
  usePersonalTaxCredit: boolean
  bankNumber?: string
  ledger?: string
  accountNumber?: string
  interview?: boolean
  employmentCustom?: string
  homeCircumstancesCustom?: string
  studentCustom?: string
  formComment?: string
  state?: State
}

export interface CreateApplication {
  nationalId: string
  name: string
  phoneNumber: string
  email: string
  homeCircumstances: HomeCircumstances
  student: boolean
  employment: Employment
  hasIncome: boolean
  usePersonalTaxCredit: boolean
  bankNumber?: string
  ledger?: string
  accountNumber?: string
  interview?: boolean
  employmentCustom?: string
  homeCircumstancesCustom?: string
  studentCustom?: string
  formComment?: string
  state?: State
}

export interface UpdateApplication {
  id: string
  state?: State
}

export interface Municipality {
  id: string
  // created: string
  // modified: string
  name: string
  settings: MunicipalitySettings
}

export interface MunicipalitySettings {
  aid: {
    ownApartmentOrLease: number
    withOthersOrUnknow: number
    withParents: number
  }
}

export interface NavigationProps {
  activeSectionIndex: number
  activeSubSectionIndex?: number
  prevUrl: string | undefined
  nextUrl: string | undefined
}

export interface User {
  nationalId: string
  name: string
  phoneNumber: string
}

export interface UsStaffer {
  nationalId: string
  name: string
  phoneNumber: string
}

export type KeyMapping<TKey extends string, TValue> = { [K in TKey]: TValue }

// export type HomeCircumstances =
//   | 'Unknown'
//   | 'WithParents'
//   | 'WithOthers'
//   | 'OwnPlace'
//   | 'RegisteredLease'
//   | 'Other'

// export type Employment = 'Working' | 'Unemployed' | 'CannotWork' | 'Other'
