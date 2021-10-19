import {
  HomeCircumstances,
  ApplicationState,
  FileType,
  Employment,
  ApplicationEventType,
  RolesRule,
  StaffRole,
  ApplicationStateUrl,
  FamilyStatus,
} from './enums'

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

export interface Staff {
  id: string
  nationalId: string
  name: string
  municipalityId: string
  role: StaffRole
  active: boolean
  phoneNumber?: string
}

export interface MunicipalitySettings {
  homePage?: string
  aid: MunicipalityAid
}

export interface MunicipalityAid {
  ownApartmentOrLease: number
  withOthersOrUnknow: number
  withParents: number
}

export interface NavigationProps {
  activeSectionIndex: number
  activeSubSectionIndex?: number
  prevUrl: string | undefined
  nextUrl: string | undefined
}

export interface Spouse {
  nationalId?: string
  email?: string
}

export interface User {
  nationalId: string
  name: string
  phoneNumber?: string
  folder: string
  service: RolesRule
  currentApplication?: CurrentApplication
  isSpouse?: boolean
  staff?: Staff
  postalCode?: number
}

export interface UpdateApplication {
  state: ApplicationState
  event: ApplicationEventType
  amount?: number
  rejection?: string
  comment?: string
  staffId?: string
}

export interface UpdateApplicationTable {
  state: ApplicationState
  staffId: string
  stateUrl: ApplicationStateUrl
  event: ApplicationEventType
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
  name: string
  homePage?: string
  aid: MunicipalityAid
}

export interface CurrentApplication {
  id: string
  homeCircumstances: HomeCircumstances
  usePersonalTaxCredit: boolean
  state: ApplicationState
  created: string
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
  phoneNumber?: string
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
  spouseNationalId?: string
  spouseEmail?: string
  familyStatus: FamilyStatus
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
  phoneNumber?: string
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
  staff?: Staff
  applicationEvents?: ApplicationEvent[]
  spouseNationalId?: string
  spouseEmail?: string
  familyStatus: FamilyStatus
}

export interface GetSignedUrlForId {
  id: string
}

export interface HasSpouseApplied {
  res: boolean
}

export interface UpdateApplicationTableResponseType {
  applications: Application[]
  filters: ApplicationFilters
}
