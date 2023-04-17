import type { Institution } from './institution'

export enum UserRole {
  PROSECUTOR = 'PROSECUTOR',
  REPRESENTATIVE = 'REPRESENTATIVE',
  REGISTRAR = 'REGISTRAR',
  JUDGE = 'JUDGE',
  ASSISTANT = 'ASSISTANT',
  ADMIN = 'ADMIN', // Does not exist in the database
  STAFF = 'STAFF',
  DEFENDER = 'DEFENDER', // Does not exist in the database
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

export const extendedCourtRoles: string[] = [
  UserRole.JUDGE,
  UserRole.REGISTRAR,
  UserRole.ASSISTANT,
]

export function isExtendedCourtRole(role: string): boolean {
  return extendedCourtRoles.includes(role)
}

export const prosecutionRoles: string[] = [
  UserRole.PROSECUTOR,
  UserRole.REPRESENTATIVE,
]

export function isProsecutionRole(role?: string): boolean {
  if (!role) {
    return false
  }

  return prosecutionRoles.includes(role)
}

export const courtRoles: string[] = [UserRole.JUDGE, UserRole.REGISTRAR]

export function isCourtRole(role?: string): boolean {
  if (!role) {
    return false
  }

  return courtRoles.includes(role)
}
