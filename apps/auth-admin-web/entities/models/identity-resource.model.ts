import { IdentityResourceUserClaim } from './identity-resource-user-claim.model'

export class IdentityResource {
  name!: string
  enabled!: boolean
  displayName!: string
  description!: string
  showInDiscoveryDocument!: boolean
  archived!: Date
  public userClaims?: IdentityResourceUserClaim[]
  required!: boolean
  emphasize!: boolean
  grantToLegalGuardians!: boolean
  grantToProcuringHolders!: boolean
  allowExplicitDelegationGrant!: boolean
  automaticDelegationGrant!: boolean
  alsoForDelegatedUser!: boolean
  readonly created!: Date
  readonly modified?: Date
}
