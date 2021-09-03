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

export enum ApplicationState {
  NEW = 'New',
  INPROGRESS = 'InProgress',
  DATANEEDED = 'DataNeeded',
  REJECTED = 'Rejected',
  APPROVED = 'Approved',
}

export enum ApplicationEventType {
  NEW = 'New',
  INPROGRESS = 'InProgress',
  DATANEEDED = 'DataNeeded',
  REJECTED = 'Rejected',
  APPROVED = 'Approved',
  STAFFCOMMENT = 'StaffComment',
}

export enum RolesRule {
  OSK = 'osk',
  VEITA = 'veita',
}

export enum FileType {
  TAXRETURN = 'TaxReturn',
  INCOME = 'Income',
  OTHER = 'Other',
}

export interface ApplicationFilters {
  New: number
  InProgress: number
  DataNeeded: number
  Rejected: number
  Approved: number
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
  state: ApplicationState
  files?: ApplicationFile[]
  amount?: number
  comment?: string
  rejection?: string
}

export interface CurrentApplication {
  id: string
  homeCircumstances: HomeCircumstances
  usePersonalTaxCredit: boolean
  state: ApplicationState
}

export interface ApplicationFile {
  id: string
  created: string
  applicationId: string
  name: string
  key: string
  size: number
  type: FileType
}

export interface CreateApplicationFile {
  name: string
  key: string
  size: number
  type: FileType
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
  state?: ApplicationState
  files: CreateApplicationFile[]
  amount?: number
}

export interface UpdateApplication {
  state: ApplicationState
  amount?: number
  rejection?: string
}

export interface CreateApplicationEvent {
  applicationId: string
  eventType: ApplicationEventType
  comment?: string
}

export interface ApplicationEvent {
  id: string
  created: string
  applicationId: string
  eventType: ApplicationEventType
  comment?: string
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
  folder: string
  service: RolesRule
  currentApplication?: CurrentApplication
}

export type KeyMapping<TKey extends string, TValue> = { [K in TKey]: TValue }

export interface GetSignedUrl {
  fileName: string
}

export interface SignedUrl {
  url: string
  key: string
}

export interface CreateFilesResponse {
  success: boolean
}

// export type HomeCircumstances =
//   | 'Unknown'
//   | 'WithParents'
//   | 'WithOthers'
//   | 'OwnPlace'
//   | 'RegisteredLease'
//   | 'Other'

// export type Employment = 'Working' | 'Unemployed' | 'CannotWork' | 'Other'
