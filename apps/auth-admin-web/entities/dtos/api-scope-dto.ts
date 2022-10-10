export class ApiScopeDTO {
  constructor() {
    this.enabled = true
    this.name = ''
    this.displayName = ''
    this.description = ''
    this.order = 0
    this.showInDiscoveryDocument = true
    this.required = false
    this.emphasize = false
    this.grantToLegalGuardians = false
    this.grantToProcuringHolders = false
    this.grantToPersonalRepresentatives = false
    this.allowExplicitDelegationGrant = false
    this.automaticDelegationGrant = false
    this.alsoForDelegatedUser = false
    this.isAccessControlled = false
    this.groupId = null
  }

  enabled: boolean
  name: string
  displayName: string
  description: string
  order: number
  showInDiscoveryDocument: boolean
  required: boolean
  emphasize: boolean
  grantToLegalGuardians: boolean
  grantToProcuringHolders: boolean
  grantToPersonalRepresentatives: boolean
  allowExplicitDelegationGrant: boolean
  automaticDelegationGrant: boolean
  alsoForDelegatedUser: boolean
  isAccessControlled: boolean
  groupId?: string
}
