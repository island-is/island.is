import {
  adminInstitutionScope,
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
export interface UserDescriptor {
  name?: string
  institution?: { name?: string }
}

export interface InstitutionUser {
  id?: string | null
  role?: string | null
  institution?: {
    id?: string | null
    type?: string | null
  } | null
}

const prosecutionOfficeTypes: string[] = prosecutorsOfficeTypes

export const prosecutionRoles: UserRole[] = [
  UserRole.PROSECUTOR,
  UserRole.PROSECUTOR_REPRESENTATIVE,
]
const prosecutionsRolesStrings: string[] = prosecutionRoles

export const isProsecutionUser = (user?: InstitutionUser): boolean => {
  return Boolean(
    user?.role &&
      prosecutionsRolesStrings.includes(user.role) &&
      user.institution?.type &&
      prosecutionOfficeTypes.includes(user.institution.type),
  )
}

export const isProsecutorUser = (user?: InstitutionUser): boolean => {
  return Boolean(
    user?.role &&
      user.role === UserRole.PROSECUTOR &&
      user.institution?.type &&
      prosecutionOfficeTypes.includes(user.institution.type),
  )
}

export const isProsecutorRepresentativeUser = (
  user?: InstitutionUser,
): boolean => {
  return Boolean(
    user?.role &&
      user.role === UserRole.PROSECUTOR_REPRESENTATIVE &&
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

export const publicProsecutionOfficeRoles: UserRole[] = [
  UserRole.PUBLIC_PROSECUTOR_STAFF,
]
const publicProsecutionOfficeRolesStrings: string[] =
  publicProsecutionOfficeRoles

export const isPublicProsecutionOfficeUser = (
  user?: InstitutionUser,
): boolean => {
  return Boolean(
    user?.role &&
      publicProsecutionOfficeRolesStrings.includes(user.role) &&
      user.institution?.type === InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
  )
}

export const districtCourtRoles: UserRole[] = [
  UserRole.DISTRICT_COURT_JUDGE,
  UserRole.DISTRICT_COURT_REGISTRAR,
  UserRole.DISTRICT_COURT_ASSISTANT,
]
const districtCourtRolesStrings: string[] = districtCourtRoles

export const isDistrictCourtUser = (user?: InstitutionUser): boolean => {
  return Boolean(
    user?.role &&
      districtCourtRolesStrings.includes(user.role) &&
      user.institution?.type === InstitutionType.DISTRICT_COURT,
  )
}

export const courtOfAppealsRoles: UserRole[] = [
  UserRole.COURT_OF_APPEALS_JUDGE,
  UserRole.COURT_OF_APPEALS_REGISTRAR,
  UserRole.COURT_OF_APPEALS_ASSISTANT,
]
const courtOfAppealsRolesStrings: string[] = courtOfAppealsRoles

export const isCourtOfAppealsUser = (user?: InstitutionUser): boolean => {
  return Boolean(
    user?.role &&
      courtOfAppealsRolesStrings.includes(user.role) &&
      user.institution?.type === InstitutionType.COURT_OF_APPEALS,
  )
}

export const prisonSystemRoles: UserRole[] = [UserRole.PRISON_SYSTEM_STAFF]
const prisonSystemRolesStrings: string[] = prisonSystemRoles

export const isPrisonSystemUser = (user?: InstitutionUser): boolean => {
  return Boolean(
    user?.role &&
      prisonSystemRolesStrings.includes(user.role) &&
      (user.institution?.type === InstitutionType.PRISON ||
        user.institution?.type === InstitutionType.PRISON_ADMIN),
  )
}

export const isPrisonAdminUser = (user?: InstitutionUser): boolean =>
  Boolean(
    user?.role &&
      prisonSystemRolesStrings.includes(user.role) &&
      user.institution?.type === InstitutionType.PRISON_ADMIN,
  )

export const isPrisonStaffUser = (user?: InstitutionUser): boolean =>
  Boolean(
    user?.role &&
      prisonSystemRolesStrings.includes(user.role) &&
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

const superAdminRoles: string[] = [UserRole.ADMIN]

const isSuperAdminUser = (user?: InstitutionUser): boolean => {
  return Boolean(user?.role && superAdminRoles.includes(user.role))
}

const localAdminRoles: UserRole[] = [UserRole.LOCAL_ADMIN]
const localAdminRolesStrings: string[] = localAdminRoles

const isLocalAdminUser = (user?: InstitutionUser): boolean => {
  return Boolean(
    user?.role &&
      localAdminRolesStrings.includes(user.role) &&
      user.institution,
  )
}

export const isAdminUser = (user?: InstitutionUser): boolean => {
  return isSuperAdminUser(user) || isLocalAdminUser(user)
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

export const getAdminUserInstitutionScope = (
  user?: InstitutionUser,
): InstitutionType[] => {
  if (!user) {
    return []
  }

  if (isSuperAdminUser(user)) {
    return Object.values(InstitutionType)
  }

  if (isLocalAdminUser(user)) {
    return adminInstitutionScope[user.institution?.type as InstitutionType]
  }

  return []
}

const institutionUserRoles: { [key in InstitutionType]: UserRole[] } = {
  [InstitutionType.POLICE_PROSECUTORS_OFFICE]: prosecutionRoles,
  [InstitutionType.DISTRICT_PROSECUTORS_OFFICE]: prosecutionRoles,
  [InstitutionType.PUBLIC_PROSECUTORS_OFFICE]: [
    ...prosecutionRoles,
    ...publicProsecutionOfficeRoles,
  ],
  [InstitutionType.DISTRICT_COURT]: districtCourtRoles,
  [InstitutionType.COURT_OF_APPEALS]: courtOfAppealsRoles,
  [InstitutionType.PRISON]: prisonSystemRoles,
  [InstitutionType.PRISON_ADMIN]: prisonSystemRoles,
  [InstitutionType.NATIONAL_COMMISSIONERS_OFFICE]: [],
  [InstitutionType.COURT_ADMINISTRATION_OFFICE]: [],
}

export const getAdminUserInstitutionUserRoles = (
  user?: InstitutionUser,
  institutionType?: InstitutionType,
): UserRole[] => {
  if (!user || !institutionType) {
    return []
  }

  if (!getAdminUserInstitutionScope(user).includes(institutionType)) {
    return []
  }

  if (isSuperAdminUser(user)) {
    return institutionUserRoles[institutionType].concat(localAdminRoles)
  }

  return institutionUserRoles[institutionType]
}

export const getContactInformation = (user: {
  name: string
  email: string
}) => ({
  name: user.name,
  email: user.email,
})
