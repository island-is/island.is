import { Institution, InstitutionType } from './institution'

export enum UserRole {
  PROSECUTOR = 'PROSECUTOR', // sækjandi
  PROSECUTOR_REPRESENTATIVE = 'PROSECUTOR_REPRESENTATIVE', // fulltrúi
  REGISTRAR = 'REGISTRAR', // dómritari
  JUDGE = 'JUDGE', // dómari
  ASSISTANT = 'ASSISTANT', // aðstoðarmaður dómara
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

export const prosecutionRoles: string[] = [
  UserRole.PROSECUTOR,
  UserRole.PROSECUTOR_REPRESENTATIVE,
]

export function isProsecutionRole(role?: string): boolean {
  if (!role) {
    return false
  }

  return prosecutionRoles.includes(role)
}

export function isProsecutionUser(user: User): boolean {
  return (
    user.institution?.type === InstitutionType.PROSECUTORS_OFFICE &&
    isProsecutionRole(user.role)
  )
}

export const courtRoles: string[] = [UserRole.JUDGE, UserRole.REGISTRAR]

export function isCourtRole(role?: string): boolean {
  if (!role) {
    return false
  }

  return courtRoles.includes(role)
}

export const extendedCourtRoles: string[] = [
  UserRole.JUDGE,
  UserRole.REGISTRAR,
  UserRole.ASSISTANT,
]

export function isExtendedCourtRole(role?: string): boolean {
  if (!role) {
    return false
  }
  return extendedCourtRoles.includes(role)
}

export function isDistrictCourtUser(user: User): boolean {
  return (
    user.institution?.type === InstitutionType.DISTRICT_COURT &&
    isExtendedCourtRole(user.role)
  )
}

export const appealsCourtRoles: string[] = [
  UserRole.JUDGE,
  UserRole.REGISTRAR,
  UserRole.ASSISTANT,
]

function isAppealsCourtRole(role: string): boolean {
  return appealsCourtRoles.includes(role)
}

export function isAppealsCourtUser(user: User): boolean {
  return (
    user.institution?.type === InstitutionType.COURT_OF_APPEALS &&
    isAppealsCourtRole(user.role)
  )
}

export const prisonSystemRoles: string[] = [UserRole.PRISON_SYSTEM_STAFF]

function isPrisonSystemRole(role: string): boolean {
  return prisonSystemRoles.includes(role)
}

export function isPrisonSystemUser(user: User): boolean {
  return (
    [InstitutionType.PRISON, InstitutionType.PRISON_ADMIN].includes(
      user.institution?.type as InstitutionType,
    ) && isPrisonSystemRole(user.role)
  )
}

export const defenceRoles: string[] = [UserRole.DEFENDER]

function isDefenceRole(role: string): boolean {
  return defenceRoles.includes(role)
}

export function isDefenceUser(user: User): boolean {
  return isDefenceRole(user.role)
}
