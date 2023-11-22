import { Institution, InstitutionType } from './institution'

export enum UserRole {
  PROSECUTOR = 'PROSECUTOR', // sækjandi
  PROSECUTOR_REPRESENTATIVE = 'PROSECUTOR_REPRESENTATIVE', // fulltrúi
  DISTRICT_COURT_JUDGE = 'DISTRICT_COURT_JUDGE', // dómari
  DISTRICT_COURT_REGISTRAR = 'DISTRICT_COURT_REGISTRAR', // dómritari
  DISTRICT_COURT_ASSISTANT = 'DISTRICT_COURT_ASSISTANT', // aðstoðarmaður dómara
  COURT_OF_APPEALS_JUDGE = 'COURT_OF_APPEALS_JUDGE', // dómari
  COURT_OF_APPEALS_REGISTRAR = 'COURT_OF_APPEALS_REGISTRAR', // dómritari
  COURT_OF_APPEALS_ASSISTANT = 'COURT_OF_APPEALS_ASSISTANT', // aðstoðarmaður dómara
  ADMIN = 'ADMIN', // Does not exist in the database // notendaumsjón
  PRISON_SYSTEM_STAFF = 'PRISON_SYSTEM_STAFF', // fangelsismálastarfsmaður
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
}

export interface CreateUser {
  nationalId: string
  name: string
  title: string
  mobileNumber: string
  email: string
  role: UserRole
  institutionId: string
  active: boolean
}

export interface UpdateUser {
  name?: string
  title?: string
  mobileNumber?: string
  email?: string
  role?: UserRole
  institutionId?: string
  active?: boolean
}

interface InstitutionUser {
  role?: string | null
  institution?: { type?: string | null } | null
}

export const prosecutionRoles: string[] = [
  UserRole.PROSECUTOR,
  UserRole.PROSECUTOR_REPRESENTATIVE,
]

export function isProsecutionUser(user?: InstitutionUser): boolean {
  return Boolean(
    user?.role &&
      prosecutionRoles.includes(user.role) &&
      user?.institution?.type === InstitutionType.PROSECUTORS_OFFICE,
  )
}

export const districtCourtRoles: string[] = [
  UserRole.DISTRICT_COURT_JUDGE,
  UserRole.DISTRICT_COURT_REGISTRAR,
  UserRole.DISTRICT_COURT_ASSISTANT,
]

export function isDistrictCourtUser(user?: InstitutionUser): boolean {
  return Boolean(
    user?.role &&
      districtCourtRoles.includes(user.role) &&
      user?.institution?.type === InstitutionType.DISTRICT_COURT,
  )
}

export const courtOfAppealsRoles: string[] = [
  UserRole.COURT_OF_APPEALS_JUDGE,
  UserRole.COURT_OF_APPEALS_REGISTRAR,
  UserRole.COURT_OF_APPEALS_ASSISTANT,
]

export function isCourtOfAppealsUser(user?: InstitutionUser): boolean {
  return Boolean(
    user?.role &&
      courtOfAppealsRoles.includes(user.role) &&
      user?.institution?.type === InstitutionType.COURT_OF_APPEALS,
  )
}

export const prisonSystemRoles: string[] = [UserRole.PRISON_SYSTEM_STAFF]

export function isPrisonSystemUser(user?: InstitutionUser): boolean {
  return Boolean(
    user?.role &&
      prisonSystemRoles.includes(user.role) &&
      (user?.institution?.type === InstitutionType.PRISON ||
        user?.institution?.type === InstitutionType.PRISON_ADMIN),
  )
}

export const defenceRoles: string[] = [UserRole.DEFENDER]

export function isDefenceUser(user?: InstitutionUser): boolean {
  return Boolean(user?.role && defenceRoles.includes(user.role))
}

const adminRoles: string[] = [UserRole.ADMIN]

export function isAdminUser(user?: InstitutionUser): boolean {
  return Boolean(user?.role && adminRoles.includes(user.role))
}

export function isCoreUser(user?: InstitutionUser): boolean {
  return (
    isProsecutionUser(user) ||
    isDistrictCourtUser(user) ||
    isCourtOfAppealsUser(user) ||
    isPrisonSystemUser(user)
  )
}
