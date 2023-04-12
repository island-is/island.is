import { ApiScopeUserAccessDTO } from './api-scope-user-access.dto'

export class ApiScopeUserDTO {
  name!: string
  nationalId!: string
  email!: string
  userAccess?: ApiScopeUserAccessDTO[] = []
}
