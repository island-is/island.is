import type { UserRole, User } from '@island.is/judicial-system/types'

export type Credentials = {
  user: User
  csrfToken: string
}

export enum RulesType {
  FIELD,
  FIELD_VALUES,
}

export type RolesFieldRule = {
  role: UserRole
  type: RulesType
  dtoFields: string[]
}

export type RolesFieldValuesRule = {
  role: UserRole
  type: RulesType
  dtoField: string
  dtoFieldValues: string[]
}

export type RolesRule = UserRole & RolesFieldRule & RolesFieldValuesRule
