import { ApiScopeUserAccessDTO } from './api-scope-user-access.dto'

export class ApiScopeUserDTO {
  nationalId!: string
  email!: string
  userAccess?: ApiScopeUserAccessDTO[] = []
}
