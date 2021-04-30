import { ApiScopeUserAccess } from './api-scope-user-access.model'

export class ApiScopeUser {
  nationalId!: string
  email!: string
  userAccess?: ApiScopeUserAccess[]
  readonly created!: Date
  readonly modified?: Date
}
