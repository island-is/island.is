import {
  HomeCircumstances,
  ApplicationState,
  FileType,
  Employment,
  ApplicationEventType,
  StaffRole,
  ApplicationStateUrl,
  FamilyStatus,
  AidType,
  UserType,
  ApplicationHeaderSortByEnum,
} from './enums'

export interface GetSignedUrl {
  folder: string
  fileName: string
}

export type ReactSelectOption = { label: string; value: string | number }

export interface GetSignedUrlForAllFiles {
  getSignedUrlForAllFilesId: SignedUrl[]
}

export interface SignedUrl {
  url: string
  key: string
}

export interface CreateFilesResponse {
  success: boolean
  files?: ApplicationFile[]
}

export interface Staff {
  id: string
  nationalId: string
  name: string
  municipalityIds: string[]
  roles: StaffRole[]
  active: boolean
  phoneNumber?: string
  nickname?: string
  email?: string
  usePseudoName?: boolean
}

export interface UpdateStaff {
  name?: string
  nationalId?: string
  roles?: StaffRole[]
  active?: boolean
  nickname?: string
  email?: string
  usePseudoName?: boolean
}

export interface Aid {
  ownPlace: number
  registeredRenting: number
  unregisteredRenting: number
  livesWithParents: number
  unknown: number
  withOthers: number
  municipalityId: string
  type: AidType
}

export interface Amount {
  applicationId?: string
  aidAmount: number
  income?: number
  personalTaxCredit: number
  spousePersonalTaxCredit?: number
  tax: number
  finalAmount: number
  deductionFactors?: DeductionFactors[]
}

export interface DeductionFactors {
  amount?: number
  description?: string
}

export interface NavigationProps {
  activeSectionIndex: number
  activeSubSectionIndex?: number
  prevUrl: string | undefined
  nextUrl: string | undefined
}

export interface FormSpouse {
  nationalId?: string
  name?: string
  email?: string
}

export interface User {
  nationalId: string
  name: string
  phoneNumber?: string
  currentApplicationId?: string
  spouse?: Spouse
  staff?: Staff
  formSpouse?: FormSpouse
  address?: Address
}

export interface Address {
  streetName: string
  postalCode: string
  city: string
  municipalityCode: string
}

export interface UpdateApplication {
  state?: ApplicationState
  event: ApplicationEventType
  rejection?: string
  comment?: string
  staffId?: string
  spousePhoneNumber?: string
  spouseEmail?: string
  spouseName?: string
  spouseFormComment?: string
  amount?: Amount
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
  staffNationalId?: string
  staffName?: string
  emailSent?: boolean
}

export interface UpdateAdmin {
  id: string
  name: string
  municipalityIds: string[]
}

export interface Municipality {
  id: string
  name: string
  active: boolean
  municipalityId: string
  individualAid: Aid
  cohabitationAid: Aid
  homepage?: string
  email?: string
  rulesHomepage?: string
  numberOfUsers?: number
  adminUsers?: Staff[]
  allAdminUsers?: UpdateAdmin[]
  usingNav: boolean
  navUrl?: string
  navUsername?: string
  navPassword?: string
}

export interface UpdateMunicipalityActivity {
  active: boolean
}

export interface CreateMunicipality {
  name: string
  municipalityId: string
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
  spouseName?: string
  familyStatus: FamilyStatus
  streetName?: string
  postalCode?: string
  city?: string
  municipalityCode: string
  applicationSystemId?: string
  hasFetchedDirectTaxPayment: boolean
}

export interface ApplicantEmailData {
  header: string
  content: string
  title: string
  applicationChange: string
  applicationMonth: string
  applicationYear: number
  applicationLink: string
  applicantEmail: string
  municipality: Municipality
  applicationLinkText: string
}

export interface ApplicationFilters {
  New: number
  InProgress: number
  DataNeeded: number
  Rejected: number
  Approved: number
  MyCases: number
}

export interface PersonalTaxReturn {
  key: string
  name: string
  size: number
}

export interface DirectTaxPayment {
  totalSalary: number
  payerNationalId: string
  personalAllowance: number
  withheldAtSource: number
  month: number
  year: number
  userType: UserType
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
  spouseFormComment?: string
  state: ApplicationState
  files?: ApplicationFile[]
  comment?: string
  rejection?: string
  staff?: Staff
  applicationEvents?: ApplicationEvent[]
  amount?: Amount
  spouseNationalId?: string
  spouseEmail?: string
  spousePhoneNumber?: string
  spouseName?: string
  familyStatus: FamilyStatus
  streetName?: string
  postalCode?: string
  city?: string
  municipalityCode: string
  directTaxPayments: DirectTaxPayment[]
  hasFetchedDirectTaxPayment: boolean
  spouseHasFetchedDirectTaxPayment: boolean
  applicationSystemId?: string
  navSuccess?: boolean
}

export interface GetSignedUrlForId {
  id: string
}

export interface Spouse {
  hasPartnerApplied: boolean
  hasFiles: boolean
  applicantName: string
  applicantSpouseEmail: string
}

export interface UpdateApplicationTableResponseType {
  applications: Application[]
  filters: ApplicationFilters
}

export interface UpdateApplicationResponseType {
  application: Application
  filters?: ApplicationFilters
}

export interface NationalRegistryData {
  nationalId: string
  fullName: string
  address: {
    streetName: string
    postalCode: string
    city: string
    municipalityCode: string
  }
  spouse?: {
    nationalId?: string
    maritalStatus?: string
    name?: string
  }
}

export interface ServiceCenter {
  name: string
  number: number
  phone?: string
  address?: string
  addressPostalCode?: string
  postalCodes?: number[]
  active?: boolean
  link?: string
}
export interface SortableTableHeaderProps {
  sortBy: ApplicationHeaderSortByEnum
  title: string
}
export interface TableHeadersProps {
  title: string
}

export interface CreateStaff {
  name: string
  email: string
  nationalId: string
  roles: StaffRole[]
  municipalityNames?: string[]
  municipalityIds?: string[]
}

export interface CreateStaffMunicipality {
  municipalityId: string
  municipalityName: string
  municipalityHomepage?: string
}

export interface Calculations {
  title: string
  calculation: string
}

export interface ApplicationProfileInfo {
  title: string
  content?: string
  link?: string
  onclick?: () => void
  other?: string
  fullWidth?: boolean
}

export interface ApplicationPagination {
  applications: Application[]
  totalCount: number
  staffList: any[]
}
