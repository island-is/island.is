import { UserRole } from '../lib/graphql/schema'
import type { Institution } from './institution'

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

export const prosecutionRoles = [UserRole.Prosecutor, UserRole.Representative]

export function isProsecutionRole(role: UserRole): boolean {
  return prosecutionRoles.includes(role)
}

export const courtRoles = [UserRole.Judge, UserRole.Registrar]

export function isCourtRole(role: UserRole): boolean {
  return courtRoles.includes(role)
}

export const extendedCourtRoles = [
  UserRole.Judge,
  UserRole.Registrar,
  UserRole.Assistant,
]

export function isExtendedCourtRole(role: UserRole): boolean {
  return extendedCourtRoles.includes(role)
}
