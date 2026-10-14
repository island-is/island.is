import type { UserRole } from '@island.is/judicial-system/types'

// Defined in the types lib so that judicial-system-web, which cannot depend on
// this nest library, can verify the same access token in its api routes.
export type { AuthUser, Credentials } from '@island.is/judicial-system/types'

export enum RulesType {
  BASIC,
  FIELD,
  FIELD_VALUES,
}

type RolesBasicRule = {
  role: UserRole
  type: RulesType.BASIC
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canActivate?: (request: any) => boolean
}

type RolesFieldRule = {
  role: UserRole
  type: RulesType.FIELD
  dtoFields: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canActivate?: (request: any) => boolean
}

type RolesFieldValuesRule = {
  role: UserRole
  type: RulesType.FIELD_VALUES
  dtoField: string
  dtoFieldValues: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canActivate?: (request: any) => boolean
}

export type RolesRule =
  | UserRole
  | RolesBasicRule
  | RolesFieldRule
  | RolesFieldValuesRule
