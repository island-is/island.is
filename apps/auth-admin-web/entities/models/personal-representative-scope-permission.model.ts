import { PersonalRepresentativePermissionType } from './personal-representative-permission-type.model'

export type ScopePermission = {
  id: string
  rightTypeCode: string
  rightType: PersonalRepresentativePermissionType
  apiScopeName: string
  created: string
  modified: string
}
