import {
  Institution,
  InstitutionType,
  prosecutorsOfficeTypes,
} from './institution'

export enum UserRole {
  PROSECUTOR = 'PROSECUTOR', // sækjandi
  PROSECUTOR_REPRESENTATIVE = 'PROSECUTOR_REPRESENTATIVE', // fulltrúi
  PUBLIC_PROSECUTOR_STAFF = 'PUBLIC_PROSECUTOR_STAFF', // skrifstofufólk hjá ríkissaksóknara
  DISTRICT_COURT_JUDGE = 'DISTRICT_COURT_JUDGE', // dómari
  DISTRICT_COURT_REGISTRAR = 'DISTRICT_COURT_REGISTRAR', // dómritari
  DISTRICT_COURT_ASSISTANT = 'DISTRICT_COURT_ASSISTANT', // aðstoðarmaður dómara
  COURT_OF_APPEALS_JUDGE = 'COURT_OF_APPEALS_JUDGE', // dómari
  COURT_OF_APPEALS_REGISTRAR = 'COURT_OF_APPEALS_REGISTRAR', // dómritari
  COURT_OF_APPEALS_ASSISTANT = 'COURT_OF_APPEALS_ASSISTANT', // aðstoðarmaður dómara
  PRISON_SYSTEM_STAFF = 'PRISON_SYSTEM_STAFF', // fangelsismálastarfsmaður
  LOCAL_ADMIN = 'LOCAL_ADMIN',
  ADMIN = 'ADMIN', // Does not exist in the database // notendaumsjón
  DEFENDER = 'DEFENDER', // Does not exist in the database // verjandi
}

export interface User {
  id: string
  created: string
  modified: string
  nationalId: string
  name: string
  title: string
  mobileNumber: string
  email: string
  role: UserRole
  institution?: Institution
  active: boolean
  canConfirmIndictment: boolean
  latestLogin?: string
  loginCount?: number
}

interface InstitutionUser {
  id?: string | null
  role?: string | null
  institution?: {
    id?: string | null
    type?: string | null
  } | null
}

const prosecutionOfficeTypes: string[] = prosecutorsOfficeTypes

export const prosecutionRoles: string[] = [
  UserRole.PROSECUTOR,
  UserRole.PROSECUTOR_REPRESENTATIVE,
]

export const isProsecutionUser = (user?: InstitutionUser): boolean => {
  return Boolean(
    user?.role &&
      prosecutionRoles.includes(user.role) &&
      user.institution?.type &&
      prosecutionOfficeTypes.includes(user.institution.type),
  )
}

const publicProsecutionRoles: string[] = [UserRole.PROSECUTOR]

export const isPublicProsecutionUser = (user?: InstitutionUser): boolean => {
  return Boolean(
    user?.role &&
      publicProsecutionRoles.includes(user.role) &&
      user.institution?.type === InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
  )
}

export const publicProsecutionOfficeRoles: string[] = [
  UserRole.PUBLIC_PROSECUTOR_STAFF,
]

export const isPublicProsecutionOfficeUser = (
  user?: InstitutionUser,
): boolean => {
  return Boolean(
    user?.role &&
      publicProsecutionOfficeRoles.includes(user.role) &&
      user.institution?.type === InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
  )
}

export const districtCourtRoles: string[] = [
  UserRole.DISTRICT_COURT_JUDGE,
  UserRole.DISTRICT_COURT_REGISTRAR,
  UserRole.DISTRICT_COURT_ASSISTANT,
]

export const isDistrictCourtUser = (user?: InstitutionUser): boolean => {
  return Boolean(
    user?.role &&
      districtCourtRoles.includes(user.role) &&
      user.institution?.type === InstitutionType.DISTRICT_COURT,
  )
}

export const courtOfAppealsRoles: string[] = [
  UserRole.COURT_OF_APPEALS_JUDGE,
  UserRole.COURT_OF_APPEALS_REGISTRAR,
  UserRole.COURT_OF_APPEALS_ASSISTANT,
]

export const isCourtOfAppealsUser = (user?: InstitutionUser): boolean => {
  return Boolean(
    user?.role &&
      courtOfAppealsRoles.includes(user.role) &&
      user.institution?.type === InstitutionType.COURT_OF_APPEALS,
  )
}

export const prisonSystemRoles: string[] = [UserRole.PRISON_SYSTEM_STAFF]

export const isPrisonSystemUser = (user?: InstitutionUser): boolean => {
  return Boolean(
    user?.role &&
      prisonSystemRoles.includes(user.role) &&
      (user.institution?.type === InstitutionType.PRISON ||
        user.institution?.type === InstitutionType.PRISON_ADMIN),
  )
}

export const isPrisonAdminUser = (user?: InstitutionUser): boolean =>
  Boolean(
    user?.role &&
      prisonSystemRoles.includes(user.role) &&
      user.institution?.type === InstitutionType.PRISON_ADMIN,
  )

export const isPrisonStaffUser = (user?: InstitutionUser): boolean =>
  Boolean(
    user?.role &&
      prisonSystemRoles.includes(user.role) &&
      user.institution?.type === InstitutionType.PRISON,
  )

// Currently, we have a single defender user roles for all legal representative scenarios in the system
export const defenceRoles: string[] = [UserRole.DEFENDER]

// Defender sub roles are inferred based on how legal representative is assigned to the case.
// It is currently used to simplify rendering for the defender responsibility in a given case.
export enum DefenderSubRole {
  DEFENDANT_DEFENDER = 'DEFENDANT_DEFENDER',
  CIVIL_CLAIMANT_LEGAL_SPOKESPERSON = 'CIVIL_CLAIMANT_LEGAL_SPOKESPERSON',
  VICTIM_LAWYER = 'VICTIM_LAWYER',
}

export const isDefenceUser = (user?: InstitutionUser): boolean => {
  return Boolean(user?.role && defenceRoles.includes(user.role))
}

const adminRoles: string[] = [UserRole.ADMIN]

export const isAdminUser = (user?: InstitutionUser): boolean => {
  return Boolean(user?.role && adminRoles.includes(user.role))
}

const localAdminRoles: string[] = [UserRole.LOCAL_ADMIN]

export const isLocalAdminUser = (user?: InstitutionUser): boolean => {
  return Boolean(user?.role && localAdminRoles.includes(user.role))
}

export const isCoreUser = (user?: InstitutionUser): boolean => {
  return (
    isProsecutionUser(user) ||
    isPublicProsecutionOfficeUser(user) ||
    isDistrictCourtUser(user) ||
    isCourtOfAppealsUser(user) ||
    isPrisonSystemUser(user) ||
    isLocalAdminUser(user)
  )
}
