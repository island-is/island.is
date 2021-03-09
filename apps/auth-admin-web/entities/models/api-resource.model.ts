import { ApiResourceScope } from './api-resource-scope.model'
import { ApiResourceSecret } from './api-resource-secret.model'
import { ApiResourceUserClaim } from './api-resource-user-claim.model'

export class ApiResource {
  nationalId!: string
  name!: string
  enabled!: boolean
  displayName!: string
  description!: string
  showInDiscoveryDocument!: boolean
  archived!: Date
  contactEmail!: string
  public userClaims?: ApiResourceUserClaim[]
  readonly created!: Date
  readonly modified?: Date
  public scopes?: ApiResourceScope[]
  readonly apiSecrets?: ApiResourceSecret[]
}
