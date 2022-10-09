import { ApiScopeGroup } from './api-scope-group.model'
import { ApiScopeUserClaim } from './api-scope-user-claim.model'

export class ApiScope {
  name!: string
  enabled!: boolean
  displayName!: string
  description!: string
  order!: number
  groupId?: string
  showInDiscoveryDocument!: boolean
  archived!: Date
  public userClaims?: ApiScopeUserClaim[]
  required!: boolean
  emphasize!: boolean
  grantToLegalGuardians!: boolean
  grantToProcuringHolders!: boolean
  grantToPersonalRepresentatives!: boolean
  allowExplicitDelegationGrant!: boolean
  automaticDelegationGrant!: boolean
  alsoForDelegatedUser!: boolean
  isAccessControlled: boolean
  readonly created!: Date
  readonly modified?: Date
  group?: ApiScopeGroup
}
